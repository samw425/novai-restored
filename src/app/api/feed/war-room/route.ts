import { NextResponse } from 'next/server';
import { getWarRoomData } from '@/lib/osint';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const incidents = await getWarRoomData();

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedIncidents = incidents.slice(startIndex, endIndex);

        return NextResponse.json({
            incidents: paginatedIncidents,
            total: incidents.length,
            page,
            totalPages: Math.ceil(incidents.length / limit)
        });
    } catch (error) {
        console.error('War Room API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch War Room data' },
            { status: 500 }
        );
    }
}
