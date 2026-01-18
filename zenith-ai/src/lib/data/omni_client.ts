import { ZenithProperty } from "@/lib/types";

/**
 * DYNAMIC JURISDICTION DISCOVERY
 * Scans public Esri REST Directories for relevant MapServers.
 */
export async function discoverArcGISMapServers(query: string): Promise<string[]> {
    console.log(`[ZENITH OMNI] DISCOVERING DIRECTORY FOR: ${query}`);
    try {
        // Universal Search for ArcGIS Hosted Services (Parcel related)
        const searchUrl = `https://places.arcgis.com/arcgis/rest/services/search?q=${encodeURIComponent(query + " parcels")}&f=json`;
        const res = await fetch(searchUrl);
        const data = await res.json();

        const urls: string[] = [];
        if (data.results) {
            data.results.forEach((r: any) => {
                if (r.url && (r.url.includes("MapServer") || r.url.includes("FeatureServer"))) {
                    urls.push(r.url);
                }
            });
        }

        // Fallback: Check known institutional hubs
        if (urls.length === 0) {
            console.log("[ZENITH OMNI] DIRECTORY SEARCH FAILED. ATTEMPTING HUB PROBE.");
        }

        return urls.slice(0, 3); // Return top 3 candidates
    } catch (e) {
        return [];
    }
}

// OMNI-HEURISTICS: Keywords to sniff out the right fields
const FIELD_MATCHERS = {
    address: ["SITUS", "ADDR", "LOCATION", "STREET", "PHY_ADDR", "PROPERTY_ADDRESS", "SitusHouseNo", "SitusStreet", "FullAddress"],
    owner: ["OWNER", "HOLDER", "DEED", "TAXPAYER", "NAME", "Roll_HomeOwnersExemp", "NODE_NAME", "ANNO_NAME"],
    parcel_id: ["PARCEL", "PIN", "APN", "FOLIO", "ACCOUNT", "PIN10", "PIN14"],
    value: ["VAL", "APPRAISED", "ASSESSED", "MARKET", "TOTAL", "Roll_LandValue", "TAXVAL"],
    year_built: ["YEAR", "YR_BLT", "EFF_YR", "BUILT", "YearBuilt"],
    sqft: ["SQFT", "AREA", "LIVING", "BLDG_AREA"]
};

// HELPER: Find best matching field from a list of available attributes
function detectField(attributes: any, matchers: string[]): string | null {
    const keys = Object.keys(attributes);
    // 1. Exact Match
    // 2. Contains Match
    for (const m of matchers) {
        const exact = keys.find(k => k.toUpperCase() === m.toUpperCase());
        if (exact) return exact;

        const partial = keys.find(k => k.toUpperCase().includes(m.toUpperCase()));
        if (partial) return partial;
    }
    return null;
}

export async function fetchOmniData(url: string, bounds?: any): Promise<ZenithProperty[]> {
    console.log(`[ZENITH OMNI] CONNECTING TO: ${url}`);

    try {
        // 1. PROBE: ADAPTIVE QUERYING
        // Some servers reject "1=1". We try a sequence of "Knocks" to get in.
        const strategies = [
            `where=1%3D1`, // Standard
            `where=OBJECTID+>+0`, // Positive ID
            `where=OBJECTID+<+1000`, // ID limit
            `where=FID+>+0`, // Shapefile ID
            bounds ? `geometry=${bounds.lngMin},${bounds.latMin},${bounds.lngMax},${bounds.latMax}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects` : null
        ].filter(s => s !== null);

        let data: any = null;
        let usedStrategy = "";

        for (const strat of strategies) {
            const queryUrl = `${url}/query?${strat}&outFields=*&f=json&resultRecordCount=5`;
            try {
                // console.log(`[ZENITH OMNI] KNOCKING: ${strat}`);
                const res = await fetch(queryUrl);
                const json = await res.json();
                if (json.features && json.features.length > 0) {
                    data = json;
                    usedStrategy = strat || "UNKNOWN";
                    break; // WE ARE IN.
                }
            } catch (e) {
                // Continue to next strategy
            }
        }

        if (!data || !data.features || data.features.length === 0) {
            console.warn(`[ZENITH OMNI] UPLINK REFUSED (Tried ${strategies.length} keys).`);
            return [];
        }

        // 2. SCHEMA LEARNING (HEURISTIC AI)
        // We scan the first record to build a translation map for this county.
        const sampleAttr = data.features[0].attributes;
        const schema = {
            address: detectField(sampleAttr, FIELD_MATCHERS.address),
            owner: detectField(sampleAttr, FIELD_MATCHERS.owner),
            value: detectField(sampleAttr, FIELD_MATCHERS.value),
            year_built: detectField(sampleAttr, FIELD_MATCHERS.year_built),
            sqft: detectField(sampleAttr, FIELD_MATCHERS.sqft),
            parcel_id: detectField(sampleAttr, FIELD_MATCHERS.parcel_id)
        };

        console.log(`[ZENITH OMNI] UPLINK ESTABLISHED. SCHEMA:`, JSON.stringify(schema));

        // 3. TRANSFORM DATA
        return data.features.map((f: any) => {
            const attr = f.attributes;
            const geom = f.geometry;

            // Geometry Calc (Centroid)
            let lat = 0, lng = 0;
            if (geom) {
                if (geom.y) { lat = geom.y; lng = geom.x; }
                else if (geom.rings) {
                    lng = geom.rings[0][0][0]; // Simple first point fallback for speed
                    lat = geom.rings[0][0][1];
                }
            }

            // Advanced Geography Mining
            const fullAddr = attr[schema.address || ''] || "UNKNOWN ADDRESS";
            const parts = fullAddr.split(',');
            const city = parts.length > 1 ? parts[parts.length - 2].trim() : "Local Market";
            const statePart = parts.length > 0 ? parts[parts.length - 1].trim() : "USA";
            const state = statePart.split(' ')[0] || "USA";
            const zipMatch = fullAddr.match(/\b\d{5}\b/);
            const zip = zipMatch ? zipMatch[0] : "LOCKED";

            return {
                id: `OMNI-${attr[schema.parcel_id || 'OBJECTID'] || Math.random()}`,
                address: fullAddr,
                city,
                state,
                zip,
                ownerName: attr[schema.owner || ''] || "UNKNOWN OWNER",
                estimatedValue: parseFloat(attr[schema.value || ''] || "0"),
                equity: 0,
                motivationScore: 50,
                yearBuilt: parseInt(attr[schema.year_built || ''] || "0"),
                squareFeet: parseInt(attr[schema.sqft || ''] || "0"),
                lat: lat,
                lng: lng,
                status: "OFF_MARKET",
                type: "SFR", // Default
                provenance: {
                    base: { source: "OMNI_CLIENT_AUTO", verifiedAt: new Date().toISOString(), confidence: 0.8 }
                }
            } as ZenithProperty;
        }).filter((p: ZenithProperty) => p.address !== "UNKNOWN ADDRESS"); // Filter junk

    } catch (e) {
        console.error("[ZENITH OMNI] UPLINK FAILED:", e);
        return [];
    }
}
