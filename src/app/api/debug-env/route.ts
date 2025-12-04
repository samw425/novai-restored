import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        hasResendKey: !!process.env.RESEND_API_KEY,
        keyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) : 'NONE',
        env: process.env.NODE_ENV
    });
}
