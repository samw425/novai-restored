import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Globe, Activity, Zap, Radio, Sparkles } from 'lucide-react';

export default function GlobalFeedPage() {
    return (
        <div className="space-y-16">
            {/* Hero Section - Refined Premium */}
            <div className="relative py-12">
                {/* Ambient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white -z-10" />

                <div className="space-y-12 text-center">
                    {/* Main Title - Appropriately Sized */}
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tighter text-slate-900">
                            Global
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Intelligence
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-tight max-w-2xl mx-auto">
                            The signal you need. The noise you don't.
                        </p>
                    </div>

                    {/* Trust Indicators - Clean Horizontal */}
                    <div className="flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto">
                        {/* Live Status */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200/50">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">LIVE</span>
                        </div>

                        {/* Sources */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200/50">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">70+ Sources</span>
                        </div>

                        {/* Real-Time */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200/50">
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Real-Time</span>
                        </div>

                        {/* AI Powered */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200/50">
                            <Activity className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">AI Filtered</span>
                        </div>
                    </div>

                    {/* System Status Card - Full Detail Restored */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
                            <div className="flex gap-5">
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                                        <Activity className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                            System Status: Active
                                        </h3>
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                                        Ingesting signals from <span className="text-slate-900">72+ verified global sources</span>. Vector engine filtering 94% of noise in real-time.
                                    </p>
                                </div>
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
