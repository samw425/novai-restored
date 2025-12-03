import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
});

const AGENCY_FEEDS: Record<string, string[]> = {
    CIA: ['https://www.cia.gov/index.xml', 'https://www.cia.gov/news-information/your-news/cia-news-rss'],
    FBI: ['https://www.fbi.gov/feeds/national-press-releases', 'https://www.fbi.gov/feeds/breaking-news'],
    NSA: ['https://www.nsa.gov/rss/'],
    DOD: ['https://www.defense.gov/DesktopModules/ArticleCS/RSS.aspx?ContentType=1&Site=945&max=10'],
    'State Dept': ['https://www.state.gov/feed/'],
    'White House': ['https://www.whitehouse.gov/feed/'],
    Treasury: ['https://home.treasury.gov/rss/press-releases'],
    DHS: ['http://feeds.feedburner.com/dhs/zOAi?format=xml'],
};

// Mock data for fallback
const MOCK_INTEL_ITEMS = [
    {
        title: "CIA Director Briefs Congress on Global Threats",
        link: "https://www.cia.gov/briefings/2024",
        pubDate: new Date().toISOString(),
        contentSnippet: "Comprehensive assessment of current global security challenges.",
        source: "CIA",
        agency: "CIA",
        novai_analysis: "Strategic overview of emerging threats in cyberspace and AI domains."
    },
    {
        title: "FBI Disrupts Major Cyber Criminal Network",
        link: "https://www.fbi.gov/news/2024",
        pubDate: new Date(Date.now() - 3600000).toISOString(),
        contentSnippet: "International taskforce successfully dismantles ransomware operation.",
        source: "FBI",
        agency: "FBI"
    },
    {
        title: "NSA Advances Quantum-Resistant Cryptography Standards",
        link: "https://www.nsa.gov/press-releases/2024",
        pubDate: new Date(Date.now() - 7200000).toISOString(),
        contentSnippet: "New encryption protocols designed for post-quantum era.",
        source: "NSA",
        agency: "NSA",
        novai_analysis: "CRITICAL: Major milestone in securing communications against quantum threats."
    },
    {
        title: "DHS Issues Advisory on Critical Infrastructure Security",
        link: "https://www.dhs.gov/news/2024",
        pubDate: new Date(Date.now() - 10800000).toISOString(),
        contentSnippet: "New guidelines for protecting power grids and water systems from cyberattacks.",
        source: "DHS",
        agency: "DHS"
    }
];

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const agency = searchParams.get('agency') || 'ALL';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '15');

        let targetUrls: string[] = [];

        if (agency === 'ALL') {
            Object.values(AGENCY_FEEDS).forEach(urls => targetUrls.push(...urls));
        } else if (AGENCY_FEEDS[agency]) {
            targetUrls = AGENCY_FEEDS[agency];
        }

        console.log(`Fetching feeds for agency: ${agency}, URLs: ${targetUrls.length}`);

        const feedPromises = targetUrls.map(async (url) => {
            try {
                // Add 5s timeout to fetch
                const feedPromise = parser.parseURL(url);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                );

                const feed: any = await Promise.race([feedPromise, timeoutPromise]);

                // Determine agency name from URL or feed title
                let agencyName = 'Unknown';
                if (url.includes('cia.gov')) agencyName = 'CIA';
                else if (url.includes('fbi.gov')) agencyName = 'FBI';
                else if (url.includes('nsa.gov')) agencyName = 'NSA';
                else if (url.includes('defense.gov')) agencyName = 'DOD';
                else if (url.includes('state.gov')) agencyName = 'State Dept';
                else if (url.includes('whitehouse.gov')) agencyName = 'White House';
                else if (url.includes('treasury.gov')) agencyName = 'Treasury';
                else if (url.includes('dhs') || url.includes('homeland')) agencyName = 'DHS';

                return feed.items.map((item: any) => ({
                    title: item.title || 'Untitled',
                    link: item.link || '#',
                    pubDate: item.pubDate || new Date().toISOString(),
                    contentSnippet: item.contentSnippet || item.content || '',
                    source: agencyName,
                    agency: agencyName,
                    novai_analysis: null // Real feeds don't have this, we could add it via AI later
                }));
            } catch (e) {
                console.error(`Failed to parse RSS: ${url}`, e);
                return [];
            }
        });

        const results = await Promise.all(feedPromises);
        let allItems = results.flat();

        // If no items found (e.g. all feeds failed), use mock data
        if (allItems.length === 0) {
            console.warn("No items fetched from real feeds, using mock data fallback.");
            allItems = agency === 'ALL'
                ? MOCK_INTEL_ITEMS
                : MOCK_INTEL_ITEMS.filter(item => item.agency === agency);
        }

        // Sort by date
        allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = allItems.slice(startIndex, endIndex);
        const hasMore = endIndex < allItems.length;

        return NextResponse.json({
            items: paginatedItems,
            hasMore,
            total: allItems.length,
            page,
            limit
        });
    } catch (error) {
        console.error('Error in US Intel feed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch intelligence feed' },
            { status: 500 }
        );
    }
}
