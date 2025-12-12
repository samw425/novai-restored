import { NextResponse } from 'next/server';
export const runtime = 'edge';


export const dynamic = 'force-dynamic';

export async function GET() {
    const hasResendKey = !!process.env.RESEND_API_KEY;
    const keyLength = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0;
    const keyPrefix = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 3) : 'N/A';

    console.log('--- ENV DEBUG ---');
    console.log('Has Resend Key:', hasResendKey);
    console.log('Key Length:', keyLength);
    console.log('Key Prefix:', keyPrefix);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('-----------------');

    return NextResponse.json({
        status: 'ok',
        hasResendKey,
        keyLength,
        keyPrefix,
        nodeEnv: process.env.NODE_ENV
    });
}
