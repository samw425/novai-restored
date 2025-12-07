import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import DailyBriefEmail from '../../../../../emails/DailyBriefEmail';
import { render } from '@react-email/render';

// Supabase client
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET(request: Request) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        console.log(`[SendBrief] Starting email send for ${today}`);

        // 1. Load today's pre-generated brief
        const fs = await import('fs');
        const path = await import('path');
        const briefPath = path.join(process.cwd(), 'src/lib/data/daily-briefs', `${today}.json`);

        let dailyBrief: any;
        try {
            if (fs.existsSync(briefPath)) {
                const content = fs.readFileSync(briefPath, 'utf-8');
                dailyBrief = JSON.parse(content);
                console.log(`[SendBrief] ✅ Loaded brief from ${briefPath}`);
            } else {
                console.warn(`[SendBrief] ⚠️ No brief found for ${today}. Using fallback.`);
                dailyBrief = createFallbackBrief(today);
            }
        } catch (e) {
            console.error(`[SendBrief] Error loading brief:`, e);
            dailyBrief = createFallbackBrief(today);
        }

        // 2. Get all active subscribers
        let subscribers: any[] = [];
        if (supabase) {
            const { data: subs, error } = await supabase
                .from('subscribers')
                .select('email')
                .eq('active', true);

            if (subs) subscribers = subs;
            if (error) console.error('[SendBrief] Supabase error:', error);
        }

        // Fallback: send to admin if no subscribers
        if (subscribers.length === 0) {
            console.log('[SendBrief] No subscribers. Sending to admin.');
            subscribers = [{ email: 'saziz4250@gmail.com' }];
        }

        if (!resend) {
            return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 });
        }

        // 3. Map brief to email template props
        const analystNotes = (dailyBrief.keySignals || []).slice(0, 5).map((signal: any) => ({
            title: signal.title,
            summary: signal.summary,
            link: signal.link?.startsWith('http') ? signal.link : `${process.env.NEXT_PUBLIC_URL}${signal.link || '/global-feed'}`
        }));

        // Include war room and market if available
        const warRoomAlert = dailyBrief.warRoomNote ? {
            title: 'Geopolitical Update',
            summary: dailyBrief.warRoomNote,
            link: `${process.env.NEXT_PUBLIC_URL}/war-room`
        } : undefined;

        const marketImpact = dailyBrief.marketImpact ? {
            title: 'Market Signal',
            summary: dailyBrief.marketImpact,
            link: `${process.env.NEXT_PUBLIC_URL}/market-pulse`
        } : undefined;

        // 4. Render email HTML
        const emailHtml = await render(
            <DailyBriefEmail
                date={dailyBrief.date || today}
                analystNotes={analystNotes}
                warRoomAlert={warRoomAlert}
                marketImpact={marketImpact}
                extraLinks={[
                    { label: 'Global Feed — Live Signals', url: `${process.env.NEXT_PUBLIC_URL}/global-feed` },
                    { label: 'War Room — Live Map', url: `${process.env.NEXT_PUBLIC_URL}/war-room` }
                ]}
            />
        );

        // 5. Send to all subscribers
        let sentCount = 0;
        let failCount = 0;

        for (const subscriber of subscribers) {
            try {
                await resend.emails.send({
                    from: 'Novai Daily Intelligence <intel@novaibeta.vercel.app>',
                    to: subscriber.email,
                    subject: dailyBrief.headline || `Novai Daily Intelligence Brief — ${today}`,
                    html: emailHtml,
                    replyTo: 'contact@novai.ai'
                });
                sentCount++;
            } catch (err) {
                console.error(`[SendBrief] Failed to send to ${subscriber.email}:`, err);
                failCount++;
            }
        }

        console.log(`[SendBrief] ✅ Sent to ${sentCount} subscribers (${failCount} failed)`);

        return NextResponse.json({
            success: true,
            date: today,
            sent: sentCount,
            failed: failCount,
            isFallback: dailyBrief.isFallback || false
        });

    } catch (error) {
        console.error('[SendBrief] Critical error:', error);
        return NextResponse.json({ error: 'Failed to send daily brief' }, { status: 500 });
    }
}

/**
 * Fallback brief when no generated file exists.
 */
function createFallbackBrief(date: string) {
    return {
        date,
        headline: "AI-INTEL BRIEF: SYSTEM UPDATE",
        isFallback: true,
        keySignals: [
            {
                title: "Daily Brief Delayed",
                summary: "Today's live brief is delayed due to a system update. We will send an updated briefing shortly.",
                link: `${process.env.NEXT_PUBLIC_URL}/global-feed`,
                category: "SYSTEM"
            }
        ],
        marketImpact: "Visit the Global Feed for real-time market updates.",
        warRoomNote: "Check the War Room for live geopolitical signals."
    };
}
