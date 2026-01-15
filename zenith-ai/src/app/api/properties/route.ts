import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const RENTCAST_API_KEY = process.env.NEXT_PUBLIC_RENTCAST_KEY || "";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');

    if (!location) {
        return NextResponse.json({ error: 'Location required' }, { status: 400 });
    }

    // Secure Key Access
    const apiKey = process.env.NEXT_PUBLIC_RENTCAST_KEY;
    if (!apiKey) {
        console.error("CRITICAL: RentCast API Key missing in Edge Runtime.");
        return NextResponse.json({ error: 'Configuration Error: API Key Missing' }, { status: 500 });
    }

    try {
        const queryParams = new URLSearchParams();
        queryParams.set('limit', '500'); // MAX DENSITY: Fetch 500 properties per search

        // Robust Location Logic
        const cleanLoc = location.trim();
        if (/^\d{5}$/.test(cleanLoc)) {
            queryParams.set('zipCode', cleanLoc);
        } else if (cleanLoc.includes(",")) {
            const [city, state] = cleanLoc.split(",");
            queryParams.set('city', city.trim());
            queryParams.set('state', state.trim());
        } else {
            queryParams.set('city', cleanLoc);
        }

        const endpoint = `https://api.rentcast.io/v1/properties?${queryParams.toString()}`;
        console.log(`[Proxy] Fetching: ${endpoint} (Key Masked: ${apiKey.substring(0, 4)}...)`);

        const response = await fetch(endpoint, {
            headers: {
                'X-Api-Key': apiKey,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `Provider Error: ${response.status}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
