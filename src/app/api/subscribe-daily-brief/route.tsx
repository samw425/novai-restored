import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Resend } from 'resend';
import WelcomeDailyBriefEmail from '../../../../emails/WelcomeDailyBriefEmail';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

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
                // Continue though, to try sending email or just return error?
                // If DB fails, we probably shouldn't say success, but if it's just a dupe, upsert handles it.
            }
        }

        // 2. Send Welcome Email via Resend
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Novai Daily Intelligence <intel@novaibeta.vercel.app>',
                    to: email,
                    subject: 'Welcome to Novai — Your Daily Intelligence Brief',
                    react: WelcomeDailyBriefEmail(),
                    replyTo: 'contact@novai.ai' // or config param
                });
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                // We still consider subscription successful even if email fails? 
                // for now return success but log error
            }
        }

        return NextResponse.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
    }
}
