import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS } from '@/config/rss-feeds';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const parser = new Parser();

// Keywords to filter for antitrust content
const ANTITRUST_KEYWORDS = [
    'antitrust', 'monopoly', 'doj', 'ftc', 'lina khan', 'vestager',
    'breakup', 'regulation', 'lawsuit', 'investigation', 'compliance',
    'dma', 'dsa', 'gdpr', 'competition market authority', 'cma',
    'google trial', 'apple app store', 'meta lawsuit', 'amazon antitrust',
    'regulator', 'probe', 'eu commission', 'ban', 'fine', 'court', 'legal',
    'policy', 'enforcement', 'congress', 'senate', 'executive order',
    'sovereignty', 'national security', 'export control', 'chips act'
];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Select relevant feeds (Market, Policy, US Intel)
        const targetFeeds = RSS_FEEDS.filter(f =>
            ['market', 'policy', 'us-intel', 'ai'].includes(f.category)
        );

        // We'll fetch a subset of high-priority feeds to avoid timeouts
        // Prioritize: Reuters, Bloomberg, WSJ, FT, Verge, Wired, Stratechery, 404 Media
        const prioritizedFeeds = targetFeeds.filter(f =>
            f.id.includes('reuters') ||
            f.id.includes('bloomberg') ||
            f.id.includes('wsj') ||
            f.id.includes('ft') ||
            f.id.includes('verge') ||
            f.id.includes('wired') ||
            f.id.includes('stratechery') ||
            f.id.includes('404') ||
            f.id.includes('nytimes') ||
            f.id.includes('washington-post') ||
            f.priority >= 9
        ).slice(0, 15); // Limit to 15 feeds to keep it fast

        const feedPromises = prioritizedFeeds.map(async (feedSource) => {
            try {
                const feed = await parser.parseURL(feedSource.url);
                return feed.items
                    .filter(item => {
                        const text = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();
                        return ANTITRUST_KEYWORDS.some(keyword => text.includes(keyword));
                    })
                    .map(item => ({
                        id: item.guid || item.link || Math.random().toString(),
                        title: item.title,
                        description: item.contentSnippet || item.content,
                        url: item.link,
                        source: feedSource.name,
                        publishedAt: item.pubDate,
                        category: 'antitrust',
                        image_url: null,
                        score: 9 // High relevance
                    }));
            } catch (e) {
                console.error(`Failed to fetch feed ${feedSource.name}:`, e);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        const allItems = results.flat().sort((a, b) =>
            new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
        );

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = allItems.slice(startIndex, endIndex);

        return NextResponse.json({
            items: paginatedItems,
            total: allItems.length,
            page,
            totalPages: Math.ceil(allItems.length / limit)
        });

    } catch (error) {
        console.error('Anti-Trust API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Anti-Trust data' },
            { status: 500 }
        );
    }
}
