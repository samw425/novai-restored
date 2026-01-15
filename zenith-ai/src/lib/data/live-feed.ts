import { supabase } from "../supabase/client";
import { ZenithProperty, MOCK_PROPERTIES } from "./mock-properties";

/**
 * LIVE DATA SERVICE (Alpha-1)
 * 
 * This service handles live fetching of property data from Supabase
 * using geospatial filters (PostGIS).
 */

export async function fetchPropertiesInBounds(
    minLng: number, minLat: number,
    maxLng: number, maxLat: number,
    filters?: {
        minUnits?: number;
        maxUnits?: number;
        minScore?: number;
    }
): Promise<ZenithProperty[]> {

    // Fallback to Advanced Mock Data (Alpha-2 Simulator)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        console.log("ZENITH: Alpha-2 Simulator (Nationwide Feed)");

        // Dynamic generation for national simulation if viewport is outside mock range
        return MOCK_PROPERTIES.filter(p =>
            p.lng >= minLng && p.lng <= maxLng &&
            p.lat >= minLat && p.lat <= maxLat
        ).filter(p => {
            if (filters?.minScore && p.motivationScore < filters.minScore) return false;
            return true;
        });
    }

    const { data, error } = await supabase
        .rpc('get_properties_in_viewport', {
            min_lng: minLng,
            min_lat: minLat,
            max_lng: maxLng,
            max_lat: maxLat
        });

    if (error) {
        console.error("ZENITH: Live Fetch Error:", error);
        return [];
    }

    return (data || []).map((p: any) => ({
        id: p.id,
        address: p.address,
        lat: p.lat,
        lng: p.lng,
        type: p.property_type || "SFR",
        status: p.tax_delinquent ? "TAX_DELINQUENT" : (p.pre_foreclosure ? "PRE_FORECLOSURE" : "OFF_MARKET"),
        motivationScore: p.motivation_score,
        estimatedValue: p.assessed_value,
        equity: p.estimated_equity,
        ownerType: p.is_absentee ? "ABSENTEE" : "INDIVIDUAL",
        units: Math.floor(Math.random() * 4) + 1 // Simulate units for Alpha-2
    }));
}

/**
 * MOCK LIVE FEED (For Demo/Testing)
 * Simulates a real-time signal hit from a county recorder.
 */
export function subscribeToLiveSignals(callback: (signal: any) => void) {
    // In a real app, this would be a Supabase Realtime subscription
    // or a webhook listener.
    const interval = setInterval(() => {
        // Randomly simulate a "New Tax Delinquency" signal
        if (Math.random() > 0.8) {
            callback({
                type: "SIGNAL_DISTRESS",
                payload: {
                    address: "New Signal Detected...",
                    severity: "HIGH"
                }
            });
        }
    }, 10000);

    return () => clearInterval(interval);
}
