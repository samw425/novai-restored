
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!global.fetch) {
    global.fetch = require('node-fetch');
}

async function probeRegridRoot() {
    console.log("🦅 [SCOUT] PROBING REGRID MAPSERVER ROOT...\n");

    // The URL from the search result (MapServer, not FeatureServer)
    const baseUrl = "https://services.arcgis.com/P3eSmsQSzV1LhD7L/arcgis/rest/services/Regrid_Nationwide_Parcel_Boundaries_v1/MapServer";

    try {
        // 1. Check Metadata (Layers, Capabilities)
        console.log(`[GET] ${baseUrl}?f=json`);
        const metaRes = await fetch(`${baseUrl}?f=json`);
        const meta = await metaRes.json();

        if (meta.error) {
            console.error("❌ SERVICE ERROR:", meta.error);
            return;
        }

        console.log(`✅ SERVICE FOUND: ${meta.documentInfo?.Title || 'Unknown Title'}`);
        console.log(`   Detailed Layers: ${meta.layers?.length || 0}`);
        console.log(`   Capabilities: ${meta.capabilities}`);

        // 2. Identify the Parcel Layer (usually ID 0)
        const parcelLayer = meta.layers?.find((l: any) => l.name.toLowerCase().includes("parcel") || l.id === 0);

        if (parcelLayer) {
            console.log(`   🎯 TARGET LAYER: [${parcelLayer.id}] ${parcelLayer.name}`);

            // 3. Test Query on the specific layer
            const queryUrl = `${baseUrl}/${parcelLayer.id}/query?where=1%3D1&outFields=*&resultRecordCount=1&f=json`;
            console.log(`   [TEST QUERY] ${queryUrl}`);

            const qRes = await fetch(queryUrl);
            const qData = await qRes.json();

            if (qData.features && qData.features.length > 0) {
                console.log(`   ✅ QUERY SUCCESS: Returned ${qData.features.length} records.`);
                console.log(`   🔑 FIELDS: ${Object.keys(qData.features[0].attributes).join(", ")}`);
            } else {
                console.warn("   ⚠️ QUERY RETURNED 0 RECORDS (May need geometry filter or token).");
                console.log("   MSG:", JSON.stringify(qData));
            }

        } else {
            console.error("❌ NO PARCEL LAYER FOUND.");
        }

    } catch (e) {
        console.error("❌ CONNECTION FAILED:", e);
    }
}

probeRegridRoot();
