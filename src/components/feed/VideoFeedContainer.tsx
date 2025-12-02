'use client';

import React, { useState } from 'react';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { VideoItem } from '@/lib/data/video-feed';
import { Radio, ShieldAlert, LayoutGrid, List } from 'lucide-react';

interface VideoFeedContainerProps {
    liveVideos: VideoItem[];
    briefVideos: VideoItem[];
}

type ViewMode = 'live' | 'brief';

export function VideoFeedContainer({ liveVideos, briefVideos }: VideoFeedContainerProps) {
    const [view, setView] = useState<ViewMode>('live');

    return (
        <div className="space-y-8">
            {/* TOGGLE CONTROLS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-lg w-full sm:w-auto">
                    <button
                        onClick={() => setView('live')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${view === 'live'
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        <Radio size={14} className={view === 'live' ? 'animate-pulse' : ''} />
                        Live Wire
                    </button>
                    <button
                        onClick={() => setView('brief')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 ${view === 'brief'
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        <ShieldAlert size={14} />
                        30-Day Brief
                    </button>
                </div>

                <div className="hidden sm:flex items-center gap-3 px-4 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {view === 'live' ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Live Feed Active
                        </>
                    ) : (
                        <>
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Top Priority Only
                        </>
                    )}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[600px]">
                {view === 'live' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest leading-none">
                                    Live Visual Intelligence
                                </h2>
                                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-1">
                                    Real-time Demos • Keynotes • Breaking News
                                </p>
                            </div>
                        </div>
                        <VideoFeed videos={liveVideos} />

                        {/* Infinite Scroll Loader Mockup */}
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                            <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                            <span className="text-xs font-mono uppercase tracking-widest">Loading more signals...</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden mb-8">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldAlert size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldAlert className="text-amber-400" />
                                    <h2 className="text-2xl font-black tracking-tight">30-Day Video Brief</h2>
                                </div>
                                <p className="text-slate-400 max-w-xl">
                                    The most critical visual updates from the last month. High-signal content only. If you only watch 3 videos this month, watch these.
                                </p>
                            </div>
                        </div>
                        <VideoFeed videos={briefVideos} />
                    </div>
                )}
            </div>
        </div>
    );
}
