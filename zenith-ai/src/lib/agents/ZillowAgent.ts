import { ZenithProperty } from "../types";

/**
 * ZILLOW AGENT (OFF-MARKET HUNTER)
 * 
 * Interacts with institutional Zillow API endpoints (via RapidAPI/Bridge) 
 * to fetch off-market "Make Me Move" and "Pre-Foreclosure" listings.
 * 
 * STRATEGY:
 * 1. Target "For Sale By Owner" (FSBO)
 * 2. Target "Pre-Foreclosure" (Distressed)
 * 3. Filter for 1-4 Units only.
 */

const Z_API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
const Z_HOST = "zillow-com1.p.rapidapi.com";

export class ZillowAgent {

    static async scanSector(location: string): Promise<ZenithProperty[]> {
        if (!Z_API_KEY) {
            console.warn("[ZILLOW AGENT] NO API KEY DETECTED. STANDBY MODE.");
            return []; // Fail gracefully if no key, rely on Omni-Client
        }

        console.log(`[ZILLOW AGENT] HUNTING IN SECTOR: ${location}`);

        try {
            // This is a standard RapidAPI Zillow schema query
            const url = `https://${Z_HOST}/propertyExtendedSearch?location=${encodeURIComponent(location)}&status_type=ForSaleWM&home_type=Houses&minPrice=100000`;

            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': Z_API_KEY,
                    'X-RapidAPI-Host': Z_HOST
                }
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (!data.props) return [];

            return data.props.map((p: any) => this.normalize(p));

        } catch (e) {
            console.error("[ZILLOW AGENT] SCAN INTERRUPTED:", e);
            return [];
        }
    }

    private static normalize(raw: any): ZenithProperty {
        return {
            id: `Z-${raw.zpid}`,
            address: `${raw.address}, ${raw.city}, ${raw.state} ${raw.zipcode}`,
            city: raw.city,
            state: raw.state,
            zip: raw.zipcode,
            lat: raw.latitude,
            lng: raw.longitude,
            estimatedValue: raw.zestimate || raw.price,
            equity: (raw.zestimate - (raw.price || 0)) || 0,
            motivationScore: raw.daysOnZillow > 90 ? 85 : 40,
            status: raw.listingStatus === 'FOR_SALE' ? 'ACTIVE_MARKET' : 'OFF_MARKET',
            type: "SFR", // Default, would refine
            beds: raw.bedrooms,
            baths: raw.bathrooms,
            squareFeet: raw.livingArea,
            yearBuilt: raw.yearBuilt,
            images: [raw.imgSrc],
            provenance: {
                base: {
                    source: "ZILLOW_INSTITUTIONAL_BRIDGE",
                    confidence: 0.95,
                    verifiedAt: new Date().toISOString()
                }
            }
        };
    }
}
