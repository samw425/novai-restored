
import fetch from "node-fetch";

async function debugLojic() {
    console.log("🐛 [DEBUG] FETCHING RAW LOJIC DATA (LAYER 3)...");
    const url = "https://services.lojic.org/arcgis/rest/services/Lojic/LojicOnDemand/MapServer/3/query?where=OBJECTID<20&outFields=*&f=json";

    try {
        const res = await fetch(url);
        const data: any = await res.json();

        if (data.features && data.features.length > 0) {
            console.log("✅ RAW RECORD SAMPLE:");
            console.log(JSON.stringify(data.features[0].attributes, null, 2));

            // Analyze fields
            const fields = Object.keys(data.features[0].attributes);
            console.log("\n📋 AVAILABLE FIELDS:", fields.join(", "));
        } else {
            console.log("❌ NO FEATURES RETURNED.");
        }
    } catch (e) {
        console.log("❌ CONNECTION FAILED:", e);
    }
}

debugLojic();
