import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS } from '@/config/rss-feeds';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const agency = searchParams.get('agency'); // 'CIA', 'FBI', 'ALL', etc.
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log(`[US-INTEL] Fetching feed for agency: ${agency}`);

    // Map agency acronyms to feed IDs or categories
    let targetFeeds: typeof RSS_FEEDS = [];

    if (!agency || agency === 'ALL') {
        targetFeeds = RSS_FEEDS.filter(f => f.category === 'us-intel');
    } else {
        // Map acronyms to specific feed IDs
        const agencyMap: Record<string, string> = {
            'CIA': 'cia-news',
            'FBI': 'fbi-news',
            'NSA': 'nsa-news',
            'DOD': 'dod-news',
            'DOS': 'state-dept', // State Dept
            'State Dept': 'state-dept',
            'USDT': 'treasury-news', // Treasury
            'Treasury': 'treasury-news',
            'DHS': 'dhs-news'
        };

        const feedId = agencyMap[agency];
        if (feedId) {
            targetFeeds = RSS_FEEDS.filter(f => f.id === feedId);
        }
    }

    console.log(`[US-INTEL] Target feeds: ${targetFeeds.map(f => f.id).join(', ')}`);

    if (targetFeeds.length === 0) {
        console.log('[US-INTEL] No target feeds found');
        return NextResponse.json({ items: [] });
    }

    try {
        const feedPromises = targetFeeds.map(async (feed) => {
            try {
                console.log(`[US-INTEL] Fetching ${feed.url}...`);
                const feedData = await parser.parseURL(feed.url);
                console.log(`[US-INTEL] Successfully fetched ${feed.url} (${feedData.items.length} items)`);
                return feedData.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate || new Date().toISOString(),
                    contentSnippet: item.contentSnippet || item.content,
                    source: feed.name.replace(' News', '').replace('Dept', ''), // Clean up name
                    agency: feed.name,
                    guid: item.guid || item.link
                }));
            } catch (err) {
                console.error(`[US-INTEL] Failed to parse feed ${feed.url}:`, err);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        const allItems = results.flat();

        // Sort by date (newest first)
        allItems.sort((a, b) => {
            const dateA = new Date(a.pubDate || 0).getTime();
            const dateB = new Date(b.pubDate || 0).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({
            items: allItems.slice(0, limit),
            hasMore: allItems.length > limit
        });

    } catch (error) {
        console.error('Feed fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
    }
}
