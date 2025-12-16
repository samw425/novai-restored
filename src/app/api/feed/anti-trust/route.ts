// @ts-nocheck
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS } from '@/config/rss-feeds';
export const runtime = 'nodejs';


export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour for fresh court docket updates

const parser = new Parser();

// Strong signals: If any of these appear, it's almost certainly relevant
const STRONG_KEYWORDS = [
    'antitrust', 'monopoly', 'monopolistic', 'cartel', 'collusion',
    'ftc', 'lina khan', 'jonathan kanter', 'vestager', 'doj lawsuit',
    'breakup', 'divestiture', 'sherman act', 'clayton act',
    'dma', 'digital markets act', 'dsa', 'digital services act',
    'gatekeeper', 'self-preferencing', 'sideloading', 'app store tax',
    'google trial', 'us v google', 'ftc v amazon', 'ftc v meta',
    'cma', 'competition and markets authority', 'ec commission',
    'regulatory crackdown', 'market power', 'anti-competitive'
];

// Weak signals: These need to be paired with a company name or another signal
// REMOVED: 'policy', 'compliance', 'court', 'ruling' (too broad)
const WEAK_KEYWORDS = [
    'lawsuit', 'sued', 'investigation', 'probe',
    'regulation', 'regulator', 'ban', 'fine',
    'enforcement', 'congress', 'senate hearing', 'subpoena',
    'acquisition', 'merger', 'blocked', 'injunction',
    'federal trade commission', 'department of justice'
];

// Major Cases / Groundbreaking News Keywords
const MAJOR_CASE_KEYWORDS = [
    'us v google', 'google trial', 'ad tech trial',
    'ftc v amazon', 'amazon monopoly',
    'ftc v meta', 'instagram breakup', 'whatsapp breakup',
    'doj v apple', 'apple monopoly', 'smartphone monopoly',
    'microsoft activision', 'eu dma', 'gatekeeper designation',
    'nvidia subpoena', 'doj nvidia'
];

// Companies to watch (The "Kill Zone" targets)
const WATCHLIST_COMPANIES = [
    'google', 'alphabet', 'apple', 'meta', 'facebook', 'amazon', 'microsoft',
    'nvidia', 'openai', 'tiktok', 'bytedance', 'qualcomm', 'broadcom'
];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const onlyMajor = searchParams.get('major') === 'true';

        // Select relevant feeds - PRIORITIZE antitrust category first, then others
        const antitrustFeeds = RSS_FEEDS.filter(f => f.category === 'antitrust');
        const otherRelevantFeeds = RSS_FEEDS.filter(f =>
            ['market', 'policy', 'us-intel', 'ai'].includes(f.category) && f.priority >= 9
        ).slice(0, 15);

        // Combine: all antitrust feeds + top priority from other categories
        const prioritizedFeeds = [...antitrustFeeds, ...otherRelevantFeeds];

        const feedPromises = prioritizedFeeds.map(async (feedSource) => {
            try {
                const feed = await parser.parseURL(feedSource.url);
                return feed.items
                    .map((item: any) => {
                        const text = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();

                        // 1. Check for Strong Keywords (Automatic Pass)
                        const hasStrong = STRONG_KEYWORDS.some(k => text.includes(k));

                        // 2. Check for Weak Keyword + Watchlist Company (Contextual Pass)
                        const hasWeak = WEAK_KEYWORDS.some(k => text.includes(k));
                        const hasCompany = WATCHLIST_COMPANIES.some(c => text.includes(c));

                        const isRelevant = hasStrong || (hasWeak && hasCompany);

                        // 3. Check for Major Case
                        const isMajor = MAJOR_CASE_KEYWORDS.some(k => text.includes(k)) || (hasStrong && hasCompany);

                        return {
                            item,
                            isRelevant,
                            isMajor
                        };
                    })
                    .filter(({ isRelevant, isMajor }: any) => {
                        if (onlyMajor) return isMajor;
                        return isRelevant;
                    })
                    .map(({ item, isMajor }) => ({
                        id: item.guid || item.link || Math.random().toString(),
                        title: item.title,
                        description: item.contentSnippet || item.content,
                        url: item.link,
                        source: feedSource.name,
                        publishedAt: item.pubDate,
                        category: 'antitrust',
                        image_url: null,
                        score: isMajor ? 10 : 8, // Higher score for major cases
                        isMajor // Pass this flag to frontend
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
