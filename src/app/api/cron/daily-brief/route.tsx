import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DailyBriefEmail from '../../../../emails/DailyBriefEmail';

// Force dynamic to ensure fresh data
export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------
const MAX_RETRIES = 2; // Reduced to fit Vercel 10s limit
const RETRY_DELAY_MS = 1000;
const resend = new Resend(process.env.RESEND_API_KEY);

// ----------------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------------
async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mapCategory(category: string | undefined): string {
    const cat = (category || '').toLowerCase();
    if (cat.includes('ai') || cat.includes('model')) return 'AI_MODELS';
    if (cat.includes('policy') || cat.includes('regulation')) return 'POLICY';
    if (cat.includes('chip') || cat.includes('hardware')) return 'CHIPS';
    if (cat.includes('robot')) return 'ROBOTICS';
    if (cat.includes('market') || cat.includes('fund')) return 'MARKET';
    if (cat.includes('war') || cat.includes('conflict')) return 'GEOPOLITICS';
    return 'AI_MODELS';
}

function createFallbackBrief(date: string, articles: any[] = []) {
    if (articles.length > 0) {
        const topArticles = articles.slice(0, 5);
        return {
            date: date,
            generatedAt: new Date().toISOString(),
            headline: `AI-INTEL BRIEF: ${topArticles[0]?.title?.split(' ').slice(0, 4).join(' ').toUpperCase() || 'TOP SIGNALS'}`,
            isFallback: true,
            keySignals: topArticles.map((a: any) => ({
                title: a.title || 'Untitled Signal',
                summary: a.summary || 'Click through for details on this developing story.',
                link: a.url || a.link || `${process.env.NEXT_PUBLIC_URL}/global-feed`,
                category: mapCategory(a.category)
            })),
            marketImpact: "Visit the Global Feed for real-time market and capital flow updates.",
            warRoomNote: "Check the War Room for live geopolitical developments."
        };
    }
    return {
        date: date,
        generatedAt: new Date().toISOString(),
        headline: "AI-INTEL BRIEF: SYSTEM UPDATE",
        isFallback: true,
        keySignals: [
            {
                title: "Daily Brief Generation Delayed",
                summary: "Today's live brief is delayed due to a system update. We will send an updated briefing shortly.",
                link: `${process.env.NEXT_PUBLIC_URL}/global-feed`,
                category: "SYSTEM"
            }
        ],
        marketImpact: "Check the live Global Feed for real-time market signals.",
        warRoomNote: "Visit the War Room for live geopolitical updates."
    };
}

async function generateBriefWithAI(articles: any[], warRoomEvents: any[], date: string) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const articlesContext = articles.slice(0, 15).map((a: any) =>
        `- [${a.category || 'AI'}] ${a.title}: ${a.summary || 'No summary available.'} (Source: ${a.source || 'Unknown'}, URL: ${a.url || a.link || 'no-link'})`
    ).join('\n');

    const warRoomContext = warRoomEvents.length > 0
        ? warRoomEvents.map((e: any) => `- [WAR ROOM] ${e.title}: ${e.summary || e.description || ''}`).join('\n')
        : '- No major war room alerts today.';

    const prompt = `
    You are an elite AI Intelligence Analyst. Create today's "${date}" Daily Intelligence Brief.

    RAW DATA:
    === GLOBAL FEED ===
    ${articlesContext}
    === WAR ROOM ===
    ${warRoomContext}

    MISSION:
    Summarize TOP 3-5 most significant AI/tech developments.
    Tone: Professional intelligence-report. No fluff.

    OUTPUT FORMAT (JSON ONLY):
    {
      "date": "${date}",
      "headline": "AI-INTEL BRIEF: [2-4 word summary]",
      "keySignals": [
        {
          "title": "Signal headline",
          "summary": "1-2 sentence summary.",
          "link": "source URL from data",
          "category": "AI_MODELS | POLICY | CHIPS | ROBOTICS | MARKET | GEOPOLITICS"
        }
      ],
      "marketImpact": "One sentence on market implications.",
      "warRoomNote": "One sentence on key geopolitical development."
    }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
}

// ----------------------------------------------------------------------------
// MAIN HANDLER
// ----------------------------------------------------------------------------
export async function GET(request: Request) {
    try {
        console.log('[DailyBrief] Starting Atomic Generate-and-Send Process...');

        // 1. Authorization
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date().toISOString().split('T')[0];
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

        // 2. Fetch Data (Parallel)
        console.log('[DailyBrief] Fetching raw data...');
        let articles: any[] = [];
        let warRoomEvents: any[] = [];

        try {
            const [feedResponse, warRoomResponse] = await Promise.all([
                fetch(`${baseUrl}/api/feed/live?category=All&limit=15`),
                fetch(`${baseUrl}/api/feed/war-room`) // Corrected URL
            ]);

            const feedData = await feedResponse.json();
            articles = feedData.articles || [];

            const warRoomData = await warRoomResponse.json();
            warRoomEvents = warRoomData.incidents?.slice(0, 5) || [];
        } catch (e) {
            console.error('[DailyBrief] Data fetch warning:', e);
            // Proceed with whatever we have (or empty for fallback)
        }

        // 3. Generate Brief (AI with Retry)
        console.log('[DailyBrief] Generating content with Gemini...');
        let dailyBrief: any = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                dailyBrief = await generateBriefWithAI(articles, warRoomEvents, today);
                if (dailyBrief?.keySignals?.length > 0) break;
            } catch (error) {
                console.error(`[DailyBrief] Generation attempt ${attempt} failed:`, error);
                if (attempt < MAX_RETRIES) await delay(RETRY_DELAY_MS);
            }
        }

        if (!dailyBrief) {
            console.warn('[DailyBrief] AI Generation failed. Using Smart Fallback.');
            dailyBrief = createFallbackBrief(today, articles);
        }

        // 4. Fetch Subscribers (Resend)
        console.log('[DailyBrief] Fetching subscribers from Resend...');
        let subscribersList: string[] = [];
        try {
            // Try to find audience ID or just list default contacts if possible? 
            // NOTE: resend.contacts.list REQUIRES audienceId.
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
                if (contacts.data && contacts.data.data) {
                    // @ts-ignore
                    subscribersList = contacts.data.data.filter((c: any) => !c.unsubscribed).map((c: any) => c.email);
                } else if (contacts.data && Array.isArray(contacts.data)) {
                    // @ts-ignore
                    subscribersList = contacts.data.filter((c: any) => !c.unsubscribed).map((c: any) => c.email);
                }
            }
        } catch (e) {
            console.error('[DailyBrief] Subscriber fetch failed:', e);
        }

        // Always add admin/test email
        const testEmail = 'saziz4250@gmail.com';
        if (!subscribersList.includes(testEmail)) subscribersList.push(testEmail);

        if (subscribersList.length === 0) {
            return NextResponse.json({ message: 'No subscribers found' });
        }

        // 5. Send Emails
        console.log(`[DailyBrief] Sending to ${subscribersList.length} subscribers...`);
        const emailResults = await Promise.all(subscribersList.map(async (email) => {
            try {
                // Determine analyst notes, alerts etc from brief
                const notes = dailyBrief.keySignals.map((s: any) => ({
                    title: s.title,
                    summary: s.summary,
                    url: s.link
                }));
                const alert = dailyBrief.warRoomNote ? {
                    title: 'Geopolitical Update',
                    description: dailyBrief.warRoomNote,
                    severity: 'critical'
                } : undefined;

                const { data, error } = await resend.emails.send({
                    from: 'Novai Intelligence <brief@novai.intelligence>',
                    to: [email],
                    subject: dailyBrief.headline,
                    react: DailyBriefEmail({
                        date: today,
                        analystNotes: notes,
                        warRoomAlert: alert, // Fix type mismatch if generic any
                        marketImpact: dailyBrief.marketImpact,
                        extraLinks: []
                    }) as React.ReactElement,
                });
                return { email, status: error ? 'failed' : 'sent', id: data?.id, error };
            } catch (e) {
                return { email, status: 'failed', error: e };
            }
        }));

        const sent = emailResults.filter(r => r.status === 'sent').length;

        return NextResponse.json({
            success: true,
            mode: 'atomic-generate-send',
            date: today,
            headline: dailyBrief.headline,
            sent: sent,
            total: subscribersList.length,
            isFallback: dailyBrief.isFallback
        });

    } catch (metricError: any) {
        console.error('[DailyBrief] Process failed:', metricError);
        return NextResponse.json({ error: metricError.message }, { status: 500 });
    }
}
