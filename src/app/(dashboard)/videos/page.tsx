import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { LIVE_VIDEOS, BRIEF_VIDEOS } from '@/lib/data/video-feed';
import { PlaySquare, Youtube, Radio, ShieldAlert } from 'lucide-react';

export const metadata = {
    title: 'Video Intelligence | Novai',
    description: 'Curated high-signal AI videos, demos, and interviews.',
};

export default function VideosPage() {
    return (
        <div className="space-y-12">
            <PageHeader
                title="Video Intelligence"
                description="VISUAL SIGNAL PROCESSING"
                insight="Curated high-signal demonstrations, keynotes, and technical breakdowns from the AI frontier."
                icon={<Youtube className="w-8 h-8 text-red-600" />}
            />

            {/* LIVE FEED SECTION */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Radio className="h-5 w-5 text-red-600 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest leading-none">
                                Live Wire: Visual Intel
                            </h2>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-1">
                                Real-time Demos • Keynotes • Breaking News
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                            Live Updates
                        </span>
                    </div>
                </div>

                <VideoFeed videos={LIVE_VIDEOS} />
            </section>

            {/* 30-DAY BRIEF SECTION */}
            <section className="space-y-6">
                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldAlert size={120} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldAlert className="text-amber-400" />
                                <h2 className="text-2xl font-black tracking-tight">30-Day Video Brief</h2>
                            </div>
                            <p className="text-slate-400 max-w-xl">
                                The most critical visual updates from the last month. High-signal content only. If you only watch 3 videos this month, watch these.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-400/10 px-4 py-2 rounded-lg border border-amber-400/20">
                            CONFIDENTIAL // TOP PRIORITY
                        </div>
                    </div>

                    <VideoFeed videos={BRIEF_VIDEOS} />
                </div>
            </section>
        </div>
    );
}
