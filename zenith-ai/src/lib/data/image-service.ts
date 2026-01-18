/**
 * Property Image Service
 * Multi-source image fetching with fallbacks
 * 
 * Priority order:
 * 1. Existing property images (if any)
 * 2. Mapillary (free street-level imagery)
 * 3. Google Street View (paid, high quality)
 * 4. ArcGIS satellite imagery (free fallback)
 */

export interface PropertyImages {
    primary: string | null;
    gallery: string[];
    hasStreetView: boolean;
    sources: {
        type: 'UPLOADED' | 'MAPILLARY' | 'GOOGLE_STREETVIEW' | 'SATELLITE';
        url: string;
        thumbnail?: string;
    }[];
}

const MAPILLARY_TOKEN = process.env.NEXT_PUBLIC_MAPILLARY_TOKEN || "";
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

/**
 * Fetch all available images for a property
 */
export async function fetchPropertyImages(
    lat: number,
    lng: number,
    address?: string,
    existingImages?: string[]
): Promise<PropertyImages> {
    const sources: PropertyImages['sources'] = [];
    const gallery: string[] = [];

    // 1. Use existing images if provided
    if (existingImages && existingImages.length > 0) {
        existingImages.forEach(url => {
            gallery.push(url);
            sources.push({ type: 'UPLOADED', url });
        });
    }

    // 2. Try Mapillary (free, crowdsourced street imagery)
    if (MAPILLARY_TOKEN) {
        try {
            const mapillaryUrl = await fetchMapillaryImage(lat, lng);
            if (mapillaryUrl) {
                gallery.push(mapillaryUrl);
                sources.push({ type: 'MAPILLARY', url: mapillaryUrl });
            }
        } catch (e) {
            console.warn('[ImageService] Mapillary fetch failed:', e);
        }
    }

    // 3. Add Google Street View if we have the API key
    if (GOOGLE_MAPS_KEY) {
        const streetViewUrl = buildGoogleStreetViewUrl(lat, lng);
        // Verify the image exists (not all locations have Street View)
        const hasStreetView = await checkGoogleStreetViewCoverage(lat, lng);
        if (hasStreetView) {
            gallery.push(streetViewUrl);
            sources.push({ type: 'GOOGLE_STREETVIEW', url: streetViewUrl });
        }
    }

    // 4. Always add high-res satellite as fallback
    const satelliteUrl = buildSatelliteImageUrl(lat, lng, 18);
    gallery.push(satelliteUrl);
    sources.push({ type: 'SATELLITE', url: satelliteUrl });

    // Also add a wider zoom satellite for context
    const contextSatelliteUrl = buildSatelliteImageUrl(lat, lng, 16);
    gallery.push(contextSatelliteUrl);
    sources.push({ type: 'SATELLITE', url: contextSatelliteUrl });

    return {
        primary: gallery[0] || null,
        gallery,
        hasStreetView: sources.some(s => s.type === 'GOOGLE_STREETVIEW' || s.type === 'MAPILLARY'),
        sources
    };
}

// ============== MAPILLARY INTEGRATION ==============

/**
 * Fetch street-level image from Mapillary (free)
 * https://www.mapillary.com/developer
 */
async function fetchMapillaryImage(lat: number, lng: number): Promise<string | null> {
    if (!MAPILLARY_TOKEN) return null;

    try {
        // Search for images within 50 meters of the location
        const bbox = getBoundingBox(lat, lng, 0.0005); // ~50m radius

        const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,thumb_1024_url,captured_at,compass_angle&bbox=${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}&limit=5`;

        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 86400 * 7 } // Cache for 7 days
        });

        if (!response.ok) {
            console.warn('[Mapillary] API error:', response.status);
            return null;
        }

        const data = await response.json();

        // Return the first available image
        if (data.data && data.data.length > 0) {
            // Sort by recency and prefer forward-facing images
            const sorted = data.data.sort((a: any, b: any) => {
                const aDate = new Date(a.captured_at).getTime();
                const bDate = new Date(b.captured_at).getTime();
                return bDate - aDate; // Most recent first
            });

            return sorted[0].thumb_1024_url || null;
        }

        return null;
    } catch (error) {
        console.error('[Mapillary] Fetch error:', error);
        return null;
    }
}

/**
 * Get multiple Mapillary images for gallery
 */
export async function fetchMapillaryGallery(lat: number, lng: number, limit = 5): Promise<string[]> {
    if (!MAPILLARY_TOKEN) return [];

    try {
        const bbox = getBoundingBox(lat, lng, 0.001); // ~100m radius

        const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,thumb_1024_url&bbox=${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}&limit=${limit}`;

        const response = await fetch(url, {
            next: { revalidate: 86400 * 7 }
        });

        if (!response.ok) return [];

        const data = await response.json();

        return data.data
            ?.filter((img: any) => img.thumb_1024_url)
            .map((img: any) => img.thumb_1024_url) || [];
    } catch (error) {
        console.error('[Mapillary] Gallery fetch error:', error);
        return [];
    }
}

// ============== GOOGLE STREET VIEW ==============

/**
 * Build Google Street View static image URL
 * Note: Costs $7 per 1000 requests
 */
function buildGoogleStreetViewUrl(lat: number, lng: number, size = '800x600'): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&key=${GOOGLE_MAPS_KEY}&source=outdoor`;
}

/**
 * Check if Street View coverage exists at location
 */
async function checkGoogleStreetViewCoverage(lat: number, lng: number): Promise<boolean> {
    if (!GOOGLE_MAPS_KEY) return false;

    try {
        const url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${GOOGLE_MAPS_KEY}`;

        const response = await fetch(url, {
            next: { revalidate: 86400 * 30 } // Cache for 30 days
        });

        if (!response.ok) return false;

        const data = await response.json();
        return data.status === 'OK';
    } catch {
        return false;
    }
}

// ============== SATELLITE IMAGERY ==============

/**
 * Build ArcGIS World Imagery URL (free)
 */
function buildSatelliteImageUrl(lat: number, lng: number, zoom: number): string {
    const tileX = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
    const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
}

/**
 * Build static map with property marker
 */
export function buildStaticMapUrl(lat: number, lng: number, zoom = 16, width = 800, height = 400): string {
    if (GOOGLE_MAPS_KEY) {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=hybrid&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_KEY}`;
    }

    // Fallback to OpenStreetMap static
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},red`;
}

// ============== HELPER FUNCTIONS ==============

/**
 * Calculate bounding box from center point
 */
function getBoundingBox(lat: number, lng: number, offset: number): {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
} {
    return {
        minLat: lat - offset,
        maxLat: lat + offset,
        minLng: lng - offset,
        maxLng: lng + offset
    };
}

/**
 * Get placeholder image for properties without images
 */
export function getPlaceholderImage(type: 'house' | 'apartment' | 'land' | 'commercial' = 'house'): string {
    const placeholders: Record<string, string> = {
        house: '/images/placeholder-house.jpg',
        apartment: '/images/placeholder-apartment.jpg',
        land: '/images/placeholder-land.jpg',
        commercial: '/images/placeholder-commercial.jpg'
    };
    return placeholders[type] || placeholders.house;
}

/**
 * Preload images for better UX
 */
export function preloadImages(urls: string[]): void {
    if (typeof window === 'undefined') return;

    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
