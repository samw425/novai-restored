
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!global.fetch) {
    global.fetch = require('node-fetch');
}

async function verifyRegrid() {
    console.log("🦅 [SCOUT] TESTING NATIONWIDE PARCEL LAYER uPLINK...\n");

    const url = "https://services.arcgis.com/P3eSmsQSzV1LhD7L/arcgis/rest/services/Regrid_Nationwide_Parcel_Boundaries_v1/FeatureServer/0/query?where=1%3D1&outFields=*&f=json&resultRecordCount=5";

    try {
        console.log(`[FETCH] ${url}`);
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Status: ${res.status}`);
        }

        const data = await res.json();

        if (data.features && data.features.length > 0) {
            console.log(`✅ [SUCCESS] NATIONWIDE UPLINK ACTIVE. (${data.features.length} records)`);
            const keys = Object.keys(data.features[0].attributes);
            console.log("   🔑 AVAILABLE FIELDS:", keys.join(", "));
            console.log("   📝 SAMPLE:", JSON.stringify(data.features[0].attributes, null, 2));
        } else {
            console.warn("⚠️ [WARN] Connected, but 0 features returned (Layer might be restricted or empty query).");
            console.log("   RAW:", JSON.stringify(data).substring(0, 500));
        }

    } catch (e) {
        console.error("❌ [FAIL] CONNECTION INVALID:", e);
    }
}

verifyRegrid();
