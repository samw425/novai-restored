import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

        // Save to Supabase if available
        if (supabase) {
            try {
                const { data: subscriber, error: dbError } = await supabase
                    .from('subscribers')
                    .upsert({
                        email,
                        name,
                        organization: organization || null,
                        active: true
                    }, {
                        onConflict: 'email',
                        ignoreDuplicates: false
                    })
                    .select()
                    .single();

                if (dbError && dbError.code !== '23505') {
                    console.error('⚠️ Supabase error:', dbError);
                }
            } catch (dbErr) {
                console.error('⚠️ Database save failed:', dbErr);
            }
        } else {
            console.log('ℹ️ Supabase not configured - data not saved to database');
        }

        // Notification email to you
        const notificationContent = `
New Novai Subscriber

Name: ${name}
Email: ${email}
Organization: ${organization || 'N/A'}
Timestamp: ${new Date().toISOString()}
        `.trim();

        // Welcome email to subscriber
        const welcomeContent = `
Welcome to Novai Intelligence!

Hi ${name},

You're now subscribed to daily AI intelligence briefs. You'll receive:

✓ Curated top stories every morning at 8 AM EST
✓ Breaking AI news and policy updates
✓ Weekly deep-dive analysis

Your first brief arrives tomorrow morning.

— Novai Intelligence Team
        `.trim();

        // 1. Try Resend (Professional/Reliable)
        if (resend) {
            try {
                // Admin Notification
                await resend.emails.send({
                    from: 'Novai Intelligence <onboarding@resend.dev>',
                    to: ['saziz4250@gmail.com'],
                    subject: `[Novai] New Subscriber: ${name}`,
                    html: `
                        <h1>New Subscriber</h1>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
                        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                    `
                });
                console.log('✅ Admin notification sent via Resend');
            } catch (resendError) {
                console.error('⚠️ Resend failed, falling back to FormSubmit:', resendError);
            }
        } else {
            console.log('ℹ️ RESEND_API_KEY not found. Using FormSubmit.co fallback.');
        }

        // 2. Fallback to FormSubmit.co (or Primary if Resend missing)
        try {
            const formSubmitResponse = await fetch('https://formsubmit.co/ajax/saziz4250@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `New Subscriber: ${name}`,
                    name: name,
                    email: email,
                    organization: organization || 'N/A',
                    message: `New subscriber joined Novai.\nName: ${name}\nEmail: ${email}\nOrg: ${organization}`,
                    _template: 'table',
                    _captcha: "false"
                })
            });

            if (!formSubmitResponse.ok) {
                throw new Error(`FormSubmit.co failed: ${formSubmitResponse.status}`);
            }
            console.log('✅ Email sent via FormSubmit.co');
        } catch (emailError) {
            console.error('⚠️ All email delivery methods failed:', emailError);
        }

        // Always log to console as backup
        console.log('--- NEW NOVAI SUBSCRIBER ---');
        console.log(notificationContent);
        console.log('>>> SAVED TO:', supabase ? 'DATABASE + EMAIL' : 'EMAIL ONLY');
        console.log('--------------------------------');

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Signup API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
