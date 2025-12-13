import { FeedContainerClient as FeedContainer } from '@/components/feed/FeedContainerClient';
import { Globe, Activity } from 'lucide-react';
import { PremiumGlobeClient as PremiumGlobe } from '@/components/ui/PremiumGlobeClient';

export default function GlobalFeedPage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            {/* Hero Section - Apple/Nike Minimalist Style */}
            <div className="relative pt-12 pb-12 md:pt-20 md:pb-16 overflow-hidden">
                <div className="space-y-8 max-w-5xl mx-auto text-center px-4 relative z-10">
                    {/* Globe */}
                    <div className="w-full h-[180px] md:h-[240px] flex items-center justify-center mb-8 opacity-90">
                        <PremiumGlobe />
                    </div>

                    {/* Header */}
                    <div className="space-y-6 relative z-10">
                        <h1 className="text-6xl md:text-8xl font-sans font-extrabold text-slate-900 tracking-tighter leading-[0.9]">
                            Global Intelligence.
                            <br />
                            <span className="text-royal-gradient">For the AI Era.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed font-sans tracking-tight">
                            The signal you need. The noise you don't.
                        </p>
                    </div>

                    {/* Stats/Badges - Command Center Style */}
                    <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="glass-premium flex items-center gap-3 px-5 py-2.5 bg-white/60 border-slate-200/50 rounded-lg shadow-sm hover:border-blue-200 transition-colors group">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 blur-sm opacity-50"></div>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Status</span>
                                <span className="text-xs font-mono font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">NEURAL FILTERS ACTIVE</span>
                            </div>
                        </div>

                        <div className="glass-premium flex items-center gap-3 px-5 py-2.5 bg-white/60 border-slate-200/50 rounded-lg shadow-sm hover:border-blue-200 transition-colors group">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-400 blur-sm opacity-50"></div>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latency</span>
                                <span className="text-xs font-mono font-bold text-slate-900 group-hover:text-amber-600 transition-colors">REAL-TIME INFERENCE</span>
                            </div>
                        </div>

                        <div className="glass-premium flex items-center gap-3 px-5 py-2.5 bg-white/60 border-slate-200/50 rounded-lg shadow-sm hover:border-blue-200 transition-colors group">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-slate-500 blur-sm opacity-50"></div>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coverage</span>
                                <span className="text-xs font-mono font-bold text-slate-900 group-hover:text-slate-700 transition-colors">109+ GLOBAL SOURCES</span>
                            </div>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden text-left max-w-4xl mx-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="flex gap-5 relative z-10">
                            <div className="shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm ring-4 ring-slate-50">
                                    <Activity className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                        SYSTEM STATUS: NEURAL SENTINEL ACTIVE
                                    </h3>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm font-serif">
                                    Currently ingesting signals from <span className="font-bold text-slate-900">109+ verified global sources</span>. Our vector engine filters 94% of noise to isolate high-impact <span className="font-bold text-slate-900 border-b-2 border-amber-200">AI and Technology</span> developments in real-time.
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
