
const https = require('https');

// Overpass API Query for "Buildings near 90210" (approx lat/lon)
// Los Angeles City Hall (Center)
const CENTER_LAT = 34.0522;
const CENTER_LNG = -118.2437;
const RADIUS = 1200;

const QUERY = `
    [out:json][timeout:60];
    (
      way["building"]["addr:housenumber"](around:${RADIUS},${CENTER_LAT},${CENTER_LNG});
    );
    out center tags;
`;

const URL = "https://overpass-api.de/api/interpreter";

function post(url, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body)
            }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error("Invalid JSON"));
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function testUplink() {
    console.log("Testing Nationwide OSM Uplink...");
    try {
        // Using Kumi Systems Mirror
        const options = {
            hostname: 'overpass.kumi.systems',
            path: '/api/interpreter?data=' + encodeURIComponent(QUERY),
            method: 'GET',
            headers: {
                'User-Agent': 'Zenith-AI-Engine/1.0'
            }
        };

        const data = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', chunk => responseData += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(JSON.parse(responseData));
                        } catch (e) {
                            reject(new Error("Invalid JSON from Kumi Systems mirror"));
                        }
                    } else {
                        reject(new Error(`Status ${res.statusCode} from Kumi Systems mirror: ${responseData}`));
                    }
                });
            });
            req.on('error', reject);
            req.end();
        });

        if (data.elements && data.elements.length > 0) {
            console.log(`✅ Success: Acquired ${data.elements.length} REAL building footprints.`);
            const sample = data.elements.find(el => el.tags && el.tags['addr:street']);
            if (sample) {
                console.log(`🏠 Verified Address: ${sample.tags['addr:housenumber']} ${sample.tags['addr:street']}`);
            } else {
                console.log("ℹ️ Buildings found, but address tags may be sparse in this radius.");
            }
        } else {
            console.log("❌ Success connection, but 0 elements found.");
        }
    } catch (e) {
        console.error("❌ Uplink Failed:", e.message);
    }
}

testUplink();
