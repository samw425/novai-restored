
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!global.fetch) {
    global.fetch = require('node-fetch');
}

import { fetchOmniData } from '../src/lib/data/omni_client';
import DIRECTORY from '../src/lib/data/us_county_directory.json';

async function verifyOmni() {
    console.log("🦅 [SCOUT] TESTING OMNI-CLIENT HEURISTICS...\n");

    for (const entry of DIRECTORY) {
        console.log(`\n--- TARGET: ${entry.county} (${entry.state}) ---`);
        const results = await fetchOmniData(entry.url);

        console.log(`✅ [STATUS] RETURNED ${results.length} RECORDS`);
        if (results.length > 0) {
            console.log(`   📝 SAMPLE: ${results[0].address}`);
            console.log(`   👤 OWNER:  ${results[0].ownerName}`);
            console.log(`   💰 VALUE:  $${results[0].estimatedValue}`);
            console.log(`   🏗️ YEAR:   ${results[0].yearBuilt}`);
        } else {
            console.warn("   ⚠️ NO DATA MAPPED (Schema Detection Failed or Empty Endpoint)");
        }
    }
}

verifyOmni();
