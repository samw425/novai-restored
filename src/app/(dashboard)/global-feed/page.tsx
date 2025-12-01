import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Globe, Activity } from 'lucide-react';

export default function GlobalFeedPage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 rounded-3xl -z-10" />

                <div className="space-y-8">
                    {/* Title */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="w-10 h-10 text-gray-900" strokeWidth={1.5} />
                            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                                Global Intelligence
                            </h1>
                        </div>
                        <p className="text-xl text-gray-500 font-medium max-w-3xl">
                            The signal you need. The noise you don't.
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-bold text-gray-900">70+ Verified Sources</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-bold text-gray-900">Updated Every Minute</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-bold text-gray-900">Growing Daily</span>
                        </div>
                    </div>

                    {/* Intelligence Note */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                        <div className="relative bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider flex items-center gap-2">
                                        System Status: Active Monitoring
                                        <span className="flex h-1.5 w-1.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </span>
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        Currently ingesting signals from <span className="font-bold text-gray-900">72+ and growing verified global sources</span> including major labs, academic pre-prints, and industry verticals.
                                        Our vector engine filters 94% of noise to isolate high-impact developments in real-time.
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
