import { NextResponse } from 'next/server';
import { addSubscriber, sendEmail } from '@/lib/email/utils';
import WelcomeDailyBriefEmail from '@emails/WelcomeDailyBriefEmail';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        console.log(`[Subscribe] Attempting to subscribe: ${email}`);

        // 1. Add to Resend Audience
        const added = await addSubscriber(email);
        if (!added) {
            console.warn(`[Subscribe] Could not add ${email} to audience, but proceeding with welcome email.`);
        }

        // 2. Send Welcome Email
        const { error } = await sendEmail(
            email,
            'Welcome to Novai — Your Daily Intelligence Brief',
            WelcomeDailyBriefEmail() as React.ReactElement
        );

        if (error) {
            console.error('[Subscribe] Email send error:', error);
            return NextResponse.json({ error: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Subscribed successfully' });

    } catch (error: any) {
        console.error('[Subscribe] Critical Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
