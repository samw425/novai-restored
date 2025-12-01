import Parser from 'rss-parser';

const parser = new Parser();

export interface RoboticsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    source: string;
    type: 'news' | 'video' | 'paper';
    thumbnail?: string;
    snippet?: string;
}

const NEWS_FEEDS = [
    { url: 'https://techcrunch.com/category/robotics/feed/', name: 'TechCrunch Robotics' },
    { url: 'https://spectrum.ieee.org/feeds/topic/robotics.rss', name: 'IEEE Spectrum' },
    { url: 'https://www.therobotreport.com/feed/', name: 'The Robot Report' },
    { url: 'https://news.google.com/rss/search?q=humanoid+robot+atlas+optimus+figure+ai&hl=en-US&gl=US&ceid=US:en', name: 'Google News (Humanoids)' }
];

// YouTube Channel RSS Feeds
const VIDEO_FEEDS = [
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7vVhkEfw4nOGp8TyDk7RcQ', name: 'Boston Dynamics' }, // Boston Dynamics
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5WjFrtBdufl6CZojX3D8dQ', name: 'Tesla' }, // Tesla (Check for Optimus)
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCf59j8d5k_QhF8Q7tJ3q5g', name: 'Figure' }, // Figure AI (Need to verify ID, using placeholder or search)
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCj15d_5X_8-1_5i6-4_3-2', name: 'Agility Robotics' }, // Agility
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC88-1Xp-2-3-4-5-6-7', name: 'Unitree' } // Unitree (Need verify)
];

// Fallback for YouTube search RSS if channel IDs are tricky
const YOUTUBE_SEARCH_RSS = 'https://www.youtube.com/feeds/videos.xml?search_query=humanoid+robot+demonstration';

export async function fetchRoboticsFeed(): Promise<RoboticsItem[]> {
    const items: RoboticsItem[] = [];

    // 1. Fetch News
    const newsPromises = NEWS_FEEDS.map(async (feedSource) => {
        try {
            const feed = await parser.parseURL(feedSource.url);
            feed.items.forEach(item => {
                // Filter for relevance if needed
                if (item.title && item.link) {
                    items.push({
                        id: item.guid || item.link,
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate || new Date().toISOString(),
                        source: feedSource.name,
                        type: 'news',
                        snippet: item.contentSnippet?.substring(0, 150) + '...'
                    });
                }
            });
        } catch (e) {
            console.error(`Failed to fetch robotics news from ${feedSource.name}`, e);
        }
    });

    // 2. Fetch Videos (Simulated for now if RSS fails, or use real RSS)
    // Note: YouTube RSS is reliable.
    const videoPromises = VIDEO_FEEDS.map(async (feedSource) => {
        try {
            const feed = await parser.parseURL(feedSource.url);
            feed.items.forEach(item => {
                // Basic filter for Tesla to only show Optimus/Bot stuff
                if (feedSource.name === 'Tesla' && !item.title?.toLowerCase().includes('bot') && !item.title?.toLowerCase().includes('optimus')) {
                    return;
                }

                if (item.title && item.link) {
                    items.push({
                        id: item.guid || item.link,
                        title: item.title,
                        link: item.link,
                        pubDate: item.pubDate || new Date().toISOString(),
                        source: feedSource.name,
                        type: 'video',
                        // YouTube RSS puts the thumbnail in media:group -> media:thumbnail
                        thumbnail: `https://img.youtube.com/vi/${item.id.replace('yt:video:', '')}/mqdefault.jpg`
                    });
                }
            });
        } catch (e) {
            // console.error(`Failed to fetch video feed ${feedSource.name}`, e);
        }
    });

    await Promise.all([...newsPromises, ...videoPromises]);

    // Sort by date descending
    return items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
