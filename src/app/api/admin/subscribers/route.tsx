import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';
import WelcomeDailyBriefEmail from '../../../../../emails/WelcomeDailyBriefEmail';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
    try {
        // Authenticate via Bearer token (using CRON_SECRET or ADMIN_SECRET)
        const authHeader = request.headers.get('authorization');
        // Allow using CRON_SECRET for simplicity as admin key for now
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, sendWelcome = true } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 });
        }

        // 1. Insert into Supabase
        if (supabase) {
            const { error } = await supabase
                .from('subscribers')
                .upsert({ email, active: true }, { onConflict: 'email' });

            if (error) {
                console.error('Supabase error:', error);
                return NextResponse.json({ success: false, message: error.message }, { status: 500 });
            }
        } else {
            return NextResponse.json({ success: false, message: 'Database not connected' }, { status: 500 });
        }

        // 2. Optional Welcome Email
        if (sendWelcome && resend) {
            try {
                await resend.emails.send({
                    from: 'Novai Daily Intelligence <intel@usenovai.live>',
                    to: email,
                    subject: 'Welcome to Novai — Your Daily Intelligence Brief',
                    react: WelcomeDailyBriefEmail(),
                    replyTo: 'contact@novai.ai'
                });
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
            }
        }

        return NextResponse.json({ success: true, message: 'Subscriber added successfully' });
    } catch (error) {
        console.error('Admin subscribe error:', error);
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
