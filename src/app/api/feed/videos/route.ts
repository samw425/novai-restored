import { NextResponse } from 'next/server';
import { fetchYouTubeRSS } from '@/lib/youtube-rss';
import { LIVE_VIDEOS } from '@/lib/data/video-feed';

export async function GET() {
    try {
        // Fetch fresh RSS data
        const rssVideos = await fetchYouTubeRSS();

        // Combine with curated Master DB (to ensure we always have high-quality "Launch" videos even if RSS is noisy)
        // We prioritize RSS for "Live Wire" but keep Master DB for "Featured" if needed.
        // For the main feed, we'll merge them, removing duplicates by ID.

        const allVideos = [...rssVideos, ...LIVE_VIDEOS];

        // Deduplicate by ID
        const uniqueVideos = Array.from(new Map(allVideos.map(item => [item.id, item])).values());

        // Sort by timestamp (newest first)
        const sortedVideos = uniqueVideos.sort((a, b) => b.timestamp - a.timestamp);

        return NextResponse.json({ videos: sortedVideos });
    } catch (error) {
        console.error('Video Feed API Error:', error);
        // Fallback to static data if RSS fails
        return NextResponse.json({ videos: LIVE_VIDEOS });
    }
}
