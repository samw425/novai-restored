const ARCGIS_REGISTRY = {
    "travis_county_tx": {
        "rest_url": "https://services.arcgis.com/8db99369e59d48b1975e52643a139a03/arcgis/rest/services/EXTERNAL_tcad_parcel/FeatureServer/0",
        "name": "Travis County Tax Parcels"
    },
    "la_county_ca": {
        "rest_url": "https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/0",
        "name": "LA County Parcels"
    },
    "miami_dade_fl": {
        "rest_url": "https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/Parcelpoly_gdb/FeatureServer/0",
        "name": "Miami-Dade Parcels"
    }
};

async function verifyEndpoints() {
    console.log("--- ZENITH ARCGIS CONNECTIVITY AUDIT ---");
    for (const [key, source] of Object.entries(ARCGIS_REGISTRY)) {
        try {
            const res = await fetch(`${source.rest_url}?f=json`);
            const json = await res.json();
            if (res.ok && json.name) {
                console.log(`[OK] ${source.name}: ${json.name} (Service Up)`);
            } else {
                console.log(`[FAIL] ${source.name}: Service Response Invalid`);
            }
        } catch (e) {
            console.log(`[ERROR] ${source.name}: ${e.message}`);
        }
    }
}

verifyEndpoints();
