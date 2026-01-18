
const https = require('https');

const MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
];

const QUERY = `
    [out:json][timeout:10];
    (
      way["building"]["addr:housenumber"](around:300,34.0736,-118.4004);
    );
    out center tags;
`;

function post(url, body) {
    return new Promise((resolve, reject) => {
        // Handle different protocols/hosts if needed, but here simple URL parsing
        const lib = url.startsWith('https') ? https : require('http');

        const req = lib.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body),
                'User-Agent': 'Zenith-Test/1.0'
            }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error("Invalid JSON: " + data.substring(0, 100)));
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}`));
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(8000, () => {
            req.destroy();
            reject(new Error("Timeout"));
        });
        req.write(body);
        req.end();
    });
}

async function testFailover() {
    console.log("Testing OSM Mirrors...");
    const body = `data=${encodeURIComponent(QUERY)}`;

    for (const url of MIRRORS) {
        process.stdout.write(`Trying ${url}... `);
        try {
            const start = Date.now();
            const data = await post(url, body);
            const time = Date.now() - start;

            if (data.elements) {
                console.log(`✅ OK (${time}ms). Found ${data.elements.length} items.`);
                // Stop after first success to emulate app behavior (or test all? let's test all for now to see health)
                // Actually, let's break on success to verify "failover" behavior finds A working one.
                console.log("-> Failover logic SUCCESS. Stopping.");
                return;
            } else {
                console.log(`❌ Bad Format.`);
            }
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }
    }
    console.log("❌ ALL MIRRORS FAILED.");
}

testFailover();
