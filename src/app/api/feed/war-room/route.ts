
// @ts-nocheck
import { NextResponse } from 'next/server';
import { getWarRoomData } from '@/lib/osint';
// @ts-ignore
// Using the minified version of rss-parser for edge runtime compatibility
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { RSS_FEEDS } from '@/config/rss-feeds';
// export const runtime = 'edge';


export const dynamic = 'force-dynamic';

const parser = new Parser();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const category = searchParams.get('category');

        // If category is present, fetch specific RSS feeds (Current Wars Tab)
        if (category) {
            let targetFeeds = RSS_FEEDS.filter(f => f.category === 'current-wars');

            // Sub-filtering for specific conflicts
            if (category === 'israel-gaza') {
                targetFeeds = targetFeeds.filter(f => f.id === 'jpost-war' || f.id === 'times-israel' || f.id === 'aljazeera-war');
            } else if (category === 'russia-ukraine') {
                targetFeeds = targetFeeds.filter(f => f.id === 'kyiv-independent' || f.id === 'bbc-europe');
            }

            const feedPromises = targetFeeds.map(async (feedSource) => {
                try {
                    const feed = await parser.parseURL(feedSource.url);
                    return feed.items.map((item: any) => ({
                        id: item.guid || item.link || Math.random().toString(),
                        title: item.title,
                        description: item.contentSnippet || item.content,
                        url: item.link,
                        source: feedSource.name,
                        publishedAt: item.pubDate,
                        category: 'conflict',
                        image_url: null,
                        score: 10 // High priority for war room
                    }));
                } catch (e) {
                    console.error(`Failed to fetch feed ${feedSource.name}: `, e);
                    return [];
                }
            });

            const results = await Promise.all(feedPromises);
            const allItems = results.flat().sort((a, b) =>
                new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
            );

            // Pagination for feed items
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedItems = allItems.slice(startIndex, endIndex);

            return NextResponse.json({
                items: paginatedItems, // Return as 'items' for standard feed consumption
                total: allItems.length,
                page,
                totalPages: Math.ceil(allItems.length / limit)
            });
        }

        // Default: Fetch War Room OSINT Data (Map & Main Feed)
        const incidents = await getWarRoomData();

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedIncidents = incidents.slice(startIndex, endIndex);

        return NextResponse.json({
            incidents: paginatedIncidents,
            total: incidents.length,
            page,
            totalPages: Math.ceil(incidents.length / limit)
        });
    } catch (error) {
        console.error('War Room API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch War Room data' },
            { status: 500 }
        );
    }
}
