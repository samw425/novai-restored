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

            <div className="space-y-16 mb-12">
                {/* SECTION 1: LATEST LAB NEWS */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200"></span>
                            Latest Lab News
                        </h2>
                        <span className="text-xs font-mono text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">Real-time Ingestion</span>
                    </div>

                    <CategoryFeed
                        category="research"
                        title=""
                        description=""
                        showHeader={false}
                    />
                </div>

                {/* SECTION 2: MODEL RELEASE VIDEOS */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse shadow-lg shadow-purple-200"></span>
                            Model Release Videos
                        </h2>
                        <span className="text-xs font-mono text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">Visual Intelligence</span>
                    </div>
                    <VideoFeed videos={llmVideos} />
                </div>
            </div>
        </div>
    );
}
