import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, FeedSource } from '@/config/rss-feeds';

const parser = new Parser();

// Cache configuration
let cachedArticles: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Helper to clean text
const cleanText = (text: string) => {
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200); // Truncate
};

export async function GET() {
    try {
        const now = Date.now();
        if (cachedArticles.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
            return NextResponse.json({
                articles: cachedArticles,
                cached: true,
                timestamp: new Date().toISOString()
            });
        }

        // 1. Fetch RSS Feeds (Security Category)
        const securityFeeds = RSS_FEEDS.filter(f => f.category === 'security');

        const rssPromises = securityFeeds.map(async (source) => {
            try {
                const feed = await parser.parseURL(source.url);
                return feed.items.map(item => ({
                    id: item.guid || item.link || Math.random().toString(36).substr(2, 9),
                    source: source.name,
                    title: item.title || 'Untitled',
                    summary: cleanText(item.contentSnippet || item.description || ''),
                    description: cleanText(item.contentSnippet || item.description || ''),
                    publishedAt: item.pubDate || new Date().toISOString(),
                    category: 'security',
                    topicSlug: 'cybersecurity',
                    importanceScore: source.priority * 10,
                    url: item.link || '',
                }));
            } catch (error) {
                console.error(`Failed to fetch ${source.name}`);
                return [];
            }
        });

        // 2. Fetch Hacker News (Algolia)
        const hnPromise = (async () => {
            try {
                // Query for security, AI, and hacking topics
                const response = await fetch(
                    'https://hn.algolia.com/api/v1/search_by_date?query=security%20OR%20hacking%20OR%20cyber%20OR%20exploit%20OR%20vulnerability%20OR%20AI&tags=story&hitsPerPage=30'
                );
                const data = await response.json();

                // Filter for last 24 hours
                const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
                const recentHits = data.hits.filter((hit: any) => {
                    const createdAt = new Date(hit.created_at).getTime();
                    return createdAt >= twentyFourHoursAgo;
                });

                return recentHits.map((hit: any) => ({
                    id: hit.objectID,
                    source: 'HACKER NEWS',
                    title: hit.title || 'No title',
                    summary: hit.story_text || `Discussion on Hacker News · ${hit.num_comments || 0} comments`,
                    description: hit.story_text || `Discussion on Hacker News · ${hit.num_comments || 0} comments`,
                    publishedAt: hit.created_at,
                    category: 'security',
                    topicSlug: 'hacker-news',
                    importanceScore: 85 + (hit.points || 0), // Higher points = higher importance
                    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                }));
            } catch (error) {
                console.error('Failed to fetch Hacker News');
                return [];
            }
        })();

        const [rssResults, hnResults] = await Promise.all([
            Promise.all(rssPromises),
            hnPromise
        ]);

        const allArticles = [
            ...rssResults.flat(),
            ...hnResults
        ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        // Update cache
        cachedArticles = allArticles;
        lastFetchTime = now;

        return NextResponse.json({
            articles: allArticles,
            cached: false,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Feed Error:', error);
        return NextResponse.json({ error: 'Failed to fetch hacker feed' }, { status: 500 });
    }
}
