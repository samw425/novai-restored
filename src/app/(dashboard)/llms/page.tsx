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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-900">SOTA Benchmark</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-900">Claude 3.5</p>
                    <p className="text-xs text-slate-500 mt-1">Current Leader (Coding/Reasoning)</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Network className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-slate-900">Open Source King</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-900">Llama 3.1 405B</p>
                    <p className="text-xs text-slate-500 mt-1">Meta's Frontier Model</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Brain className="w-5 h-5 text-amber-600" />
                        <h3 className="font-bold text-slate-900">Next Anticipated</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-900">GPT-5 / Orion</p>
                    <p className="text-xs text-slate-500 mt-1">OpenAI (Expected Q4 2024/Q1 2025)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Latest Lab News
                </h2>
                {/* Using CategoryFeed with 'research' to pull real-time data from our ingestion engine */}
                <CategoryFeed
                    category="research"
                    title=""
                    description=""
                />

                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        Model Release Videos
                    </h2>
                    <VideoFeed videos={llmVideos} />
                </div>
            </div>
        </div>
    );
}
