import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, getCategoryFeeds } from '@/config/rss-feeds';

const parser = new Parser({
    timeout: 10000,
    customFields: {
        item: ['pubDate', 'content:encoded', 'description']
    }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory cache (will be replaced with Supabase later)
let articlesCache: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes - reduced fetch frequency for better performance

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

        if (shouldRefresh) {
            console.log('Refreshing RSS cache from all sources...');

            // FETCH ALL SOURCES (No slicing) to ensure every category is populated
            const feedsToFetch = RSS_FEEDS;

            // Fetch all feeds in parallel
            const feedPromises = feedsToFetch.map(async (source, sourceIndex) => {
                try {
                    const feed = await parser.parseURL(source.url);
                    // Limit to 3 items per source at ingestion level to save memory
                    return feed.items.slice(0, 3).map((item, itemIndex) => ({
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


            // CRITICAL: AI/Robotics Relevance Filter (STRICTEST VERSION)
            const isRelevantToAI = (article: any) => {
                const text = (article.title + ' ' + article.summary).toLowerCase();

                // IMMEDIATE DISQUALIFIERS - If any of these are present, reject immediately
                const hardBlockKeywords = [
                    'kansai airport', 'airport food', 'japanese food', 'restaurant', 'cuisine',
                    'anime', 'manga', 'k-pop', 'singer', 'concert', 'music festival',
                    'fashion', 'sports', 'soccer', 'basketball', 'olympics', 'football',
                    'real estate', 'property', 'housing market', 'tourism', 'travel destination',
                    'video game', 'gaming console', 'movie release', 'film festival'
                ];

                if (hardBlockKeywords.some(keyword => text.includes(keyword))) {
                    console.log(`⛔ HARD BLOCKED: "${article.title}"`);
                    return false;
                }

                // STRONG AI/ML/Robotics/Tech keywords - MUST match at least TWO
                const strongSignals = [
                    'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
                    'llm', 'large language model', 'gpt', 'chatgpt', 'claude', 'gemini', 'bard',
                    'generative ai', 'transformer', 'diffusion model',
                    'openai', 'anthropic', 'deepmind', 'nvidia ai', 'ai chip', 'gpu computing',
                    'robot', 'robotic', 'robotics', 'autonomous', 'humanoid robot', 'drone technology',
                    'computer vision', 'nlp', 'natural language processing', 'speech recognition',
                    'reinforcement learning', 'supervised learning', 'ai model', 'ai training',
                    'pytorch', 'tensorflow', 'hugging face', 'langchain',
                    'chatbot', 'ai assistant', 'copilot', 'ai safety', 'ai regulation',
                    'prompt engineering', 'fine-tuning', 'embedding', 'vector database',
                    'sentiment analysis', 'recommendation system', 'ai research',
                    'boston dynamics', 'tesla bot', 'warehouse automation', 'self-driving',
                    'ai ethics', 'ai alignment', 'agi'
                ];

                // WEAK signals (general tech that needs strong signal support)
                const weakSignals = ['ai', 'algorithm', 'data science', 'automation'];

                // ROBOTICS EXCEPTION: Be more lenient for robotics category
                if (article.category === 'robotics') {
                    const roboticsKeywords = ['robot', 'bot', 'drone', 'autonomous', 'automation', 'machine', 'boston dynamics', 'figure', 'optimus'];
                    return roboticsKeywords.some(k => text.includes(k));
                }

                // MARKET EXCEPTION: Be more lenient for market/finance category
                if (article.category === 'market') {
                    const marketKeywords = ['stock', 'shares', 'ipo', 'funding', 'venture capital', 'acquisition', 'merger', 'revenue', 'earnings', 'nasdaq', 'nyse', 'market cap', 'investor', 'valuation'];
                    // Must have at least one market keyword AND at least one tech/AI keyword (weak or strong)
                    const hasMarket = marketKeywords.some(k => text.includes(k));
                    const hasTech = ['tech', 'technology', 'software', 'hardware', 'chip', 'semiconductor', 'data', 'digital', 'cyber', ...strongSignals, ...weakSignals].some(k => text.includes(k));
                    if (hasMarket && hasTech) return true;
                }

                // CODE/DEV EXCEPTION: Be more lenient for code/tools category
                if (article.category === 'code' || article.category === 'tools') {
                    const devKeywords = ['github', 'open source', 'repository', 'framework', 'library', 'api', 'sdk', 'python', 'javascript', 'typescript', 'rust', 'react', 'next.js', 'docker', 'kubernetes', 'linux', 'developer'];
                    if (devKeywords.some(k => text.includes(k))) return true;
                }

                const strongMatches = strongSignals.filter(signal => text.includes(signal)).length;
                const weakMatches = weakSignals.filter(signal => text.includes(signal)).length;

                // DECISION LOGIC:
                // - Need at least 2 strong signals OR
                // - 1 strong signal + company name OR
                // - Specific AI companies even with weak signals
                // - OR if it's explicitly categorized as 'robotics', 'market', or 'code' (handled above)

                const aiCompanies = ['nvidia', 'openai', 'anthropic', 'deepmind', 'microsoft ai', 'google ai', 'meta ai'];
                const hasAICompany = aiCompanies.some(company => text.includes(company));

                const isRelevant = (strongMatches >= 2) || (strongMatches >= 1 && hasAICompany) || (weakMatches > 0 && hasAICompany);

                if (!isRelevant) {
                    // console.log(`🚫 FILTERED OUT (weak signal): "${article.title}"`);
                }

                return isRelevant;
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

        if (category !== 'All') {
            const targetCategory = category.toLowerCase();
            filteredArticles = articlesCache.filter(a => a.category === targetCategory);
            console.log(`Filtering for category '${targetCategory}': found ${filteredArticles.length} articles`);
        }

        const articles = filteredArticles.slice(0, limit);

        return NextResponse.json({
            articles,
            count: articles.length,
            cached: !shouldRefresh,
            lastUpdate: new Date(lastFetchTime).toISOString()
        });
    } catch (error: any) {
        console.error('Feed API Error:', error);
        return NextResponse.json({
            articles: [],
            error: error.message
        }, { status: 500 });
    }
}
