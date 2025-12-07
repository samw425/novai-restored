import { NextResponse } from 'next/server';

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        console.log(`[GenerateBrief] Starting AI generation for ${today}`);

        // 1. Fetch fresh data from multiple sources
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

        // Fetch from Global Feed (top AI signals)
        const feedResponse = await fetch(`${baseUrl}/api/feed/live?category=All&limit=15`);
        const feedData = await feedResponse.json();
        const articles = feedData.articles || [];

        // Fetch War Room data
        let warRoomEvents: any[] = [];
        try {
            const warRoomResponse = await fetch(`${baseUrl}/api/war-room`);
            const warRoomData = await warRoomResponse.json();
            warRoomEvents = warRoomData.events?.slice(0, 5) || [];
        } catch (e) {
            console.warn('[GenerateBrief] War Room fetch failed, proceeding without:', e);
        }

        // 2. Generate brief with AI (with retry logic)
        let dailyBrief: any = null;
        let lastError: any = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`[GenerateBrief] AI generation attempt ${attempt}/${MAX_RETRIES}`);
                dailyBrief = await generateBriefWithAI(articles, warRoomEvents, today);

                if (dailyBrief && dailyBrief.keySignals && dailyBrief.keySignals.length > 0) {
                    console.log(`[GenerateBrief] ✅ AI generation successful on attempt ${attempt}`);
                    break;
                } else {
                    throw new Error('Generated brief missing required fields');
                }
            } catch (error) {
                lastError = error;
                console.error(`[GenerateBrief] Attempt ${attempt} failed:`, error);
                if (attempt < MAX_RETRIES) {
                    await delay(RETRY_DELAY_MS);
                }
            }
        }

        // 3. Handle complete failure - use smart fallback with real articles
        if (!dailyBrief) {
            console.error('[GenerateBrief] All AI generation attempts failed. Creating smart fallback from articles.');
            dailyBrief = createFallbackBrief(today, articles);
        }

        // 4. Save the brief as dated JSON
        const fs = await import('fs');
        const path = await import('path');

        // Save today's brief
        const briefsDir = path.join(process.cwd(), 'src/lib/data/daily-briefs');
        if (!fs.existsSync(briefsDir)) {
            fs.mkdirSync(briefsDir, { recursive: true });
        }

        const todayFilePath = path.join(briefsDir, `${today}.json`);
        fs.writeFileSync(todayFilePath, JSON.stringify(dailyBrief, null, 2));
        console.log(`[GenerateBrief] ✅ Saved brief to ${todayFilePath}`);

        // 5. Archive management: Keep only last 30 days
        const archiveDir = path.join(briefsDir, 'archive');
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        // Move briefs older than today to archive (but keep last 30)
        const files = fs.readdirSync(briefsDir).filter((f: string) => f.endsWith('.json') && f !== `${today}.json`);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        for (const file of files) {
            const fileDate = file.replace('.json', '');
            if (new Date(fileDate) < thirtyDaysAgo) {
                // Delete old files beyond 30 days
                fs.unlinkSync(path.join(briefsDir, file));
                console.log(`[GenerateBrief] Cleaned up old brief: ${file}`);
            }
        }

        return NextResponse.json({
            success: true,
            date: today,
            generatedAt: new Date().toISOString(),
            keySignalsCount: dailyBrief.keySignals?.length || 0,
            isFallback: dailyBrief.isFallback || false
        });

    } catch (error) {
        console.error('[GenerateBrief] Critical error:', error);
        return NextResponse.json({ error: 'Failed to generate daily brief' }, { status: 500 });
    }
}

/**
 * Use AI (Gemini) to generate a fresh daily brief from source data.
 */
async function generateBriefWithAI(articles: any[], warRoomEvents: any[], date: string) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Prepare context from fresh articles
    const articlesContext = articles.slice(0, 15).map((a: any) =>
        `- [${a.category || 'AI'}] ${a.title}: ${a.summary || 'No summary available.'} (Source: ${a.source || 'Unknown'}, URL: ${a.url || a.link || 'no-link'})`
    ).join('\n');

    const warRoomContext = warRoomEvents.length > 0
        ? warRoomEvents.map((e: any) => `- [WAR ROOM] ${e.title}: ${e.summary || e.description || ''}`).join('\n')
        : '- No major war room alerts today.';

    const prompt = `
You are an elite AI Intelligence Analyst. Your task is to create today's "${date}" Daily Intelligence Brief.

AVAILABLE RAW DATA (from last 24 hours):

=== GLOBAL FEED (AI/Tech Developments) ===
${articlesContext}

=== WAR ROOM (Geopolitical/Conflict Activity) ===
${warRoomContext}

=== YOUR MISSION ===
Create a FRESH, NEW brief that summarizes the TOP 3-5 most significant AI/tech developments from the data above.

CRITICAL RULES:
1. Content must be NEW - do NOT reuse old content or generic descriptions.
2. Only include stories that actually appear in the data above.
3. Each signal must have: title, 1-2 sentence summary, and the source link.
4. Professional intelligence-report tone: clean, concise, no fluff, no opinions.
5. Use accurate policy/military/market language.
6. Prioritize: frontier AI models, policy changes, major funding, chip/hardware news, geopolitics affecting tech.

OUTPUT FORMAT (strict JSON, no markdown):
{
  "date": "${date}",
  "generatedAt": "${new Date().toISOString()}",
  "headline": "AI-INTEL BRIEF: [2-4 word summary of top story]",
  "keySignals": [
    {
      "title": "Signal headline",
      "summary": "1-2 sentence professional summary of what happened and why it matters.",
      "link": "source URL from the data",
      "category": "AI_MODELS | POLICY | CHIPS | ROBOTICS | MARKET | GEOPOLITICS"
    }
  ],
  "marketImpact": "One sentence on any notable market/capital flow implications.",
  "warRoomNote": "One sentence summary of key geopolitical/conflict development, if any."
}

Return ONLY valid JSON. No markdown, no explanation text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const brief = JSON.parse(cleanJson);

    return brief;
}

/**
 * Create a fallback brief from raw articles when AI generation fails.
 * This ensures subscribers still get useful content even if Gemini is down.
 */
function createFallbackBrief(date: string, articles: any[] = []) {
    // If we have articles, create a real brief from the top 5
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

    // True fallback when even articles aren't available
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

/**
 * Map article categories to brief categories.
 */
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

