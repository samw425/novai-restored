'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { Brain, Cpu, Network } from 'lucide-react';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { LIVE_VIDEOS } from '@/lib/data/video-feed';

export default function LLMsPage() {
    // Filter for LLM-related videos from our master feed
    const llmVideos = LIVE_VIDEOS.filter(v =>
        v.title.includes('GPT') ||
        v.title.includes('Claude') ||
        v.title.includes('Gemini') ||
        v.title.includes('Llama') ||
        v.title.includes('Model') ||
        v.title.includes('LLM')
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="LLMs & Models"
                description="Real-time tracking of Large Language Model releases, benchmarks, and architecture updates."
                icon={<Brain className="w-8 h-8 text-purple-600" />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Latest Lab News
                        </h2>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Real-time Ingestion</span>
                    </div>

                    {/* Using CategoryFeed with 'research' to pull real-time data from our ingestion engine */}
                    <CategoryFeed
                        category="research"
                        title=""
                        description=""
                        showHeader={false}
                    />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                            Model Release Videos
                        </h2>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Visual Intelligence</span>
                    </div>
                    <VideoFeed videos={llmVideos} />
                </div>
            </div>
        </div>
    );
}
