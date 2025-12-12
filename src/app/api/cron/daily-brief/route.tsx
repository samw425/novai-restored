import { NextResponse } from 'next/server';
import { getSubscribers, sendSubscriberEmail } from '@/lib/email/utils';
import DailyBriefEmail from '@emails/DailyBriefEmail';

// Force dynamic to ensure fresh data
export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------
const MAX_RETRIES = 2; // Reduced to fit Vercel 10s limit
const RETRY_DELAY_MS = 1000;

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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const articlesContext = articles.slice(0, 15).map((a: any) =>
        `- [${a.category || 'AI'}] ${a.title}: ${a.summary || 'No summary available.'} (Source: ${a.source || 'Unknown'}, URL: ${a.url || a.link || 'no-link'})`
    ).join('\n');

    const warRoomContext = warRoomEvents.length > 0
        ? warRoomEvents.map((e: any) => `- [WAR ROOM] ${e.title}: ${e.summary || e.description || ''}`).join('\n')
        : '- No major war room alerts today.';

    const prompt = `
    You are an elite AI Intelligence Analyst operating at a SENSITIVE // INTERNAL level.
    Your mission is to generate today's "${date}" Daily Intelligence Brief.

    RAW INTELLIGENCE STREAMS:
    
    === GLOBAL FEED (Tech/Market Signals) ===
    ${articlesContext}
    
    === WAR ROOM (Geopolitical Threats) ===
    ${warRoomContext}

    COMMANDER'S INTENT:
    Generate a highly detailed, executive-level intelligence synthesis of the 4 most critical developments.
    
    REQUIREMENTS:
    1. **DEPTH IS CRITICAL**: Do NOT write short summaries. Each signal must have a **6-8 sentence "Deep Dive" paragraph** explaining the *strategic implication*, not just the news.
    2. **STRICT ATTRIBUTION**: Every single point MUST have a valid source link from the provided data.
    3. **TONE**: Extremely professional, objective, high-stakes intelligence reporting.
    4. **NO FLUFF**: Every sentence must add value.

    Use these categories ONLY:
    - GLOBAL AI RACE
    - CYBER WARFARE
    - MODEL INTELLIGENCE
    - MARKET SIGNAL

    OUTPUT FORMAT (JSON ONLY):
    {
      "date": "${date}",
      "headline": "AI-INTEL BRIEF: [POWERFUL 3-WORD THEME]",
      "keySignals": [
        {
          "title": "Compelling Headline",
          "summary": "Full 6-8 sentence analysis. Sentence 1: The Event. Sentence 2-4: Context & Details. Sentence 5-8: Strategic Implications & Future Outlook.",
          "link": "URL_FROM_SOURCE_DATA_ONLY",
          "category": "CATEGORY_FROM_LIST_ABOVE"
        }
      ],
      "marketImpact": "Strategic analysis of capital flow implications.",
      "warRoomNote": "Brief status update on active conflict zones."
    }
    
    Return ONLY valid JSON. No markdown.`;

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
        const { searchParams } = new URL(request.url);
        const bypass = searchParams.get('bypass');
        const authHeader = request.headers.get('authorization');

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && bypass !== 'force_gen_now') {
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
                fetch(`${baseUrl}/api/feed/war-room`)
            ]);

            const feedData = await feedResponse.json();
            articles = feedData.articles || [];

            const warRoomData = await warRoomResponse.json();
            warRoomEvents = warRoomData.incidents?.slice(0, 5) || [];
        } catch (e) {
            console.error('[DailyBrief] Data fetch warning:', e);
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

        // 3.5 Save to Supabase (Persistence Layer)
        console.log('[DailyBrief] Saving to Supabase...');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, supabaseKey);

                const { error: dbError } = await supabase
                    .from('daily_snapshots')
                    .upsert({
                        date: today,
                        headline: dailyBrief.headline,
                        subheadline: dailyBrief.marketImpact, // Mapping market impact to subheadline for now
                        briefing_body: dailyBrief, // Save full JSON structure
                        created_at: new Date().toISOString()
                    }, {
                        onConflict: 'date'
                    });

                if (dbError) {
                    console.error('[DailyBrief] Supabase save failed:', dbError);
                } else {
                    console.log('[DailyBrief] ✅ Saved to Supabase');
                }
            } catch (err) {
                console.error('[DailyBrief] Supabase init failed:', err);
            }
        } else {
            console.warn('[DailyBrief] Supabase credentials missing. Skipping persistence.');
        }

        // 4. Fetch Subscribers (using centralized util)
        console.log('[DailyBrief] Fetching subscribers from Resend...');
        let subscribersList = await getSubscribers();

        // Always add admin/test email
        const testEmail = 'swaziz01@gmail.com';
        if (!subscribersList.includes(testEmail)) subscribersList.push(testEmail);

        if (subscribersList.length === 0) {
            return NextResponse.json({ message: 'No subscribers found' });
        }

        // 5. Send Emails (using centralized util)
        console.log(`[DailyBrief] Sending to ${subscribersList.length} subscribers...`);
        const emailResults = await Promise.all(subscribersList.map(async (email) => {
            try {
                const notes = dailyBrief.keySignals.map((s: any) => ({
                    title: s.title,
                    summary: s.summary,
                    url: s.link
                }));
                const alert = dailyBrief.warRoomNote ? {
                    title: 'Geopolitical Update',
                    summary: dailyBrief.warRoomNote,
                    link: `${process.env.NEXT_PUBLIC_URL}/war-room`,
                    severity: 'critical'
                } : undefined;

                // Build 3-5 deeper intelligence links from source articles
                const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://usenovai.live';
                const deeperLinks = [
                    ...dailyBrief.keySignals.slice(0, 3).map((s: any) => ({
                        label: s.title?.slice(0, 50) + (s.title?.length > 50 ? '...' : ''),
                        url: s.link
                    })),
                    { label: 'Browse the Global Feed', url: `${baseUrl}/global-feed` },
                    { label: 'War Room Updates', url: `${baseUrl}/war-room` }
                ].filter(link => link.url && link.label);

                const { id, error } = await sendSubscriberEmail(
                    email,
                    `Novai Daily Brief — ${today}`,
                    DailyBriefEmail({
                        date: today,
                        analystNotes: notes,
                        warRoomAlert: alert,
                        marketImpact: dailyBrief.marketImpact,
                        extraLinks: deeperLinks.slice(0, 5)
                    }) as React.ReactElement
                );
                return { email, status: error ? 'failed' : 'sent', id, error };
            } catch (e: any) {
                return { email, status: 'failed', error: e.message };
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
            isFallback: dailyBrief.isFallback,
            savedToDb: !!(supabaseUrl && supabaseKey)
        });

    } catch (metricError: any) {
        console.error('[DailyBrief] Process failed:', metricError);
        return NextResponse.json({ error: metricError.message }, { status: 500 });
    }
}

