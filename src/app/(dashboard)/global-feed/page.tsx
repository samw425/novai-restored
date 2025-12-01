import { FeedContainer } from '@/components/feed/FeedContainer';
import { Globe, Activity } from 'lucide-react';

export default function GlobalFeedPage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative pt-8 pb-4">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Globe className="w-10 h-10 text-slate-900" strokeWidth={1.5} />
                            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
                                Global Intelligence
                            </h1>
                        </div>
                        <p className="text-xl text-slate-500 font-medium">
                            The signal you need. The noise you don't.
                        </p>
                    </div>

                    {/* Stats/Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-sm font-bold text-slate-900">70+ Verified Sources</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-bold text-slate-900">Updated Every Minute</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-bold text-slate-900">Growing Daily</span>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex gap-5">
                            <div className="shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
                                    <Activity className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                        SYSTEM STATUS: ACTIVE MONITORING
                                    </h3>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    Currently ingesting signals from <span className="font-bold text-slate-900">72+ and growing verified global sources</span> including major labs, academic pre-prints, and industry verticals. Our vector engine filters 94% of noise to isolate high-impact developments in real-time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <FeedContainer />
        </div>
    );
}
