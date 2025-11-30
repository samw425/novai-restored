import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, organization, interest } = body;

        // Log the signup request (server-side log visible in Vercel dashboard)
        console.log('--- NEW SIGNUP REQUEST ---');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Org: ${organization}`);
        console.log(`Interest: ${interest}`);
        console.log('--------------------------');

        // TODO: Integrate with Resend or Nodemailer to send actual email
        // For now, we log it so it's captured in Vercel logs.
        // To enable real emails, we need to add RESEND_API_KEY to env vars.

        return NextResponse.json({ success: true, message: 'Signup received' });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process signup' },
            { status: 500 }
        );
    }
}
