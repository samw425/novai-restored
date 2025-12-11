import { NextResponse } from 'next/server';
import { getLatestBrief, getAllBriefs } from '@/lib/data/daily-briefs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'latest' or 'archive'

    if (mode === 'archive') {
        const briefs = getAllBriefs();
        return NextResponse.json({ briefs });
    }

    // Try to read today's generated brief from file system first
    try {
        const fs = await import('fs');
        const path = await import('path');
        const today = new Date().toISOString().split('T')[0];
        const filePath = path.join(process.cwd(), 'src/lib/data/daily-briefs', `${today}.json`);

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const dailyBrief = JSON.parse(fileContent);
            return NextResponse.json({ brief: dailyBrief });
        }
    } catch (e) {
        console.warn('Failed to read local brief file', e);
    }

    // Default to latest from static data if file missing
    const latest = getLatestBrief();
    return NextResponse.json({ brief: latest });
}
