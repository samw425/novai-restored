import { NextResponse } from 'next/server';
import { getWarRoomData } from '@/lib/osint';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const incidents = await getWarRoomData();

        return NextResponse.json({
            incidents,
            count: incidents.length,
            lastUpdate: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('War Room API Error:', error);
        return NextResponse.json({
            incidents: [],
            error: error.message
        }, { status: 500 });
    }
}
