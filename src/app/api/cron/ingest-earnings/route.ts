
import { NextResponse } from 'next/server';
import { SECEarningsWatcher } from '@/lib/ingestion/sec_watcher';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Extend timeout for processing

export async function GET(request: Request) {
    try {
        // simple security check (or allow public for now if just testing)
        // const auth = request.headers.get('authorization');
        // if (auth !== `Bearer ${process.env.CRON_SECRET}`) ...

        const watcher = new SECEarningsWatcher();
        await watcher.checkFeed();

        return NextResponse.json({ success: true, message: "SEC Feed processed" });
    } catch (error: any) {
        console.error("SEC Ingestion Failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
