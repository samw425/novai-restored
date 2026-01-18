
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!global.fetch) {
    global.fetch = require('node-fetch');
}

import ARCGIS_REGISTRY from '../src/lib/data/arcgis_registry.json';

async function probeFields() {
    console.log("🦅 [SCOUT] INITIATING DEEP FIELD RECONNAISSANCE...\n");

    const targets = ["la_county_ca", "miami_dade_fl"];

    for (const key of targets) {
        const source = (ARCGIS_REGISTRY as any)[key];
        if (!source) continue;

        console.log(`\n--- PROBING: ${source.name} ---`);
        const url = `${source.rest_url}/query?where=1%3D1&outFields=*&f=json&resultRecordCount=1`; // Get EVERYTHING

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.features && data.features.length > 0) {
                const attr = data.features[0].attributes;
                const keys = Object.keys(attr);

                console.log(`✅ [FOUND ${keys.length} FIELDS]`);

                // Filter for "Mail" or "Addr" or "Owner" fields
                const interesting = keys.filter(k =>
                    k.toLowerCase().includes("mail") ||
                    k.toLowerCase().includes("addr") ||
                    k.toLowerCase().includes("owner") ||
                    k.toLowerCase().includes("city") ||
                    k.toLowerCase().includes("zip")
                );

                console.log("   🎯 POTENTIAL MAILING INTEL:", interesting.join(", "));
                console.log("   📝 SAMPLE RECORD:");
                interesting.forEach(k => {
                    console.log(`      - ${k}: ${attr[k]}`);
                });

            } else {
                console.log("❌ NO DATA RETURNED.");
            }

        } catch (e) {
            console.error("❌ PROBE FAILED:", e);
        }
    }
}

probeFields();
