import { NextResponse } from 'next/server';
import { getLatestBrief } from '@/lib/data/daily-briefs';

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------
export const dynamic = 'force-dynamic'; // We handle caching manually via headers
export const maxDuration = 60; // Allow up to 60s for generation

// ----------------------------------------------------------------------------
// GENERATION LOGIC (Duplicated for Isolation/Stability)
// ----------------------------------------------------------------------------
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
      "clearanceLevel": "SENSITIVE // INTERNAL",
      "items": [
        {
          "id": "1",
          "title": "Compelling Headline",
          "summary": "Full 4-8 sentence Deep Dive. Sentence 1: The Event. Sentence 2-4: Context & Details. Sentence 5-8: Strategic Implications & Future Outlook.",
          "link": "URL_FROM_SOURCE_DATA_ONLY",
          "category": "CATEGORY_FROM_LIST_ABOVE",
          "impact": "CRITICAL",
          "source": "SOURCE_NAME_FROM_DATA"
        }
      ],
      "marketImpact": "Strategic analysis of capital flow implications. (3-4 sentences)",
      "warRoomNote": "Brief status update on active conflict zones."
    }
    
    Return ONLY valid JSON. No markdown.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    // Schema Patching: Ensure API matches Frontend Interface
    if (data.keySignals && !data.items) data.items = data.keySignals; // Fallback for old cache

    if (data.items) {
        data.items = data.items.map((item: any, i: number) => ({
            ...item,
            id: item.id || (i + 1).toString(),
            impact: ['CRITICAL', 'SEVERE', 'HIGH', 'MEDIUM'].includes(item.impact) ? item.impact : 'HIGH',
            source: item.source || 'INTEL WIRE'
        }));
    }

    return data;
}

// ----------------------------------------------------------------------------
// MAIN HANDLER
// ----------------------------------------------------------------------------
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    // Archive mode still falls back to static for now
    if (mode === 'archive') {
        return NextResponse.json({ briefs: [] });
    }

    try {
        console.log('[API/Brief] Starting On-Demand Generation...');
        // Force US/Eastern Time for "Today" (Aligns with 8am EST Daily Brief cadence)
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // Returns YYYY-MM-DD format for EST
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

        // 0. CHECK SUPABASE (Priority 1)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, supabaseKey);

                const { data: dbData, error: dbError } = await supabase
                    .from('daily_snapshots')
                    .select('*')
                    .eq('date', today)
                    .single();

                if (dbData && dbData.briefing_body) {
                    console.log('[API/Brief] Serving cached brief from Supabase');
                    return NextResponse.json({ brief: dbData.briefing_body }, {
                        headers: {
                            'Cache-Control': 'public, s-maxage=3600',
                            'CDN-Cache-Control': 'public, s-maxage=3600',
                            'Vercel-CDN-Cache-Control': 'public, s-maxage=3600',
                        }
                    });
                }
            } catch (dbEx) {
                console.warn('[API/Brief] Supabase lookup failed, falling back to generation:', dbEx);
            }
        }

        // 1. Fetch Fresh Data (Fallback)
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
            console.error('[API/Brief] Data fetch failed:', e);
        }

        // 2. Generate with AI
        let briefData = null;
        let generationError = null;
        try {
            briefData = await generateBriefWithAI(articles, warRoomEvents, today);
        } catch (genError: any) {
            console.error('[API/Brief] Generation failed:', genError);
            generationError = genError.message;
        }

        // 3. Last Resort Fallback
        if (!briefData) {
            console.warn('[API/Brief] using fallback data');
            briefData = getLatestBrief();
            // Inject debug info into the brief object if possible, or wrap it
            (briefData as any)._debugError = generationError;
        }

        // 4. Return with Aggressive Caching
        // s-maxage=86400 (24h shared cache), stale-while-revalidate=3600 (1h background refresh)
        return NextResponse.json({ brief: briefData }, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
                'CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
                'Vercel-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
            }
        });

    } catch (error: any) {
        console.error('[API/Brief] Critical failure:', error);
        const fallback = getLatestBrief();
        return NextResponse.json({
            brief: fallback,
            debugError: error.message,
            debugStack: error.stack
        });
    }
}
