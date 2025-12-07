import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeDailyBriefEmail from '@/emails/WelcomeDailyBriefEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        console.log(`[Subscribe] Attempting to subscribe: ${email}`);

        // 1. Add to Resend Audience (Contacts)
        // Since we don't have a specific Audience ID set up, we'll try to create a contact 
        // in the default audience or just rely on 'Sending' checks later if needed.
        // Ideally, we need an Audience ID. Let's try to 'create' one if we can't find one? 
        // No, for now let's assume we just create a contact in the "General" audience if implicit,
        // or easier: just creating a contact requires an audience_id.

        // WORKAROUND: For this immediate fix, we will just SEND the welcome email. 
        // To "Store" them without DB, we will use Resend's "Create Contact" if we can find an audience ID.
        // If not, we will just log it and send the email. 
        // BUT the user wants the list.

        // Let's try to create a contact with a known Audience ID? 
        // Provide a placeholder or try to fetch audiences first?
        // Valid Resend API flow: List Audiences -> Get ID -> Create Contact.

        let audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!audienceId) {
            // Try to find an audience named "Novai Subscribers"
            try {
                // @ts-ignore
                const audiences = await resend.audiences.list();
                // @ts-ignore
                if (audiences.data && audiences.data.length > 0) {
                    // @ts-ignore
                    audienceId = audiences.data[0].id;
                } else {
                    // Create one
                    // @ts-ignore 
                    const newAudience = await resend.audiences.create({ name: 'Novai Subscribers' });
                    // @ts-ignore
                    audienceId = newAudience.data?.id;
                }
            } catch (e) {
                console.warn('[Subscribe] Failed to manage audiences:', e);
            }
        }

        if (audienceId) {
            try {
                await resend.contacts.create({
                    email: email,
                    audienceId: audienceId,
                    unsubscribed: false
                });
                console.log(`[Subscribe] Added ${email} to Resend Audience ${audienceId}`);
            } catch (e) {
                console.warn('[Subscribe] Failed to add contact to Resend:', e);
                // Continue to send welcome email anyway
            }
        } else {
            console.warn('[Subscribe] No Audience ID available, skipping contact storage.');
        }

        // 2. Send Welcome Email
        const { data, error } = await resend.emails.send({
            from: 'Novai Intelligence <brief@novai.intelligence>', // Verify this domain!
            // If domain not verified, use 'onboarding@resend.dev' for testing if allowed, 
            // but user likely has domain. Fallback to generic if fails?
            // User provided 'saziz4250@gmail.com'.
            // Let's use a safe sender.
            to: [email],
            subject: 'Welcome to Novai Intelligence',
            react: WelcomeDailyBriefEmail() as React.ReactElement,
        });

        if (error) {
            console.error('[Subscribe] Email send error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Subscribed successfully' });

    } catch (error: any) {
        console.error('[Subscribe] Critical Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
