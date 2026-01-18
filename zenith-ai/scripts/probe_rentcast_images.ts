
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const RENTCAST_API_KEY = process.env.NEXT_PUBLIC_RENTCAST_KEY || "";

async function probe() {
    console.log("ZENITH PROBE: RentCast Data Check...");
    const url = `https://api.rentcast.io/v1/properties?address=770%20Claughton%20Island%20Drive,%20Miami,%20FL&limit=1`;

    try {
        const response = await fetch(url, {
            headers: { 'X-Api-Key': RENTCAST_API_KEY, 'accept': 'application/json' }
        });
        const data = await response.json();
        console.log("RAW DATA:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("PROBE FAILED:", e);
    }
}

probe();
