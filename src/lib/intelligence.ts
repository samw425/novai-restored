import { compareDesc, parseISO } from 'date-fns';

export interface NewsItem {
    id: string;
    source: string;
    title: string;
    url: string;
    summary: string;
    time: string;
    timestamp: number;
    score: number;
    type: 'news' | 'discussion' | 'tool';
}

// SOURCE 1: Hacker News (via Algolia API)
async function fetchHackerNews(): Promise<NewsItem[]> {
    try {
        const query = 'AI OR LLM OR GPT OR OpenAI OR Claude OR Gemini';
        const res = await fetch(`http://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=10`);
        const data = await res.json();

        return data.hits.map((item: any) => ({
            id: `hn-${item.objectID}`,
            source: 'Hacker News',
            title: item.title,
            url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
            summary: `${item.points} points • ${item.num_comments} comments`,
            time: formatTimeAgo(item.created_at_i * 1000),
            timestamp: item.created_at_i * 1000,
            score: item.points,
            type: 'discussion'
        }));
    } catch (e) {
        console.error('HN Fetch Error', e);
        return [];
    }
}

// SOURCE 2: Reddit (r/ArtificialInteligence)
async function fetchReddit(): Promise<NewsItem[]> {
    try {
        const res = await fetch('https://www.reddit.com/r/ArtificialInteligence/top.json?limit=10&t=day');
        const data = await res.json();

        return data.data.children.map((item: any) => ({
            id: `rd-${item.data.id}`,
            source: `r/${item.data.subreddit}`,
            title: item.data.title,
            url: `https://www.reddit.com${item.data.permalink}`,
            summary: `${item.data.ups} upvotes • ${item.data.num_comments} comments`,
            time: formatTimeAgo(item.data.created_utc * 1000),
            timestamp: item.data.created_utc * 1000,
            score: item.data.ups,
            type: 'discussion'
        }));
    } catch (e) {
        console.error('Reddit Fetch Error', e);
        return [];
    }
}

// Helper: Time Ago
function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// SOURCE 3: RSS Feeds (The Verge, Wired)
async function fetchRSS(): Promise<NewsItem[]> {
    const feeds = [
        { name: 'The Verge', url: 'https://www.theverge.com/rss/ai/index.xml' },
        { name: 'Wired', url: 'https://www.wired.com/feed/tag/ai/latest/rss' }
    ];

    try {
        const promises = feeds.map(async (feed) => {
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
            const data = await res.json();
            if (!data.items) return [];

            return data.items.map((item: any) => ({
                id: `rss-${item.guid}`,
                source: feed.name,
                title: item.title,
                url: item.link,
                summary: item.description ? item.description.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : 'No summary available.',
                time: formatTimeAgo(new Date(item.pubDate).getTime()),
                timestamp: new Date(item.pubDate).getTime(),
                score: 100, // Default high score for editorial content
                type: 'news'
            }));
        });

        const results = await Promise.all(promises);
        return results.flat();
    } catch (e) {
        console.error('RSS Fetch Error', e);
        return [];
    }
}

// MAIN AGGREGATOR
export async function getLiveIntelligence(): Promise<NewsItem[]> {
    const [hn, reddit, rss] = await Promise.all([fetchHackerNews(), fetchReddit(), fetchRSS()]);
    const all = [...hn, ...reddit, ...rss];

    // Sort by score (Impact) and Recency
    // Boost RSS items slightly to ensure mix
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);
}
