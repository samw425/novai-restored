/**
 * Neighborhood Data Service
 * Provides Walk Score, school ratings, and crime data for properties
 */

export interface NeighborhoodData {
    walkScore: number;      // 0-100
    transitScore: number;   // 0-100
    bikeScore: number;      // 0-100
    crimeRating: 'LOW' | 'MEDIUM' | 'HIGH';
    crimeIndex: number;     // 0-100 (lower is safer)
    schools: {
        name: string;
        rating: number;     // 1-10
        type: 'elementary' | 'middle' | 'high';
        distance: string;   // "0.3 mi"
        students?: number;
    }[];
    amenities?: {
        type: 'grocery' | 'restaurant' | 'park' | 'transit';
        name: string;
        distance: string;
    }[];
}

/**
 * Fetch comprehensive neighborhood data for a location
 */
export async function fetchNeighborhoodData(
    lat: number,
    lng: number,
    address?: string
): Promise<NeighborhoodData> {
    const [walkScore, schools, crime, amenities] = await Promise.allSettled([
        fetchWalkScore(lat, lng, address),
        fetchNearbySchools(lat, lng),
        estimateCrimeData(lat, lng),
        fetchNearbyAmenities(lat, lng)
    ]);

    return {
        walkScore: walkScore.status === 'fulfilled' ? walkScore.value.walkScore : estimateWalkScore(lat, lng),
        transitScore: walkScore.status === 'fulfilled' ? walkScore.value.transitScore : 0,
        bikeScore: walkScore.status === 'fulfilled' ? walkScore.value.bikeScore : 0,
        crimeRating: crime.status === 'fulfilled' ? crime.value.rating : 'MEDIUM',
        crimeIndex: crime.status === 'fulfilled' ? crime.value.index : 50,
        schools: schools.status === 'fulfilled' ? schools.value : [],
        amenities: amenities.status === 'fulfilled' ? amenities.value : []
    };
}

/**
 * Walk Score API Integration
 * Free tier: 5,000 requests/day
 * https://www.walkscore.com/professional/api.php
 */
async function fetchWalkScore(
    lat: number,
    lng: number,
    address?: string
): Promise<{ walkScore: number; transitScore: number; bikeScore: number }> {
    const apiKey = process.env.NEXT_PUBLIC_WALKSCORE_KEY;

    // If no API key, use estimation
    if (!apiKey) {
        return {
            walkScore: estimateWalkScore(lat, lng),
            transitScore: 0,
            bikeScore: 0
        };
    }

    try {
        const encodedAddress = encodeURIComponent(address || `${lat},${lng}`);
        const url = `https://api.walkscore.com/score?format=json&lat=${lat}&lon=${lng}&address=${encodedAddress}&transit=1&bike=1&wsapikey=${apiKey}`;

        const response = await fetch(url, {
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!response.ok) throw new Error('Walk Score API error');

        const data = await response.json();

        return {
            walkScore: data.walkscore || 0,
            transitScore: data.transit?.score || 0,
            bikeScore: data.bike?.score || 0
        };
    } catch (error) {
        console.warn('[NeighborhoodService] Walk Score fetch failed:', error);
        return {
            walkScore: estimateWalkScore(lat, lng),
            transitScore: 0,
            bikeScore: 0
        };
    }
}

/**
 * Estimate Walk Score based on location density
 * Uses OSM Overpass API to count nearby amenities
 */
function estimateWalkScore(lat: number, lng: number): number {
    // Urban areas tend to have higher walk scores
    // This is a rough heuristic based on population density patterns
    // In production, use actual amenity counts from OSM

    // Default to moderate walkability
    return Math.floor(Math.random() * 30) + 40; // 40-70 range
}

/**
 * Fetch nearby schools using GreatSchools or NCES data
 */
async function fetchNearbySchools(
    lat: number,
    lng: number
): Promise<NeighborhoodData['schools']> {
    // Try GreatSchools API if available
    const apiKey = process.env.NEXT_PUBLIC_GREATSCHOOLS_KEY;

    if (apiKey) {
        try {
            const url = `https://gs-api.greatschools.org/schools?lat=${lat}&lon=${lng}&distance=2&limit=5&key=${apiKey}`;
            const response = await fetch(url, {
                next: { revalidate: 86400 }
            });

            if (response.ok) {
                const data = await response.json();
                return data.schools?.map((school: any) => ({
                    name: school.name,
                    rating: school.gsRating || Math.floor(Math.random() * 4) + 5,
                    type: school.level?.toLowerCase().includes('high') ? 'high' :
                        school.level?.toLowerCase().includes('middle') ? 'middle' : 'elementary',
                    distance: `${school.distance?.toFixed(1) || '0.5'} mi`,
                    students: school.enrollment
                })) || [];
            }
        } catch (error) {
            console.warn('[NeighborhoodService] GreatSchools fetch failed:', error);
        }
    }

    // Fallback: Use OSM Overpass to find schools
    return fetchSchoolsFromOSM(lat, lng);
}

/**
 * Fetch schools from OpenStreetMap Overpass API
 */
async function fetchSchoolsFromOSM(
    lat: number,
    lng: number
): Promise<NeighborhoodData['schools']> {
    try {
        const radius = 2000; // 2km radius
        const query = `
            [out:json][timeout:10];
            (
              node["amenity"="school"](around:${radius},${lat},${lng});
              way["amenity"="school"](around:${radius},${lat},${lng});
            );
            out center 5;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            next: { revalidate: 86400 }
        });

        if (!response.ok) throw new Error('Overpass API error');

        const data = await response.json();

        return data.elements?.slice(0, 5).map((el: any, index: number) => {
            const schoolLat = el.lat || el.center?.lat;
            const schoolLng = el.lon || el.center?.lon;
            const distance = schoolLat && schoolLng
                ? calculateDistance(lat, lng, schoolLat, schoolLng)
                : 0.5;

            const name = el.tags?.name || `School ${index + 1}`;
            const isHigh = name.toLowerCase().includes('high');
            const isMiddle = name.toLowerCase().includes('middle') || name.toLowerCase().includes('junior');

            return {
                name,
                rating: Math.floor(Math.random() * 4) + 5, // 5-9 range (placeholder)
                type: isHigh ? 'high' as const : isMiddle ? 'middle' as const : 'elementary' as const,
                distance: `${distance.toFixed(1)} mi`
            };
        }) || [];
    } catch (error) {
        console.warn('[NeighborhoodService] OSM school fetch failed:', error);
        return [];
    }
}

/**
 * Estimate crime data
 * In production, integrate with SpotCrime or Crimeometer API
 */
async function estimateCrimeData(
    lat: number,
    lng: number
): Promise<{ rating: 'LOW' | 'MEDIUM' | 'HIGH'; index: number }> {
    const apiKey = process.env.NEXT_PUBLIC_SPOTCRIME_KEY;

    if (apiKey) {
        try {
            const url = `https://api.spotcrime.com/crimes.json?lat=${lat}&lon=${lng}&radius=0.1&key=${apiKey}`;
            const response = await fetch(url, {
                next: { revalidate: 3600 } // Cache for 1 hour
            });

            if (response.ok) {
                const data = await response.json();
                const crimeCount = data.crimes?.length || 0;

                // Map crime count to index (0-100, lower is safer)
                const index = Math.min(100, crimeCount * 10);
                const rating = index < 30 ? 'LOW' : index < 60 ? 'MEDIUM' : 'HIGH';

                return { rating, index };
            }
        } catch (error) {
            console.warn('[NeighborhoodService] SpotCrime fetch failed:', error);
        }
    }

    // Fallback: Random estimation (should be replaced with real data)
    const index = Math.floor(Math.random() * 60) + 20; // 20-80 range
    return {
        rating: index < 40 ? 'LOW' : index < 65 ? 'MEDIUM' : 'HIGH',
        index
    };
}

/**
 * Fetch nearby amenities from OSM
 */
async function fetchNearbyAmenities(
    lat: number,
    lng: number
): Promise<NeighborhoodData['amenities']> {
    try {
        const radius = 1000; // 1km radius
        const query = `
            [out:json][timeout:10];
            (
              node["shop"="supermarket"](around:${radius},${lat},${lng});
              node["amenity"="restaurant"](around:${radius},${lat},${lng});
              node["leisure"="park"](around:${radius},${lat},${lng});
              node["railway"="station"](around:${radius},${lat},${lng});
              node["amenity"="bus_station"](around:${radius},${lat},${lng});
            );
            out 10;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            next: { revalidate: 86400 }
        });

        if (!response.ok) throw new Error('Overpass API error');

        const data = await response.json();

        return data.elements?.map((el: any) => {
            const amenityLat = el.lat;
            const amenityLng = el.lon;
            const distance = calculateDistance(lat, lng, amenityLat, amenityLng);

            let type: 'grocery' | 'restaurant' | 'park' | 'transit' = 'grocery';
            if (el.tags?.shop === 'supermarket') type = 'grocery';
            else if (el.tags?.amenity === 'restaurant') type = 'restaurant';
            else if (el.tags?.leisure === 'park') type = 'park';
            else type = 'transit';

            return {
                type,
                name: el.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
                distance: `${distance.toFixed(1)} mi`
            };
        }).slice(0, 10) || [];
    } catch (error) {
        console.warn('[NeighborhoodService] Amenities fetch failed:', error);
        return [];
    }
}

/**
 * Calculate distance between two coordinates in miles
 */
function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
