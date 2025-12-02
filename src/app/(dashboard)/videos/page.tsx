import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { VIDEO_FEED_DATA } from '@/lib/data/video-feed';
import { PlaySquare, Youtube } from 'lucide-react';

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

            <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <PlaySquare size={120} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-black tracking-tight mb-2">30-Day Video Brief</h2>
                    <p className="text-slate-400 mb-6">
                        The most critical visual updates from the last month. If you only watch 5 videos, watch these.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE FEED ACTIVE
                    </div>
                </div>
            </div>

            <VideoFeed videos={VIDEO_FEED_DATA} />
        </div>
    );
}
