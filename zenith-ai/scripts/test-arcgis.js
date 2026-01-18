
const https = require('https');

// Travis County Tax Parcels Endpoint
const URL = "https://services.arcgis.com/8db99369e59d48b1975e52643a139a03/arcgis/rest/services/Tax_Parcels/FeatureServer/0/query?where=1%3D1&outFields=Situs_Address,Owner_Name,Market_Value&resultRecordCount=5&f=json";

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function testArcGIS() {
    try {
        console.log("Testing Travis County Uplink...");
        const data = await get(URL);
        console.log(`Status: ${data.error ? 'ERROR' : 'OK'}`);
        if (data.features) {
            console.log(`Retrieved ${data.features.length} REAL records.`);
            console.log("Sample:", JSON.stringify(data.features[0].attributes, null, 2));
        } else {
            console.log("No features returned.", data);
        }
    } catch (e) {
        console.error("Connection Failed:", e.message);
    }
}

testArcGIS();
