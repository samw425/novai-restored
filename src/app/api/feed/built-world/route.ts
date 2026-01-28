import { NextResponse } from 'next/server';
import { parseRSS } from '@/lib/rss-edge';
import { RSS_FEEDS } from '@/config/rss-feeds';
export const runtime = 'edge';

// Keywords to categorize content
const COMMERCIAL_KEYWORDS = ['data center', 'datacenter', 'hyperscale', 'server', 'grid', 'power', 'energy', 'infrastructure', 'commercial', 'office', 'industrial', 'logistics', 'warehouse', 'nvidia', 'gpu'];
const RESIDENTIAL_KEYWORDS = ['residential', 'home', 'housing', 'apartment', 'smart city', 'smart home', 'proptech', 'living', 'urban', 'tenant', 'rent', 'mortgage'];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all'; // 'all', 'commercial', 'residential'

        const builtWorldFeeds = RSS_FEEDS.filter(f => f.category === 'built-world');
        const feedPromises = builtWorldFeeds.map(async (feedSource) => {
            try {
                const feed = await parseRSS(feedSource.url);
                return feed.items.map((item) => ({
                    id: item.id || item.link,
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    source: feedSource.name,
                    category: feedSource.category,
                    snippet: item.contentSnippet || item.description,
                    // Auto-tagging based on keywords
                    subCategory: determineSubCategory(item.title + ' ' + (item.contentSnippet || item.description || ''))
                }));
            } catch (error) {
                console.error(`Error fetching ${feedSource.name}:`, error);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        let articles = results.flat().sort((a, b) =>
            new Date(b.pubDate || '').getTime() - new Date(a.pubDate || '').getTime()
        );

        // Filter by type if requested
        if (type !== 'all') {
            articles = articles.filter(article => article.subCategory === type);
        }

        return NextResponse.json({ articles });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch built world feed' }, { status: 500 });
    }
}

function determineSubCategory(text: string): 'commercial' | 'residential' | 'general' {
    const lowerText = text.toLowerCase();

    // Check Commercial keywords first (Data Centers are priority)
    if (COMMERCIAL_KEYWORDS.some(k => lowerText.includes(k))) {
        return 'commercial';
    }

    // Check Residential keywords
    if (RESIDENTIAL_KEYWORDS.some(k => lowerText.includes(k))) {
        return 'residential';
    }

    // Default to commercial if ambiguous, as it's the primary "AI Infrastructure" angle
    return 'commercial';
}
