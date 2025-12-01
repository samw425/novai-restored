import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Globe, Activity, Zap, Radio, Sparkles } from 'lucide-react';

export default function GlobalFeedPage() {
    return (
        <div className="space-y-16">
            {/* Hero Section - World Elite / Authority Style */}
            <div className="relative py-16 md:py-24">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

                <div className="space-y-16 text-center max-w-5xl mx-auto px-4">
                    {/* Main Title - Massive, Tight, Authoritative */}
                    <div className="space-y-8">
                        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-slate-900 leading-[0.9]">
                            GLOBAL
                            <br />
                            INTELLIGENCE
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 font-light tracking-wide max-w-2xl mx-auto">
                            The signal you need. The noise you don't.
                        </p>
                    </div>

                    {/* Trust Indicators - Technical / Data Readout Style */}
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {/* Live Status */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-widest">SYSTEM ACTIVE</span>
                        </div>

                        {/* Sources */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                            <span className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-widest">72 SOURCES CONNECTED</span>
                        </div>

                        {/* Real-Time */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                            <Zap className="w-3 h-3 text-slate-400" />
                            <span className="text-[11px] font-mono font-medium text-slate-600 uppercase tracking-widest">REAL-TIME VECTOR</span>
                        </div>
                    </div>

                    {/* System Status Card - Minimalist Technical */}
                    <div className="max-w-xl mx-auto mt-12">
                        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded flex items-center justify-center shrink-0">
                                <Activity className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="text-left flex-1">
                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Current Status</div>
                                <div className="text-sm font-medium text-slate-900">
                                    Monitoring <span className="font-bold">Global Conflict</span>, <span className="font-bold">AI Markets</span>, and <span className="font-bold">Policy</span>.
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                                    OPTIMAL
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
