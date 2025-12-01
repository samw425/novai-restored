import { NextResponse } from 'next/server';
import { fetchRoboticsFeed } from '@/lib/robotics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const items = await fetchRoboticsFeed();
        return NextResponse.json({
            items,
            meta: {
                total: items.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Robotics Feed Error:', error);
        return NextResponse.json({ items: [], error: 'Failed to fetch robotics data' }, { status: 500 });
    }
}
