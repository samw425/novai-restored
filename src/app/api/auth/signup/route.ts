import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (RESEND_API_KEY) {
            try {
                // Send notification to you
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Novai <onboarding@resend.dev>',
                        to: 'saziz4250@gmail.com',
                        subject: `New Subscriber: ${name}`,
                        text: notificationContent
                    })
                });

                // Send welcome email to subscriber
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Novai Intelligence <onboarding@resend.dev>',
                        to: email,
                        subject: 'Welcome to Novai Intelligence',
                        text: welcomeContent
                    })
                });

                console.log('✅ Emails sent successfully');
            } catch (emailError) {
                console.error('⚠️ Email delivery failed:', emailError);
            }
        } else {
            console.log('⚠️ RESEND_API_KEY not configured - emails not sent');
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
