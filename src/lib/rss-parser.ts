import Parser from 'rss-parser';
import { RSS_FEEDS, FeedSource } from '@/config/rss-feeds';

const parser = new Parser({
    customFields: {
        item: ['pubDate', 'content:encoded']
    }
});

export interface RSSArticle {
    title: string;
    link: string;
    pubDate: string;
    content?: string;
    contentSnippet?: string;
    creator?: string;
    categories?: string[];
}

/**
 * Fetch and parse RSS feed from a single source
 */
export async function fetchRSSFeed(feedUrl: string): Promise<RSSArticle[]> {
    try {
        const feed = await parser.parseURL(feedUrl);

        return feed.items.map(item => ({
            title: item.title || 'Untitled',
            link: item.link || '',
            pubDate: item.pubDate || new Date().toISOString(),
            content: item['content:encoded'] || item.content,
            contentSnippet: item.contentSnippet,
            creator: item.creator,
            categories: item.categories
        }));
    } catch (error) {
        console.error(`Error fetching RSS feed ${feedUrl}:`, error);
        return [];
    }
}

/**
 * Fetch articles from all configured RSS feeds
 */
export async function fetchAllFeeds(): Promise<Map<string, RSSArticle[]>> {
    const feedMap = new Map<string, RSSArticle[]>();

    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
        RSS_FEEDS.map(async (source: FeedSource) => {
            const articles = await fetchRSSFeed(source.url);
            return { sourceId: source.id, articles };
        })
    );

    // Collect successful results
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            feedMap.set(result.value.sourceId, result.value.articles);
        } else {
            console.error(`Failed to fetch feed ${RSS_FEEDS[index].name}:`, result.reason);
        }
    });

    return feedMap;
}

/**
 * Categorize article using keyword matching + AI (future)
 */
export function categorizeArticle(
    title: string,
    content: string,
    feedCategory: string
): { category: string; confidence: number } {

    // Start with feed's default category
    let category = feedCategory;
    let confidence = 0.7; // Default confidence from feed category

    const text = `${title} ${content}`.toLowerCase();

    // Keyword-based classification (high confidence)
    const keywordMap: Record<string, { keywords: string[]; priority: number }> = {
        'robotics': { keywords: ['robot', 'robotics', 'humanoid', 'autonomous', 'manipulation', 'optimus', 'atlas', 'figure'], priority: 9 },
        'research': { keywords: ['paper', 'research', 'study', 'arxiv', 'model', 'architecture', 'benchmark', 'algorithm'], priority: 8 },
        'policy': { keywords: ['regulation', 'policy', 'law', 'government', 'eu ai act', 'compliance', 'ethics', 'safety'], priority: 8 },
        'market': { keywords: ['funding', 'investment', 'valuation', 'ipo', 'acquisition', 'venture capital', 'stock'], priority: 7 },
        'tools': { keywords: ['api', 'library', 'framework', 'sdk', 'open source', 'github', 'release'], priority: 7 },
        'risk': { keywords: ['security', 'vulnerability', 'threat', 'attack', 'breach', 'deepfake', 'misinformation'], priority: 9 }
    };

    // Check for keyword matches
    for (const [cat, { keywords, priority }] of Object.entries(keywordMap)) {
        const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
        if (matchCount > 0) {
            category = cat;
            confidence = Math.min(0.95, 0.6 + (matchCount * 0.1));
            break;
        }
    }

    return { category, confidence };
}

/**
 * Calculate importance score for an article
 */
export function calculateImportanceScore(
    source: FeedSource,
    article: RSSArticle
): number {
    let score = source.priority * 10; // Base score from source priority (10-100)

    // Boost for recency (last 24 hours)
    const publishedAt = new Date(article.pubDate);
    const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
    if (hoursOld < 24) {
        score += 20;
    } else if (hoursOld < 48) {
        score += 10;
    }

    // Boost for certain keywords
    const title = article.title.toLowerCase();
    if (title.includes('breakthrough') || title.includes('announce')) {
        score += 15;
    }
    if (title.includes('gpt') || title.includes('claude') || title.includes('gemini')) {
        score += 10;
    }

    // Cap at 100
    return Math.min(100, score);
}
