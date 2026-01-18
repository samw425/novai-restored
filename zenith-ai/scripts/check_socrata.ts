
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Mock fetch for Node environment
if (!global.fetch) {
    global.fetch = require('node-fetch');
}

import { searchSocrataProperties } from '../src/lib/data/socrata';

async function verifySocrata() {
    console.log("🦅 [COO] VERIFYING SOCRATA OPEN DATA NETWORK...\n");

    const cities = ["Austin, TX", "Chicago, IL", "New York, NY", "Los Angeles, CA"];

    for (const city of cities) {
        console.log(`--- TESTING UPLINK: ${city.toUpperCase()} ---`);
        try {
            const results = await searchSocrataProperties(city);
            console.log(`✅ [SUCCESS] Returned ${results.length} records.`);
            if (results.length > 0) {
                console.log(`   Sample: ${results[0].address} | Signal: ${results[0].distressSignal?.description}`);
            }
        } catch (e) {
            console.error(`❌ [FAIL] Uplink Error:`, e);
        }
        console.log("\n");
    }
}

verifySocrata();
