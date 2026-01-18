
import fetch from "node-fetch";

async function debugChicago() {
    console.log("🕵️‍♂️ [DEBUG] FETCHING RAW CHICAGO DATA...");

    // Cook County Parcel Endpoint (from Directory)
    const url = "https://gis.cookcountyil.gov/traditional/rest/services/connectToCook/MapServer/0/query?where=1%3D1&outFields=*&f=json&resultRecordCount=3";

    try {
        const res = await fetch(url);
        const json: any = await res.json();

        if (json.features && json.features.length > 0) {
            console.log("✅ RAW ATTRIBUTES (First Record):");
            console.log(JSON.stringify(json.features[0].attributes, null, 2));
        } else {
            console.log("❌ NO RECORDS RETURNED");
        }
    } catch (e) {
        console.error("🛑 FETCH FAILED:", e);
    }
}

debugChicago();
