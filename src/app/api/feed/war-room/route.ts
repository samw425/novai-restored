import { NextResponse } from 'next/server';
import { getWarRoomData } from '@/lib/osint';

// IMPORTANT: Edge Runtime for Cloudflare compatibility
export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const incidents = await getWarRoomData();
        return NextResponse.json({ incidents });
    } catch (error) {
        console.error('War Room API Error:', error);
        return NextResponse.json({ incidents: [] }, { status: 500 });
    }
}
