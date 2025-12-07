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

        // 3. Fetch Subscribers (From Resend Audience/Contacts instead of Supabase)
        // Since we are moving away from Supabase, we will list contacts from Resend.
        // Limited to 100 for now (pagination needed for large lists, but fine for MVP)
        // Reuse existing variable 'subscribers' declared above if any, or declar new if scoped correctly.
        // Actually, let's just re-assign or declare cleanly. 
        // Note: Earlier code had `let subscribers = ...`

        let subscribersList: string[] = []; // Renamed to avoid collision
        try {
            // Needed: Audience ID. If we don't know it, we list audiences first.
            let audienceId = process.env.RESEND_AUDIENCE_ID;

            if (!audienceId) {
                // @ts-ignore
                const audiences = await resend.audiences.list();
                // @ts-ignore
                if (audiences.data && audiences.data.length > 0) {
                    // @ts-ignore
                    audienceId = audiences.data[0].id;
                }
            }

            if (audienceId) {
                const contacts = await resend.contacts.list({ audienceId });
                // @ts-ignore
                if (contacts.data && Array.isArray(contacts.data.data)) {
                    // @ts-ignore
                    subscribersList = contacts.data.data
                        .filter((c: any) => !c.unsubscribed)
                        .map((c: any) => c.email);
                } else if (contacts.data && Array.isArray(contacts.data)) {
                    // Handle different response structure if needed
                    // @ts-ignore
                    subscribersList = contacts.data
                        .filter((c: any) => !c.unsubscribed)
                        .map((c: any) => c.email);
                }
            } else {
                console.warn('[DailyBrief] No Audience ID found. Cannot fetch subscribers list.');
            }

        } catch (subError) {
            console.error('[DailyBrief] Failed to fetch subscribers from Resend:', subError);
        }

        // Also add the manually requested test email if not in list
        const testEmail = 'saziz4250@gmail.com';
        if (!subscribersList.includes(testEmail)) {
            subscribersList.push(testEmail);
        }

        console.log(`[DailyBrief] Found ${subscribersList.length} active subscribers to email.`);

        if (subscribersList.length === 0) {
            return NextResponse.json({ message: 'No active subscribers found.' });
        }

        // 4. Send Emails in Parallel
        const emailPromises = subscribersList.map(async (email) => {
            try {
                const { data, error } = await resend.emails.send({
                    from: 'Novai Intelligence <brief@novai.intelligence>',
                    to: [email],
                    subject: dailyBrief.headline || `AI-INTEL BRIEF: ${today}`,
                    react: DailyBriefEmail({
                        date: dailyBrief.date || today,
                        analystNotes: analystNotes,
                        warRoomAlert: warRoomAlert,
                        marketImpact: marketImpact,
                        extraLinks: [
                            { label: 'Global Feed — Live Signals', url: `${process.env.NEXT_PUBLIC_URL}/global-feed` },
                            { label: 'War Room — Live Map', url: `${process.env.NEXT_PUBLIC_URL}/war-room` }
                        ]
                    }) as React.ReactElement,
                });

                if (error) {
                    console.error(`[DailyBrief] Failed to send to ${email}:`, error);
                    return { email, status: 'failed', error };
                }
                return { email, status: 'sent', id: data?.id };
            } catch (e) {
                console.error(`[DailyBrief] Exception sending to ${email}:`, e);
                return { email, status: 'failed', error: e };
            }
        });

        const results = await Promise.all(emailPromises);
        const sentCount = results.filter(r => r.status === 'sent').length;

        return NextResponse.json({
            success: true,
            message: `Processed brief for ${today}`,
            briefHeadline: dailyBrief.headline,
            subscribersCount: subscribers.length,
            emailsSent: sentCount,
            results: results // Detailed report
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
