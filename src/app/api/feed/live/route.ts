// @ts-nocheck
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, getCategoryFeeds } from '@/config/rss-feeds';
export const runtime = 'nodejs';

// Cache for 5 minutes to reduce function calls
export const revalidate = 300;

const parser = new Parser({
    timeout: 10000,
    customFields: {
        item: ['pubDate', 'content:encoded', 'description']
    }
});

// In-memory cache (will be replaced with Supabase later)
let articlesCache: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds - Near real-time

// Helper to clean HTML
function cleanText(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&[a-z]+;/gi, '')
        .substring(0, 200);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'All';
    const limit = parseInt(searchParams.get('limit') || '30');

    try {
        // Check if we need to refresh cache
        const now = Date.now();
        const shouldRefresh = now - lastFetchTime > CACHE_DURATION || articlesCache.length === 0;

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
                    .limit(200); // Fetch ample articles to support infinite scroll across categories

                if (category !== 'All') {
                    // Approximate category matching if needed, or rely on exact match
                    query = query.eq('category', category.toLowerCase());
                }

                const { data, error } = await query;

                if (!error && data && data.length > 0) {
                    // Transform DB shape to App shape
                    const dbArticles = data.map((item: any) => ({
                        id: item.id || Math.random().toString(),
                        title: item.title,
                        summary: item.summary,
                        description: item.summary,
                        publishedAt: item.published_at,
                        category: item.category,
                        source: item.source,
                        url: item.url,
                        topicSlug: 'news',
                        importanceScore: item.relevance_score || 0,
                        relatedLinks: []
                    }));

                    console.log(`[Feed/Live] Served ${dbArticles.length} articles from Supabase`);

                    // Filter locally for search if needed
                    let finalArticles = dbArticles;
                    const searchQuery = searchParams.get('search')?.toLowerCase();
                    if (searchQuery) {
                        finalArticles = finalArticles.filter((a: any) => a.title.toLowerCase().includes(searchQuery));
                    }

                    const page = parseInt(searchParams.get('page') || '1');
                    const offset = (page - 1) * limit;

                    return NextResponse.json({
                        articles: finalArticles.slice(offset, offset + limit),
                        count: finalArticles.length,
                        source: 'supabase',
                        lastUpdate: new Date().toISOString()
                    }, {
                        headers: {
                            'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
                        },
                    });
                }
            } catch (dbErr) {
                console.warn('[Feed/Live] Supabase fetch failed, falling back to RSS:', dbErr);
            }
        }

        // 2. FALLBACK TO DIRECT RSS FETCH (Original Logic)
        if (shouldRefresh) {
            console.log('Refreshing RSS cache from all sources (Fallback)...');

            // FETCH ALL SOURCES (No slicing) to ensure every category is populated
            const feedsToFetch = RSS_FEEDS;

            // Fetch all feeds in parallel
            const feedPromises = feedsToFetch.map(async (source, sourceIndex) => {
                try {
                    const feed = await parser.parseURL(source.url);
                    // Limit to 30 items per source at ingestion level to support infinite scroll
                    return feed.items.slice(0, 30).map((item, itemIndex) => ({
                        id: `${source.id}-${Date.now()}-${sourceIndex}-${itemIndex}-${item.guid || item.link || Math.random()}`,
                        source: source.name,
                        title: item.title || 'Untitled',
                        summary: cleanText(item.contentSnippet || item.description || ''),
                        description: cleanText(item.contentSnippet || item.description || ''),
                        publishedAt: item.pubDate || new Date().toISOString(),
                        category: source.category.toLowerCase(),
                        topicSlug: item.title?.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30) || 'news',
                        importanceScore: source.priority * 10,
                        url: item.link || '#',
                        relatedLinks: []
                    }));
                } catch (error) {
                    console.error(`Failed to fetch ${source.name}:`, error);
                    return [];
                }
            });

            const results = await Promise.all(feedPromises);

            // Flatten and sort by date
            let allArticles = results.flat().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

            // SPAM/PROMOTIONAL FILTER: Remove Black Friday, deals, sales content
            const spamKeywords = ['black friday', 'cyber monday', 'deal', 'sale', 'discount', 'coupon', 'promo'];
            allArticles = allArticles.filter(article => {
                const titleLower = article.title.toLowerCase();
                const summaryLower = article.summary.toLowerCase();
                return !spamKeywords.some(keyword => titleLower.includes(keyword) || summaryLower.includes(keyword));
            });


            // DIVERSITY FILTER: Limit to max 2 articles per source
            const sourceCounts: Record<string, number> = {};

            // DEDUPLICATION FILTER: Remove articles with very similar titles
            const acceptedTitles: string[] = [];

            // Helper for Jaccard similarity
            const getJaccardSimilarity = (str1: string, str2: string) => {
                const set1 = new Set(str1.toLowerCase().split(/\s+/));
                const set2 = new Set(str2.toLowerCase().split(/\s+/));
                const intersection = new Set([...set1].filter(x => set2.has(x)));
                const union = new Set([...set1, ...set2]);
                return intersection.size / union.size;
            };


            const isRelevantToAI = (article: any) => {
                const text = (article.title + ' ' + article.summary).toLowerCase();

                // 1. HARD BLOCK (Keeping this to avoid spam/irrelevant)
                const hardBlockKeywords = [
                    'kansai airport', 'airport food', 'japanese food', 'restaurant', 'cuisine',
                    'anime', 'manga', 'k-pop', 'singer', 'concert', 'music festival',
                    'fashion', 'sports', 'soccer', 'basketball', 'olympics', 'football',
                    'tourism', 'travel destination',
                    'video game', 'gaming console', 'movie release', 'film festival'
                ];

                if (hardBlockKeywords.some(keyword => text.includes(keyword))) {
                    return false;
                }

                // 2. IMMEDIATE ACCEPT (Strong Signals) - Just ONE is enough now
                const strongSignals = [
                    'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
                    'llm', 'large language model', 'gpt', 'chatgpt', 'claude', 'gemini', 'bard',
                    'generative ai', 'transformer', 'diffusion model',
                    'openai', 'anthropic', 'deepmind', 'nvidia', 'gpu',
                    'robot', 'robotic', 'robotics', 'autonomous', 'humanoid', 'drone',
                    'computer vision', 'nlp', 'language model', 'ai model', 'ai tool', 'ai startup',
                    'tech', 'technology', 'software', 'platform', 'app', 'data', 'cloud', 'server', // Relaxed: Broad Tech
                    'startup', 'venture', 'funding', 'market', 'stock', 'ipo' // Relaxed: broad market
                ];

                if (strongSignals.some(s => text.includes(s))) return true;

                // 3. CATEGORY AUTOMATIC ACCEPT
                if (['robotics', 'research', 'code', 'market', 'policy', 'tech', 'biotech', 'quantum', 'space', 'semiconductors', 'real-estate-residential', 'real-estate-commercial'].includes(article.category)) {
                    return true;
                }

                return false; // Only reject if it has NO tech keywords AND wrong category
            };

            articlesCache = allArticles.filter(article => {
                // 0. CRITICAL: Check AI/Robotics relevance FIRST
                if (!isRelevantToAI(article)) {
                    return false;
                }

                // 1. Check source diversity
                const count = sourceCounts[article.source] || 0;
                if (count >= 2) return false;

                // 2. Check for duplicates (similarity > 0.6)
                const isDuplicate = acceptedTitles.some(title =>
                    getJaccardSimilarity(article.title, title) > 0.6
                );

                if (isDuplicate) return false;

                // Accept article
                sourceCounts[article.source] = count + 1;
                acceptedTitles.push(article.title);
                return true;
            });

            lastFetchTime = now;
            console.log(`Cached ${articlesCache.length} articles from ${feedsToFetch.length} sources (after relevance + diversity filtering)`);
        }

        // Filter by category if needed
        let filteredArticles = articlesCache;

        if (category.toLowerCase() !== 'all') {
            const targetCategory = category.toLowerCase();
            filteredArticles = articlesCache.filter(a => a.category === targetCategory);
            console.log(`Filtering for category '${targetCategory}': found ${filteredArticles.length} articles`);
        }

        // Filter by search query if provided
        const searchQuery = searchParams.get('search')?.toLowerCase();
        if (searchQuery) {
            filteredArticles = filteredArticles.filter(a =>
                a.title.toLowerCase().includes(searchQuery) ||
                a.summary.toLowerCase().includes(searchQuery)
            );
            console.log(`Filtering for search '${searchQuery}': found ${filteredArticles.length} articles`);
        }

        // Filter by specific source if needed (optional)
        const sourceParam = searchParams.get('source');
        if (sourceParam) {
            filteredArticles = filteredArticles.filter(a => a.source === sourceParam);
        }

        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * limit;
        const articles = filteredArticles.slice(offset, offset + limit);

        return NextResponse.json({
            articles,
            count: articles.length,
            cached: !shouldRefresh,
            lastUpdate: new Date(lastFetchTime).toISOString()
        }, {
            headers: {
                'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error: any) {
        console.error('Feed API Error:', error);
        return NextResponse.json({
            articles: [],
            error: error.message
        }, { status: 500 });
    }
}
