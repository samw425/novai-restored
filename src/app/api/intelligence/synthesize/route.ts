import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import Parser from 'rss-parser';
import { RSS_FEEDS } from '@/config/rss-feeds';

// Must be NodeJS runtime to use RSS Parser efficiently
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Theme {
    title: string;
    articles: any[];
    synthesis: string;
    implications: string[];
    confidence: number;
}

// Simple in-memory cache
let briefCache: {
    data: any;
    timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
    try {
        // Check cache first
        if (briefCache && (Date.now() - briefCache.timestamp < CACHE_DURATION)) {
            return NextResponse.json(briefCache.data);
        }

        // Fetch top articles from last 24 hours
        let articles: any[] = [];

        // 1. Try Internal API
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            console.log('Fetching articles from:', `${baseUrl}/api/feed/live?limit=100`);

            const response = await fetch(`${baseUrl}/api/feed/live?limit=100`);
            if (response.ok) {
                const data = await response.json();
                articles = data.articles || [];
                console.log(`Fetched ${articles.length} articles from Internal API`);
            }
        } catch (e) {
            console.error('Failed to fetch from internal API:', e);
        }

        // 2. FALLBACK: Direct RSS Fetch (If API fails)
        if (articles.length === 0) {
            console.log('Internal API failed/empty. Executing Direct RSS Fallback...');
            try {
                const parser = new Parser({
                    timeout: 5000,
                    customFields: { item: ['pubDate', 'content:encoded', 'description'] }
                });

                // Fetch from a few reliable high-signal sources
                const sources = RSS_FEEDS.slice(0, 8); // Top 8 sources from config
                const feedPromises = sources.map(source =>
                    parser.parseURL(source.url).then(feed => ({ source: source.name, items: feed.items })).catch(() => null)
                );

                const results = await Promise.all(feedPromises);

                articles = results
                    .filter(res => res !== null && res.items.length > 0)
                    .flatMap(res => res!.items.slice(0, 3).map(item => ({
                        title: item.title || 'Untitled',
                        summary: item.contentSnippet || item.content || item.description || '',
                        url: item.link || '#',
                        source: res!.source,
                        publishedAt: item.pubDate || new Date().toISOString()
                    })))
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .slice(0, 30);

                console.log(`Direct RSS Fallback retrieved ${articles.length} fresh articles`);

            } catch (rssError) {
                console.error('Direct RSS Fallback failed:', rssError);
                // Only if EVERYTHING fails do we use static backup
                articles = [
                    { title: "System Alert: Live Feeds Unavailable", summary: "Unable to retrieve real-time intelligence at this moment. Check network connection.", source: "System", url: "#" }
                ];
            }
        }

        // Group articles by theme using simple keyword clustering
        const themes = await groupArticlesByTheme(articles);

        // Synthesize each theme with Gemini
        const synthesizedThemes = await Promise.all(
            themes.map((theme: any) => synthesizeTheme(theme))
        );

        let finalThemes = synthesizedThemes.filter(t => t !== null);

        // FINAL SAFETY NET
        if (finalThemes.length === 0) {
            finalThemes = [{
                title: "Intelligence Stream Disruption",
                articles: articles.slice(0, 3),
                synthesis: "Real-time synthesis is currently unavailable due to data feed interruption.",
                implications: ["Manual verification required.", "Check individual source feeds."],
                confidence: 50
            }];
        }

        // Generate Global Metrics
        const globalMetrics = await generateGlobalMetrics(articles);

        const result = {
            themes: finalThemes,
            globalSentiment: globalMetrics?.sentiment || 50,
            topKeywords: globalMetrics?.keywords || [],
            executiveSummary: globalMetrics?.executiveSummary || "Intelligence synthesis pending available data streams.",
            generatedAt: new Date().toISOString(),
            articleCount: articles.length
        };

        // Update cache
        briefCache = {
            data: result,
            timestamp: Date.now()
        };

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Intelligence synthesis error:', error);
        return NextResponse.json({
            error: error.message,
            themes: []
        }, { status: 500 });
    }
}

async function groupArticlesByTheme(articles: any[]): Promise<{ title: string, articles: any[] }[]> {
    const keywords = [
        { theme: 'AI Models & Research', keywords: ['gpt', 'claude', 'gemini', 'llm', 'model', 'training', 'research', 'reasoning'] },
        { theme: 'Robotics & Automation', keywords: ['robot', 'automation', 'drone', 'autonomous', 'figure', 'tesla bot'] },
        { theme: 'AI Safety & Policy', keywords: ['safety', 'regulation', 'policy', 'ethics', 'alignment', 'risk', 'white house', 'ban'] },
        { theme: 'Cyber & Defense', keywords: ['cyber', 'hack', 'breach', 'security', 'vulnerability', 'attack', 'military', 'war'] },
        { theme: 'Silicon & Compute', keywords: ['chip', 'gpu', 'nvidia', 'amd', 'compute', 'semiconductor', 'foundry'] },
        { theme: 'Funding & M&A', keywords: ['funding', 'investment', 'acquisition', 'ipo', 'merger', 'capital', 'raise'] },
    ];

    const grouped: Record<string, any[]> = {};

    articles.forEach(article => {
        const text = (article.title + ' ' + article.summary).toLowerCase();
        let assigned = false;

        for (const { theme, keywords: kws } of keywords) {
            if (kws.some(kw => text.includes(kw))) {
                if (!grouped[theme]) grouped[theme] = [];
                grouped[theme].push(article);
                assigned = true;
                break;
            }
        }

        if (!assigned) {
            if (!grouped['Industry Moves']) grouped['Industry Moves'] = [];
            grouped['Industry Moves'].push(article);
        }
    });

    // Filter to themes with enough data
    let finalThemes = Object.entries(grouped)
        .filter(([_, arts]) => arts.length >= 2)
        .sort((a, b) => b[1].length - a[1].length) // Prioritize largest themes
        .map(([title, arts]) => ({ title, articles: arts.slice(0, 5) }))
        .slice(0, 4);

    if (finalThemes.length === 0 && articles.length > 0) {
        finalThemes = [{
            title: 'Global Intelligence Update',
            articles: articles.slice(0, 5)
        }];
    }

    return finalThemes;
}

async function synthesizeTheme(theme: { title: string, articles: any[] }): Promise<Theme | null> {
    try {
        const articleSummaries = theme.articles.map((a, i) =>
            `${i + 1}. ${a.title} (${a.source})\n   ${a.summary}`
        ).join('\n\n');

        const prompt = `You are an elite intelligence analyst. Analyze these ${theme.articles.length} news items about "${theme.title}" for a classified briefing.
        
Articles:
${articleSummaries}

Provide:
1. A concise synthesis (2-3 sentences) identifying the *underlying strategic shift* or pattern.
2. Three specific implications (bullet points) for the future (short/medium term).
3. Confidence level (0-100).

Respond in clean JSON:
{
  "synthesis": "string",
  "implications": ["string", "string", "string"],
  "confidence": number
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                title: theme.title,
                articles: theme.articles,
                synthesis: analysis.synthesis,
                implications: analysis.implications || [],
                confidence: analysis.confidence || 75
            };
        }
        return null;

    } catch (error) {
        console.error(`Failed to synthesize theme "${theme.title}":`, error);
        return null;
    }
}

async function generateGlobalMetrics(articles: any[]): Promise<{ sentiment: number, keywords: { text: string, weight: number }[], executiveSummary: string } | null> {
    try {
        const sample = articles.slice(0, 20).map((a: any) => `${a.title}: ${a.summary}`).join('\n');

        const prompt = `You are the Chief Intelligence Officer. Write the "Daily Executive Brief" based on these headlines.
        
HEADLINES:
${sample}

Structure with 4 bold headers:
1. **The Lead Narrative** (The biggest story and why it matters)
2. **Strategic Signal** (Implications for compute, policy, or models)
3. **Market Shifts** (Capital flow and business impact)
4. **Forecast** (What happens next?)

Respond in JSON:
{
  "sentiment": number (0-100),
  "keywords": [{ "text": "string", "weight": number }],
  "executiveSummary": "string (The formatted markdown report)"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        console.error('Error generating global metrics:', error);
        return {
            sentiment: 50,
            keywords: [],
            executiveSummary: "Detailed analysis currently unavailable. Refer to individual theme breakdowns."
        };
    }
}
