import { NextResponse } from 'next/server';
import { getWarRoomData } from '@/lib/osint';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const allIncidents = await getWarRoomData();

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedIncidents = allIncidents.slice(startIndex, endIndex);

        return NextResponse.json({
            incidents: paginatedIncidents,
            total: allIncidents.length,
            page,
            hasMore: endIndex < allIncidents.length,
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
