import { supabase } from "../supabase/client";
import { ZenithProperty } from "@/lib/types";

/**
 * LIVE FEED UPLINK
 * 
 * Fetches real-time property data from Supabase 
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

    // 1. LIVE SUPABASE CONNECTION (If Configured)
    // For now, we return empty list if not connected, relying on Omni/ArcGIS/Socrata
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        return [];
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
        units: p.units // Removed random simulator
    }));
}

/**
 * REAL-TIME SIGNAL UPLINK
 * Connects to institutional event stream for immediate market discovery.
 */
export function subscribeToLiveSignals(callback: (signal: any) => void) {

    // REAL-TIME UPLINK (Supabase)
    // Only activates if a valid production URL is present.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        console.log("[ZENITH LIVE] SIGNAL UPLINK: STANDBY (Waiting for Production Keys)");
        return () => { }; // No-op
    }

    const channel = supabase.channel('zenith-live-signals')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'signals' },
            (payload) => {
                console.log('[ZENITH LIVE] SIGNAL DETECTED:', payload);
                callback(payload.new);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}
