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

import { RSS_FEEDS } from '@/config/rss-feeds';

export async function fetchRoboticsFeed(): Promise<RoboticsItem[]> {
    const items: RoboticsItem[] = [];

    // 1. Fetch News from Central Config (Category: 'robotics')
    const roboticsFeeds = RSS_FEEDS.filter(f => f.category === 'robotics');

    const newsPromises = roboticsFeeds.map(async (feedSource) => {
        try {
            const feed = await parser.parseURL(feedSource.url);
            feed.items.forEach(item => {
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
            // console.error(`Failed to fetch robotics news from ${feedSource.name}`, e);
        }
    });

    // 2. Fetch Videos (Keep existing video logic or integrate if RSS_FEEDS supports video)
    // For now, we keep the hardcoded video feeds as they are specific YouTube channels not yet in RSS_FEEDS
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
                        thumbnail: `https://img.youtube.com/vi/${item.id.replace('yt:video:', '')}/mqdefault.jpg`
                    });
                }
            });
        } catch (e) {
            // console.error(`Failed to fetch video feed ${feedSource.name}`, e);
        }
    });

    await Promise.all([...newsPromises, ...videoPromises]);

    // 3. DIVERSITY FILTER: Max 3 per source
    const sourceCounts: Record<string, number> = {};
    const filteredItems = items.filter(item => {
        const count = sourceCounts[item.source] || 0;
        if (count >= 3) return false;
        sourceCounts[item.source] = count + 1;
        return true;
    });

    // Sort by date descending
    return filteredItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
