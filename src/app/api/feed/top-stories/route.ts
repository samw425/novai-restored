import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS } from '@/config/rss-feeds';

const parser = new Parser({
    timeout: 15000, // Longer timeout for deep fetch
    customFields: {
        item: ['pubDate', 'content:encoded', 'description']
    }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const limit = parseInt(searchParams.get('limit') || '24');
    const category = searchParams.get('category') || 'All';

    try {
        console.log('Fetching TOP STORIES (Deep History)...');

        // 1. Filter sources based on category (if provided)
        let feedsToFetch = RSS_FEEDS;
        if (category !== 'All') {
            feedsToFetch = RSS_FEEDS.filter(f => f.category === category.toLowerCase());
        }

        // 2. Fetch DEEPER history (20 items per source instead of 3)
        const feedPromises = feedsToFetch.map(async (source) => {
            try {
                const feed = await parser.parseURL(source.url);
                // Fetch up to 50 items to ensure we catch high-priority older items
                return feed.items.slice(0, 50).map((item, index) => ({
                    id: `${source.id}-${index}-${item.guid || item.link}`,
                    source: source.name,
                    title: item.title || 'Untitled',
                    summary: cleanText(item.contentSnippet || item.description || ''),
                    description: cleanText(item.contentSnippet || item.description || ''),
                    publishedAt: item.pubDate || new Date().toISOString(),
                    category: source.category.toLowerCase(),
                    importanceScore: source.priority * 10, // Base score from source priority
                    url: item.link || '#',
                    relatedLinks: []
                }));
            } catch (error) {
                // console.error(`Failed to fetch ${source.name}:`, error);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        let allArticles = results.flat();

        // 3. Time Window Filter (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        allArticles = allArticles.filter(article => {
            const pubDate = new Date(article.publishedAt);
            return pubDate >= thirtyDaysAgo;
        });

        // 4. AI Relevance Filter (Re-use logic from live route if possible, or simplified version here)
        // For Top Stories, we rely heavily on the Source Priority, but we still want to filter noise.
        const spamKeywords = ['black friday', 'deal', 'sale', 'coupon'];
        allArticles = allArticles.filter(article => {
            const text = (article.title + ' ' + article.summary).toLowerCase();
            return !spamKeywords.some(k => text.includes(k));
        });

        // 5. Ranking Logic
        // Score = Source Priority + Recency Boost + Keyword Boost
        allArticles = allArticles.map(article => {
            let score = article.importanceScore;

            // Keyword Boost
            // Keyword Boost - HEAVY weight for AI terms to meet user requirement
            const text = (article.title + ' ' + article.summary).toLowerCase();
            if (text.includes('openai') || text.includes('gpt') || text.includes('gemini') || text.includes('claude') || text.includes('llama') || text.includes('anthropic') || text.includes('mistral')) score += 50;
            if (text.includes('artificial intelligence') || text.includes(' ai ') || text.includes('llm') || text.includes('neural network')) score += 40;
            if (text.includes('breakthrough') || text.includes('state of the art') || text.includes('sota')) score += 25;
            if (text.includes('nvidia') || text.includes('h100') || text.includes('gpu')) score += 30;

            // Recency Penalty (slight, to allow older important stories to surface)
            // We don't want to penalize too much, otherwise it just becomes a "latest news" feed again.

            return { ...article, finalScore: score };
        });

        // 6. Sort by Final Score
        allArticles.sort((a, b) => (b as any).finalScore - (a as any).finalScore);

        // 7. Deduplicate & DIVERSITY FILTER (Max 3 per source)
        const seenTitles = new Set();
        const sourceCounts: Record<string, number> = {};

        allArticles = allArticles.filter(a => {
            // Deduplicate by title
            if (seenTitles.has(a.title)) return false;

            // Diversity Check: Max 3 articles per source
            const currentSourceCount = sourceCounts[a.source] || 0;
            if (currentSourceCount >= 3) return false;

            seenTitles.add(a.title);
            sourceCounts[a.source] = currentSourceCount + 1;
            return true;
        });

        const articles = allArticles.slice(0, limit);

        return NextResponse.json({
            articles,
            count: articles.length,
            cached: false // Always fresh for now, can add caching later
        });

    } catch (error: any) {
        console.error('Top Stories API Error:', error);
        return NextResponse.json({ articles: [], error: error.message }, { status: 500 });
    }
}
