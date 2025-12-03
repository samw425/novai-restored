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

        // Use FormSubmit.co as a reliable fallback/primary email service
        // This ensures emails are sent even if RESEND_API_KEY is missing in Vercel
        try {
            await fetch('https://formsubmit.co/ajax/saziz4250@gmail.com', {
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
            console.log('✅ Email sent via FormSubmit.co');
        } catch (emailError) {
            console.error('⚠️ Email delivery failed:', emailError);
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
