
const https = require('https');
const fs = require('fs');
const path = require('path');

// Basic env parser
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const RENTCAST_KEY = envContent.match(/NEXT_PUBLIC_RENTCAST_KEY=(.*)/)?.[1]?.trim();

function get(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Zenith-Test-Script',
                ...headers
            }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function testGeocoding(query) {
    console.log(`\n--- Testing Geocoding: "${query}" ---`);
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=us`;
        const data = await get(url);
        if (data && data[0]) {
            console.log(`✅ Success: ${data[0].display_name}`);
            console.log(`📍 Coords: ${data[0].lat}, ${data[0].lon}`);
        } else {
            console.log(`❌ No results found.`);
        }
    } catch (e) {
        console.error(`❌ Error: ${e.message}`);
    }
}

async function testRentCastConnectivity() {
    console.log(`\n--- Testing RentCast Connectivity ---`);
    if (!RENTCAST_KEY) {
        console.log(`❌ Error: RENTCAST_KEY missing in .env.local`);
        return;
    }
    try {
        const url = `https://api.rentcast.io/v1/properties?city=Austin&state=TX&limit=1`;
        const data = await get(url, { 'X-Api-Key': RENTCAST_KEY, 'accept': 'application/json' });
        console.log(`✅ Success: Acquired ${data.length} records.`);
        if (data[0]) {
            console.log(`🏠 Example: ${data[0].formattedAddress}`);
        }
    } catch (e) {
        console.error(`❌ Error: ${e.message}`);
    }
}

async function runTests() {
    await testGeocoding("90210");
    await testGeocoding("Austin, TX");
    await testGeocoding("Miami, FL");
    await testRentCastConnectivity();
}

runTests();
