import { NextResponse } from 'next/server';
import { fetchRoboticsFeed } from '@/lib/robotics';

// Cache for 5 minutes to reduce function calls
export const revalidate = 300;

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
