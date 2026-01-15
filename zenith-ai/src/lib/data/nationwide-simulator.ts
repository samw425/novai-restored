import { ZenithProperty } from "./mock-properties";

// Basic Lat/Lng lookup for major hubs to ensure "flyTo" feels real
const CITY_COORDS: Record<string, { lat: number, lng: number }> = {
    "austin": { lat: 30.2672, lng: -97.7431 },
    "new york": { lat: 40.7128, lng: -74.0060 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    "miami": { lat: 25.7617, lng: -80.1918 },
    "chicago": { lat: 41.8781, lng: -87.6298 },
    "detroit": { lat: 42.3314, lng: -83.0458 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    "beverly hills": { lat: 34.0736, lng: -118.4004 },
    "seattle": { lat: 47.6062, lng: -122.3321 },
    "seattle": { lat: 47.6062, lng: -122.3321 },
    "denver": { lat: 39.7392, lng: -104.9903 }
};
const US_CENTER = { lat: 39.8283, lng: -98.5795 };

// Street Names for realism
const STREETS = ["Maple", "Oak", "Cedar", "Pine", "Elm", "Washington", "Lake", "Hill", "Sunset", "Broadway", "Main", "Highland", "Park", "View"];
const TYPES = ["St", "Ave", "Blvd", "Ln", "Rd", "Dr", "Ct"];

export function generatePropertiesForLocation(query: string): { properties: ZenithProperty[], center: { lat: number, lng: number } } {
    const normalizedQuery = query.toLowerCase().trim();

    // 1. Determine Center
    let center = US_CENTER;

    // Try to find a match in our lookup
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
        if (normalizedQuery.includes(city)) {
            center = coords;
            break;
        }
    }

    // ROBUST FALLBACK: If still unknown, generate a deterministic Lat/Lng based on the string hash.
    // This ensures that "Topeka" always maps to a specific spot (even if fake) rather than the generic US Center.
    if (center === US_CENTER) {
        let hash = 0;
        for (let i = 0; i < normalizedQuery.length; i++) {
            hash = ((hash << 5) - hash) + normalizedQuery.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }

        // Map hash to US bounds approx:
        // Lat: 25 to 48
        // Lng: -125 to -70
        const lat = 25 + (Math.abs(hash) % 2300) / 100;
        const lng = -125 + (Math.abs(hash >> 16) % 5500) / 100;

        center = { lat, lng };
    }

    // 2. Generate Properties around this center
    const properties: ZenithProperty[] = [];
    const count = 25 + Math.floor(Math.random() * 20);

    for (let i = 0; i < count; i++) {
        // Random offset from center (approx 1-3 miles)
        const latOffset = (Math.random() - 0.5) * 0.04;
        const lngOffset = (Math.random() - 0.5) * 0.04;

        const address = `${100 + Math.floor(Math.random() * 9000)} ${STREETS[Math.floor(Math.random() * STREETS.length)]} ${TYPES[Math.floor(Math.random() * TYPES.length)]}`;

        // Values based on query "vibe" (simple heuristics)
        let baseValue = 450000;
        if (normalizedQuery.includes("hills") || normalizedQuery.includes("york") || normalizedQuery.includes("angeles")) baseValue = 1200000;
        if (normalizedQuery.includes("detroit") || normalizedQuery.includes("ohio")) baseValue = 150000;

        const estimatedValue = baseValue * (0.8 + Math.random() * 0.4);
        const motivationScore = Math.floor(Math.random() * 100);
        const equity = estimatedValue * Math.random();

        let status: ZenithProperty['status'] = "OFF_MARKET";
        if (motivationScore > 85) status = "PRE_FORECLOSURE";
        else if (motivationScore > 75) status = "TAX_DELINQUENT";
        else if (motivationScore > 60) status = "FSBO";

        properties.push({
            id: `sim-${i}-${Date.now()}`,
            address: `${address}, ${query.toUpperCase()}`, // Use user's query in address to confirm it "worked"
            lat: center.lat + latOffset,
            lng: center.lng + lngOffset,
            type: Math.random() > 0.8 ? "MF_4" : "SFR",
            status,
            motivationScore,
            estimatedValue: Math.floor(estimatedValue),
            equity: Math.floor(equity),
            ownerType: Math.random() > 0.7 ? "ABSENTEE" : "INDIVIDUAL",
            lastSaleDate: `${1990 + Math.floor(Math.random() * 34)}-01-15`,
            ...(status === 'PRE_FORECLOSURE' ? {
                distressSignal: {
                    type: "LIS_PENDENS",
                    date: "2024-03-01",
                    description: "Public notice of default filed.",
                    amount: Math.floor(estimatedValue * 0.1)
                }
            } : {})
        });
    }

    return { properties, center };
}
