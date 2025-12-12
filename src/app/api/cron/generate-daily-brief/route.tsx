import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
    return NextResponse.json({
        message: 'This route is deprecated. Use /api/cron/daily-brief instead.',
        status: 'retired'
    });
}
