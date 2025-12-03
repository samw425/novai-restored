import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS } from '@/config/rss-feeds';

const parser = new Parser();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const agency = searchParams.get('agency'); // 'CIA', 'FBI', 'ALL', etc.
    const limit = parseInt(searchParams.get('limit') || '20');

    // Map agency acronyms to feed IDs or categories
    let targetFeeds = [];

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

    if (targetFeeds.length === 0) {
        return NextResponse.json({ items: [] });
    }

    try {
        const feedPromises = targetFeeds.map(async (feed) => {
            try {
                const feedData = await parser.parseURL(feed.url);
                return feedData.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    contentSnippet: item.contentSnippet || item.content,
                    source: feed.name.replace(' News', '').replace('Dept', ''), // Clean up name
                    agency: feed.name,
                    guid: item.guid || item.link
                }));
            } catch (err) {
                console.error(`Failed to parse feed ${feed.url}:`, err);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        const allItems = results.flat();

        // Sort by date (newest first)
        allItems.sort((a, b) => {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
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
