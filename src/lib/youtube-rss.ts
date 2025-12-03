import { VideoItem } from './data/video-feed';

const CHANNELS = [
    { id: 'UCvJJ_dzjViJCoLf5uKUTwoA', name: 'OpenAI' },
    { id: 'UCrGi_PLnb2Ulc7CCnBGHveA', name: 'Anthropic' },
    { id: 'UCd6MoB9NC6uYN2grvUNT-Zg', name: 'Google DeepMind' },
    { id: 'UCOkL8lyxOr9k7-6gCpGTyeQ', name: 'NVIDIA' },
    { id: 'UC0rqucBdTuFTjJ6Wzn059hA', name: 'Wes Roth' }, // Daily AI News
    { id: 'UCfJ5rVv21yE8M9M_8M9oaaA', name: 'Matt Wolfe' }, // AI News
    { id: 'UC5AQEUAwCh1sGDvkQtx8Abw', name: 'AI Explained' }, // Deep Analysis
    { id: 'UC9x0AN7BWHpCDHSm9NiJFHg', name: 'David Shapiro' }, // Analysis
    { id: 'UCtXKDgv1AVoG88PLl8nGXmw', name: 'SpaceX' },
    { id: 'UC5iQ4m25f7F20fJ55h23h2A', name: 'Boston Dynamics' },
    { id: 'UC0e3QhIYukixgh5VL3b2BQA', name: 'Tesla' },
    { id: 'UC7f5bVxWsm3jlZIPDzOMtAg', name: 'Two Minute Papers' },
    { id: 'UC2D2CMWXMOVWx7giW1n3LIg', name: 'Andrew Ng' },
];

export async function fetchYouTubeRSS(): Promise<VideoItem[]> {
    const allVideos: VideoItem[] = [];

    const fetchPromises = CHANNELS.map(async (channel) => {
        try {
            const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`, { next: { revalidate: 300 } }); // Cache for 5 mins
            if (!response.ok) return [];
            const xmlText = await response.text();

            // Simple XML parsing using regex to avoid heavy dependencies
            // Note: This is brittle but works for standard YouTube RSS structure
            const entries = xmlText.split('<entry>').slice(1);

            return entries.map(entry => {
                const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
                const titleMatch = entry.match(/<title>(.*?)<\/title>/);
                const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
                const viewsMatch = entry.match(/<media:statistics views="(\d+)"/); // RSS might not have views, usually doesn't

                const id = idMatch ? idMatch[1] : '';
                const title = titleMatch ? titleMatch[1] : 'Unknown Title';
                const publishedAt = publishedMatch ? publishedMatch[1] : new Date().toISOString();

                if (!id) return null;

                // Determine category based on channel or title keywords
                let category: VideoItem['category'] = 'Analysis';
                if (channel.name === 'OpenAI' || channel.name === 'Google DeepMind' || channel.name === 'Anthropic') category = 'Launch';
                if (title.toLowerCase().includes('demo') || title.toLowerCase().includes('hands-on')) category = 'Demo';
                if (title.toLowerCase().includes('interview') || title.toLowerCase().includes('podcast')) category = 'Interview';
                if (channel.name === 'SpaceX' || title.toLowerCase().includes('live')) category = 'Live';

                return {
                    id,
                    title,
                    description: `Latest from ${channel.name}`, // RSS doesn't give full description usually
                    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                    videoUrl: `https://www.youtube.com/watch?v=${id}`,
                    source: channel.name,
                    publishedAt: new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    duration: '10:00', // RSS doesn't provide duration, default placeholder
                    views: 'New', // RSS doesn't provide views
                    category,
                    aiScore: 85 + Math.floor(Math.random() * 10), // Simulated score for fresh content
                    timestamp: new Date(publishedAt).getTime()
                };
            }).filter(Boolean) as VideoItem[];

        } catch (error) {
            console.error(`Failed to fetch RSS for ${channel.name}`, error);
            return [];
        }
    });

    const results = await Promise.all(fetchPromises);
    results.forEach(videos => allVideos.push(...videos));

    // Sort by newest first
    return allVideos.sort((a, b) => b.timestamp - a.timestamp);
}
