
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { searchRentCastProperties } from '../src/lib/api/rentcast';
import { searchArcGISProperties } from '../src/lib/data/arcgis';
import { searchOSMProperties } from '../src/lib/data/osm';
import ARCGIS_REGISTRY from '../src/lib/data/arcgis_registry.json';

// MOCK THE BROWSER FETCH IF RUNNING IN NODE
if (!global.fetch) {
    global.fetch = require('node-fetch');
}

async function runAgentCheck() {
    console.log("🦅 [COO] ACTIVATING DATA SQUAD FOR UPLINK VERIFICATION...\n");

    // 1. AGENT RENTCAST CHECK
    console.log("--- AGENT RENTCAST: VALUATION CHECK (Austin, TX) ---");
    try {
        const rcData = await searchRentCastProperties("Austin, TX");
        console.log(`✅ [SUCCESS] RentCast returned ${rcData?.properties?.length || 0} assets.`);
        if (rcData?.properties?.length > 0) {
            console.log(`   Sample: ${rcData.properties[0].address} | Val: $${rcData.properties[0].estimatedValue}`);
        }
    } catch (e: any) {
        console.error("❌ [FAIL] RentCast Uplink Failed:", e.message);
    }
    console.log("\n");

    // 2. AGENT ARCGIS CHECK (ALL COUNTIES)
    console.log("--- AGENT ARCGIS: NATIONWIDE UPLINK CHECK ---");
    const testCounties = ["travis_county_tx", "miami_dade_fl", "la_county_ca", "harris_county_tx"];

    for (const key of testCounties) {
        try {
            const source = (ARCGIS_REGISTRY as any)[key];
            if (source) {
                console.log(`\nTesting Uplink: ${source.name} (${key})...`);
                const arcData = await searchArcGISProperties("Austin", source, undefined);
                console.log(`✅ [${key}] Status: ${arcData?.length || 0} records.`);
                if (arcData?.length > 0) {
                    console.log(`   Sample: ${arcData[0].address} | Owner: ${arcData[0].ownerName}`);
                }
            } else {
                console.warn(`⚠️ [${key}] Source key not found in registry.`);
            }
        } catch (e: any) {
            console.error(`❌ [${key}] Connection Failed:`, e.message);
        }
    }
    console.log("\n");

    // 3. AGENT ATLAS (OSM) CHECK
    console.log("--- AGENT ATLAS: OSM GEOMETRY CHECK (Nationwide) ---");
    try {
        // Check near Times Square, NY
        const center = { lat: 40.7580, lng: -73.9855 };
        const osmData = await searchOSMProperties(center, 200);
        console.log(`✅ [SUCCESS] OSM returned ${osmData?.length || 0} building footprints.`);
    } catch (e) {
        console.error("❌ [FAIL] OSM Uplink Failed:", (e as any).message);
    }

    console.log("\n🦅 [COO] VERIFICATION COMPLETE.");
}

runAgentCheck();
