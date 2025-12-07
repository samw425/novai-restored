import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { addSubscriber, sendEmail } from '@/lib/email/utils';
import WelcomeDailyBriefEmail from '@emails/WelcomeDailyBriefEmail';

// Optional Supabase - only create if env vars are present
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, organization } = body;

        // Validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        console.log(`[Signup] New subscriber: ${name} (${email})`);

        // Save to Supabase if available
        if (supabase) {
            try {
                await supabase
                    .from('subscribers')
                    .upsert({
                        email,
                        name,
                        organization: organization || null,
                        active: true
                    }, {
                        onConflict: 'email',
                        ignoreDuplicates: false
                    });
                console.log('[Signup] Saved to Supabase');
            } catch (dbErr) {
                console.warn('[Signup] Database save failed:', dbErr);
            }
        }

        // Add to Resend Contacts
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const added = await addSubscriber(email, firstName, lastName);
        if (!added) {
            console.warn(`[Signup] Could not add ${email} to Resend audience`);
        }

        // Send Welcome Email to subscriber
        const { error: welcomeError } = await sendEmail(
            email,
            'Welcome to Novai — Your Daily Intelligence Brief',
            WelcomeDailyBriefEmail() as React.ReactElement
        );

        if (welcomeError) {
            console.error('[Signup] Welcome email failed:', welcomeError);
        } else {
            console.log(`[Signup] Welcome email sent to ${email}`);
        }

        // Send notification to admin
        const { error: notifError } = await sendEmail(
            'saziz4250@gmail.com',
            `[Novai] New Subscriber: ${name}`,
            `
                <h1>New Subscriber</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            ` as any
        );

        if (notifError) {
            console.warn('[Signup] Admin notification failed:', notifError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[Signup] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
