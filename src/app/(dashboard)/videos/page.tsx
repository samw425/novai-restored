import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { VideoFeedContainer } from '@/components/feed/VideoFeedContainer';
import { LIVE_VIDEOS, BRIEF_VIDEOS } from '@/lib/data/video-feed';
import { Youtube } from 'lucide-react';

export const metadata = {
    title: 'Video Intelligence | Novai',
    description: 'Curated high-signal AI videos, demos, and interviews.',
};

export default function VideosPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Video Intelligence"
                description="VISUAL SIGNAL PROCESSING"
                insight="Curated high-signal demonstrations, keynotes, and technical breakdowns from the AI frontier."
                icon={<Youtube className="w-8 h-8 text-red-600" />}
            />

            <VideoFeedContainer
                liveVideos={LIVE_VIDEOS}
                briefVideos={BRIEF_VIDEOS}
            />
        </div>
    );
}
