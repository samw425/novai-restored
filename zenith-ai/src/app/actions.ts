'use server'

import { queryZenithOracle, ZenithOracleResponse } from '@/lib/data/oracle';

/**
 * ZENITH SOVEREIGN ACTION
 * Executes Intelligence Oracle on the Server Side.
 * Bypasses CORS, Rate Limits, and Client-Side Weaknesses.
 */
export async function searchSector(
    location: string,
    bounds?: { latMin: number, latMax: number, lngMin: number, lngMax: number }
): Promise<ZenithOracleResponse> {
    console.log(`[SERVER ACTION] EXECUTING SECTOR SEARCH: ${location}`);

    try {
        const result = await queryZenithOracle(location, bounds);
        return result;
    } catch (e) {
        console.error(`[SERVER ACTION] CRITICAL FAILURE:`, e);
        // Return a safe fallback structure
        return {
            properties: [],
            signals: [],
            center: { lat: 39.8283, lng: -98.5795 },
            networkGroups: [],
            intelFeed: [],
            isLive: false,
            activeSector: "SECTOR_OFFLINE"
        };
    }
}
