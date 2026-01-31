
import { NextResponse } from 'next/server';
import { parseRSS } from '@/lib/rss-edge';
import { RSS_FEEDS } from '@/config/rss-feeds';
import {
    cleanText,
    isRelevantToAI,
    getJaccardSimilarity,
    ANTI_TRUST_KEYWORDS,
    BUILT_WORLD_KEYWORDS,
    FUTURE_OF_CODE_KEYWORDS
} from '@/lib/feed-logic';

export const runtime = 'edge';
export const revalidate = 300;

let articlesCache: Record<string, { data: any[], time: number }> = {};
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function GET(
    request: Request,
    { params }: { params: Promise<{ category: string }> }
) {
    const { category: rawCategory } = await params;
    const { searchParams } = new URL(request.url);

    // Normalize category from path or query param
    let category = rawCategory.toLowerCase();
    const queryCategory = searchParams.get('category')?.toLowerCase();

    if (category === 'live' || category === 'all') {
        category = queryCategory || 'all';
    }

    const limit = parseInt(searchParams.get('limit') || '30');
    const page = parseInt(searchParams.get('page') || '1');
    const searchQuery = searchParams.get('search')?.toLowerCase();
    const type = searchParams.get('type'); // used by built-world and future-of-code
    const majorOnly = searchParams.get('major') === 'true'; // used by anti-trust

    try {
        // 1. TRY SUPABASE (Preferred Source)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, supabaseKey);

                let query = supabase
                    .from('articles')
                    .select('*')
                    .order('published_at', { ascending: false })
                    .limit(200);

                if (category !== 'all') {
                    // Map special categories to slugs if they differ
                    let dbCategory = category;
                    if (category === 'anti-trust') dbCategory = 'antitrust';
                    query = query.eq('category', dbCategory);
                }

                const { data, error } = await query;

                if (!error && data && data.length > 0) {
                    let dbArticles = data.map((item: any) => ({
                        id: item.id || Math.random().toString(),
                        title: item.title,
                        summary: item.summary,
                        description: item.summary,
                        publishedAt: item.published_at,
                        category: item.category,
                        source: item.source,
                        url: item.url,
                        importanceScore: item.relevance_score || 0,
                    }));

                    // Apply special filters for specific categories if they are served from DB
                    if (category === 'anti-trust' && majorOnly) {
                        dbArticles = dbArticles.filter(a =>
                            ANTI_TRUST_KEYWORDS.MAJOR.some(k => a.title.toLowerCase().includes(k))
                        );
                    }

                    if (searchQuery) {
                        dbArticles = dbArticles.filter(a => a.title.toLowerCase().includes(searchQuery));
                    }

                    const offset = (page - 1) * limit;
                    return NextResponse.json({
                        articles: dbArticles.slice(offset, offset + limit),
                        count: dbArticles.length,
                        source: 'supabase',
                        lastUpdate: new Date().toISOString()
                    });
                }
            } catch (dbErr) {
                console.warn(`[Feed/${category}] Supabase fail, fallback to RSS:`, dbErr);
            }
        }

        // 2. FALLBACK TO RSS
        const now = Date.now();
        const cached = articlesCache[category];
        if (cached && (now - cached.time < CACHE_DURATION) && !searchQuery) {
            const offset = (page - 1) * limit;
            return NextResponse.json({
                articles: cached.data.slice(offset, offset + limit),
                count: cached.data.length,
                source: 'cache',
                lastUpdate: new Date(cached.time).toISOString()
            });
        }

        // Fetch from RSS
        let feedsToFetch = RSS_FEEDS;
        if (category !== 'all') {
            const target = category === 'anti-trust' ? 'antitrust' : category;
            feedsToFetch = RSS_FEEDS.filter(f => f.category === target);

            // For some categories, we also pull from high-priority general feeds
            if (['antitrust', 'built-world', 'policy'].includes(target)) {
                const general = RSS_FEEDS.filter(f => ['market', 'ai', 'research'].includes(f.category) && f.priority >= 9);
                feedsToFetch = [...feedsToFetch, ...general.slice(0, 10)];
            }
        }

        const feedPromises = feedsToFetch.map(async (source) => {
            try {
                const feed = await parseRSS(source.url, { timeout: 5000 });
                return feed.items.slice(0, 20).map((item) => ({
                    id: `${source.id}-${item.id || item.link}`,
                    source: source.name,
                    title: item.title || 'Untitled',
                    summary: cleanText(item.contentSnippet || item.description || ''),
                    publishedAt: item.pubDate || new Date().toISOString(),
                    category: source.category,
                    url: item.link || '#',
                    importanceScore: source.priority * 10
                }));
            } catch (e) { return []; }
        });

        const results = await Promise.all(feedPromises);
        let allArticles = results.flat().sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        // Deduplicate
        const seenTitles = new Set();
        allArticles = allArticles.filter(a => {
            if (seenTitles.has(a.title)) return false;
            seenTitles.add(a.title);
            return isRelevantToAI(a.title, a.summary, a.category);
        });

        // Apply route-specific filters
        if (category === 'anti-trust') {
            allArticles = allArticles.filter(a => {
                const text = (a.title + ' ' + a.summary).toLowerCase();
                const hasStrong = ANTI_TRUST_KEYWORDS.STRONG.some(k => text.includes(k));
                const hasWeak = ANTI_TRUST_KEYWORDS.WEAK.some(k => text.includes(k));
                const hasCompany = ANTI_TRUST_KEYWORDS.COMPANIES.some(k => text.includes(k));
                const isMajor = ANTI_TRUST_KEYWORDS.MAJOR.some(k => text.includes(k));

                if (majorOnly) return isMajor || (hasStrong && hasCompany);
                return hasStrong || (hasWeak && hasCompany);
            });
        } else if (category === 'built-world' && type && type !== 'all') {
            allArticles = allArticles.filter(a => {
                const text = (a.title + ' ' + a.summary).toLowerCase();
                const subCat = BUILT_WORLD_KEYWORDS.COMMERCIAL.some(k => text.includes(k)) ? 'commercial' : 'residential';
                return subCat === type;
            });
        }

        // Cache result
        articlesCache[category] = { data: allArticles, time: now };

        const offset = (page - 1) * limit;
        return NextResponse.json({
            articles: allArticles.slice(offset, offset + limit),
            count: allArticles.length,
            source: 'rss',
            lastUpdate: new Date(now).toISOString()
        });

    } catch (error: any) {
        return NextResponse.json({ articles: [], error: error.message }, { status: 500 });
    }
}
