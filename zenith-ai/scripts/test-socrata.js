
const https = require('https');

// Austin Code Violations Endpoint
const URL = "https://data.austintexas.gov/resource/3syk-w9eu.json?$limit=5&$order=:id desc";

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function testSocrata() {
    try {
        console.log("Testing Austin Socrata Uplink...");
        const data = await get(URL);
        if (Array.isArray(data)) {
            console.log(`✅ Success: Retrieved ${data.length} REAL records.`);
            if (data.length > 0) {
                console.log("Sample Address:", data[0].address_line_1 || data[0].original_address1);
            }
        } else {
            console.log("❌ Error: Invalid response format", data);
        }
    } catch (e) {
        console.error("❌ Connection Failed:", e.message);
    }
}

testSocrata();
