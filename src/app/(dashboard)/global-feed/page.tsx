import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Globe, Activity, Zap, Radio, Sparkles } from 'lucide-react';

export default function GlobalFeedPage() {
    return (
        <div className="space-y-16">
            {/* Hero Section - Refined Premium */}
            <div className="relative py-8">
                {/* Ambient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 -z-10" />

                <div className="space-y-10 text-center">
                    {/* Main Title - Appropriately Sized */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-black leading-none -tracking-tight">
                            <span className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                                Global
                            </span>
                            <br />
                            <span className="text-blue-600">
                                Intelligence
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 font-light tracking-tight max-w-2xl mx-auto">
                            The signal you need. The noise you don't.
                        </p>
                    </div>

                    {/* Trust Indicators - Clean Horizontal */}
                    <div className="flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto">
                        {/* Live Status */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                </span>
                                <span className="text-sm font-bold text-gray-900">LIVE</span>
                            </div>
                        </div>

                        <div className="h-5 w-px bg-gray-200"></div>

                        {/* Sources */}
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <span className="text-sm font-bold text-gray-900">70+ Sources</span>
                        </div>

                        <div className="h-5 w-px bg-gray-200"></div>

                        {/* Real-Time */}
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <Zap className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-sm font-bold text-gray-900">Real-Time</span>
                        </div>

                        <div className="h-5 w-px bg-gray-200"></div>

                        {/* AI Powered */}
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <Activity className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-sm font-bold text-gray-900">AI Filtered</span>
                        </div>
                    </div>

                    {/* System Status Card - Full Detail Restored */}
                    <div className="max-w-3xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all text-left">
                                <div className="flex gap-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center shadow-md">
                                            <Activity className="w-6 h-6 text-white" strokeWidth={2} />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                                                System Status: Active Monitoring
                                            </h3>
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm">
                                            Currently ingesting signals from <span className="font-bold text-gray-900">72+ and growing verified global sources</span> including major labs, academic pre-prints, and industry verticals. Our vector engine filters 94% of noise to isolate high-impact developments in real-time.
                                        </p>
                                    </div>
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
