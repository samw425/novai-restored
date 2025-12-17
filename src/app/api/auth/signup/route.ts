import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const runtime = 'edge';

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

        // PRIMARY: Try Resend first (API key already in Vercel)
        let notificationSent = false;
        if (process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);

                const { error } = await resend.emails.send({
                    from: 'Novai Intelligence <onboarding@resend.dev>',
                    to: ['saziz4250@gmail.com'],
                    subject: `[Novai] New Subscriber: ${name}`,
                    html: `
                        <h1>New Subscriber</h1>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Organization:</strong> ${organization || 'Individual'}</p>
                        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                    `
                });

                if (!error) {
                    notificationSent = true;
                    console.log('[Signup] ✅ Admin notification sent via Resend');
                } else {
                    console.warn('[Signup] Resend error:', error.message);
                }
            } catch (resendErr) {
                console.warn('[Signup] Resend failed:', resendErr);
            }
        }

        // BACKUP: Try FormSubmit.co if Resend failed
        if (!notificationSent) {
            try {
                const formSubmitResponse = await fetch('https://formsubmit.co/ajax/saziz4250@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `[Novai] New Subscriber: ${name}`,
                        name: name,
                        email: email,
                        organization: organization || 'Individual',
                        source: 'Signup Page',
                        timestamp: new Date().toISOString(),
                        _template: 'table',
                        _captcha: 'false',
                        _replyto: email
                    })
                });

                if (formSubmitResponse.ok) {
                    notificationSent = true;
                    console.log('[Signup] ✅ Admin notification sent via FormSubmit.co');
                } else {
                    console.warn('[Signup] FormSubmit.co returned non-OK:', formSubmitResponse.status);
                }
            } catch (formErr) {
                console.error('[Signup] FormSubmit.co failed:', formErr);
            }
        }

        if (!notificationSent) {
            console.error('[Signup] ⚠️ All notification methods failed for:', email);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[Signup] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

