import { NextResponse } from 'next/server';
import { getLatestBrief, getAllBriefs } from '@/lib/data/daily-briefs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'latest' or 'archive'

    if (mode === 'archive') {
        const briefs = getAllBriefs();
        return NextResponse.json({ briefs });
    }

    // Default to latest
    const latest = getLatestBrief();
    return NextResponse.json({ brief: latest });
}
