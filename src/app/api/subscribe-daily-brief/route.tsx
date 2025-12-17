import { NextResponse } from 'next/server';
import { addSubscriber, sendSubscriberEmail, sendAdminEmail } from '@/lib/email/utils';
import WelcomeDailyBriefEmail from '@emails/WelcomeDailyBriefEmail';
export const runtime = 'edge';


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

        // 2. Send Welcome Email via Mailersend
        const { error } = await sendSubscriberEmail(
            email,
            'Welcome to Novai — Your Daily Intelligence Brief',
            WelcomeDailyBriefEmail() as React.ReactElement
        );

        if (error) {
            console.error('[Subscribe] Email send error:', error);
            return NextResponse.json({ error: error }, { status: 500 });
        }

        // 3. Notify Admin (Async, don't block response)
        sendAdminEmail(
            'saziz4250@gmail.com',
            `New Daily Brief Subscriber: ${email}`,
            `<p>New subscriber joined: <strong>${email}</strong></p><p>Added to audience: ${added ? 'Yes' : 'No'}</p>`
        ).catch((e: any) => console.error('[Subscribe] Admin notification failed:', e));


        return NextResponse.json({ success: true, message: 'Subscribed successfully' });

    } catch (error: any) {
        console.error('[Subscribe] Critical Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
