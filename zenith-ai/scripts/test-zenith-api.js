
const axios = require('axios');
require('dotenv').config({ path: '/Users/sameeraziz/Documents/novai-intelligence (2)/zenith-ai/.env.local' });

const RENTCAST_KEY = process.env.NEXT_PUBLIC_RENTCAST_KEY;

async function testGeocoding(query) {
    console.log(`\n--- Testing Geocoding: "${query}" ---`);
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=us`;
        const res = await axios.get(url, { headers: { 'User-Agent': 'Zenith-Test-Script' } });
        if (res.data && res.data[0]) {
            console.log(`✅ Success: ${res.data[0].display_name}`);
            console.log(`📍 Coords: ${res.data[0].lat}, ${res.data[0].lon}`);
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
        const res = await axios.get(url, { headers: { 'X-Api-Key': RENTCAST_KEY, 'accept': 'application/json' } });
        console.log(`✅ Success: Acquired ${res.data.length} records.`);
        if (res.data[0]) {
            console.log(`🏠 Example: ${res.data[0].formattedAddress}`);
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
