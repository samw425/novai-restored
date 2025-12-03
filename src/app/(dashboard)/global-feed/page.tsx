import { FeedContainer } from '@/components/feed/FeedContainer';
import { Globe, Activity } from 'lucide-react';

export default function GlobalFeedPage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative pt-8 pb-4">
                <div className="space-y-8 max-w-5xl mx-auto text-center">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20"></div>
                                <Globe className="relative w-12 h-12 text-slate-900" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-6xl font-bold text-slate-900 tracking-tight">
                                Global Intelligence for <span className="text-blue-600">the AI Era</span>
                            </h1>
                        </div>
                        <p className="text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                            Stay ahead of the curve. The world's most advanced AI intelligence platform.
                        </p>
                    </div>

                    {/* Stats/Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-slate-900">Neural Filters Active</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-bold text-slate-900">Real-Time Inference</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-bold text-slate-900">72+ Global Sources</span>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden text-left max-w-4xl mx-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="flex gap-5 relative z-10">
                            <div className="shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm ring-4 ring-slate-50">
                                    <Activity className="w-6 h-6 text-blue-400" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                        SYSTEM STATUS: NEURAL SENTINEL ACTIVE
                                    </h3>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    Currently ingesting signals from <span className="font-bold text-slate-900">72+ verified global sources</span>. Our vector engine filters 94% of noise to isolate high-impact <span className="font-bold text-blue-600">AI and Technology</span> developments in real-time.
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
