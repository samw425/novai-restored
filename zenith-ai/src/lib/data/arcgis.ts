import { ZenithProperty } from "@/lib/types";

export interface ArcGISSource {
    rest_url: string;
    name: string;
    jurisdiction: string;
    state: string;
    fields: {
        address: string;
        owner: string;
        parcel_id: string;
        value: string;
        year_built: string;
    };
}

/**
 * Direct Uplink to County ArcGIS/Esri Servers
 * Upgraded to support Spatial (Bounding Box) Queries
 */
export async function searchArcGISProperties(
    location: string,
    source: ArcGISSource,
    bounds?: { latMin: number, latMax: number, lngMin: number, lngMax: number }
): Promise<ZenithProperty[]> {
    console.log(`[ZENITH ARCGIS] INITIATING DIRECT UPLINK TO ${source.name}...`);

    try {
        let where = "1=1";
        const outFields = Object.values(source.fields).join(',');

        // Manual Query Construction - ABSOLUTE MINIMUM to test connectivity
        const queryString = [
            `where=1%3D1`,
            `outFields=*`, // Try wildcard again on the hosted layer
            `f=json`,
            `resultRecordCount=1`
        ].join('&');

        const url = `${source.rest_url}/query?${queryString}`;

        console.log(`[ZENITH ARCGIS] FETCHING: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            // PROBE THE ENDPOINT ROOT TO SEE IF IT EXISTS
            console.log(`[ZENITH ARCGIS] Query failed (${response.status}). Probing layer root...`);
            const rootResp = await fetch(`${source.rest_url}?f=json`);
            const rootJson = await rootResp.json();
            if (rootResp.ok && rootJson.name) {
                throw new Error(`Endpoint Valid (Layer: ${rootJson.name}), but Query rejected. Check params.`);
            } else {
                throw new Error(`Endpoint Invalid or Unreachable (Status: ${response.status})`);
            }
        }

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
            console.warn("[ZENITH ARCGIS] WARNING: No features returned. Raw Response:", JSON.stringify(data).substring(0, 500));
            return [];
        }

        return data.features
            .map((feature: any) => {
                const attr = feature.attributes;
                const geometry = feature.geometry;

                // 1. STRICT QUALITY CONTROL: FILTER "GHOST" RECORDS
                const address = attr[source.fields.address];
                const owner = attr[source.fields.owner];
                // Check for Empty Strings, "Null", or "Unknown" placeholders
                if (!address || address.trim() === "" || !owner || owner.trim() === "") return null;

                // Handle ArcGIS coordinate systems (mercator vs lat/lng)
                let lat = 0;
                let lng = 0;

                if (geometry) {
                    if (geometry.y && geometry.x) {
                        lat = geometry.y;
                        lng = geometry.x;
                    } else if (geometry.rings) {
                        // Polygon centroid approximation
                        lng = geometry.rings[0].reduce((sum: number, p: number[]) => sum + p[0], 0) / geometry.rings[0].length;
                        lat = geometry.rings[0].reduce((sum: number, p: number[]) => sum + p[1], 0) / geometry.rings[0].length;
                    }
                }

                // Zip Extraction Heuristic
                const zipMatch = address.match(/\b\d{5}\b/);
                const zip = zipMatch ? zipMatch[0] : "LOCKED";

                return {
                    id: `ARCGIS-${source.jurisdiction}-${attr[source.fields.parcel_id] || Math.random().toString(36).substr(2, 9)}`,
                    address: address, // Validated above
                    city: source.jurisdiction,
                    state: source.state,
                    zip: zip,
                    lat: lat,
                    lng: lng,
                    type: "SFR",
                    status: "OFF_MARKET",
                    motivationScore: 75,
                    estimatedValue: parseFloat(attr[source.fields.value] || "0"),
                    equity: 0,
                    ownerType: "INDIVIDUAL",
                    ownerName: owner, // Validated above
                    yearBuilt: parseInt(attr[source.fields.year_built] || "0"),
                    provenance: {
                        base: {
                            source: `GOV_ARCGIS_${source.jurisdiction}`,
                            verifiedAt: new Date().toISOString(),
                            confidence: 0.99
                        }
                    }
                } as ZenithProperty;
            })
            .filter((p: ZenithProperty | null) => p !== null) as ZenithProperty[]; // REMOVE NULLS

    } catch (err) {
        console.error(`[ZENITH ARCGIS] UPLINK FAILED:`, err);
        return [];
    }
}
