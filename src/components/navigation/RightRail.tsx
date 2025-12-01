'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Zap, Cpu, ArrowUpRight, Info, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { WaitlistModal } from '@/components/ui/WaitlistModal';

export function RightRail() {
    return (
        <div className="sticky top-24 space-y-6 w-full">
            <WhatIsNovaiWidget />
            <HowItWorksWidget />
            <ProVersionAdWidget />
            <ToolOfTheDayWidget />
            <TrendingTopicsWidget />
        </div>
    );
}


function WhatIsNovaiWidget() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900">Novai Intelligence Engine</h3>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed mb-4">
                Novai is a real-time intelligence system for the AI era. We don't just aggregate news; we distill global signals into actionable insights for decision-makers.
            </p>

            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs">✓</span>
                    <span className="text-xs text-gray-600">50+ global intelligence sources</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs">✓</span>
                    <span className="text-xs text-gray-600">Real-time signal processing</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-blue-600 text-xs">✓</span>
                    <span className="text-xs text-gray-600">Sector-specific deep dives</span>
                </div>
            </div>
        </div>
    );
}

function HowItWorksWidget() {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-gray-900">How It Works</h3>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">1</span>
                        <span className="text-xs font-semibold text-gray-900">We Aggregate</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-7">Continuously fetch from top AI publishers worldwide</p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">2</span>
                        <span className="text-xs font-semibold text-gray-900">We Categorize</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-7">Organize by research, robotics, policy, market, and tools</p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">3</span>
                        <span className="text-xs font-semibold text-gray-900">You Stay Ahead</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-7">Get the latest AI news in one place, updated in real-time</p>
                </div>
            </div>
        </div>
    );
}

function SystemStatusWidget() {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-3 w-3" />
                    System Status
                </h3>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600">Live</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Active Sources</span>
                    <span className="font-medium text-gray-900">50+</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Categories</span>
                    <span className="font-medium text-gray-900">6</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Update Frequency</span>
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">5 min</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <Link href="/daily-snapshot" className="flex-1 text-center text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-1.5 rounded transition-colors">
                    Today's Snapshot
                </Link>
                <Link href="/deep-signals" className="flex-1 text-center text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-1.5 rounded transition-colors">
                    Top Signals
                </Link>
            </div>
        </div>
    );
}

function ProVersionAdWidget() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="h-24 w-24 -rotate-12" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                            Coming Soon
                        </span>
                    </div>

                    <h4 className="text-lg font-bold mb-2 leading-tight">Novai Pro Intelligence</h4>
                    <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
                        Unlock deeper synthesis, PDF exports, and personalized intelligence tracking.
                    </p>

                    <div className="mb-4">
                        <span className="text-[10px] font-semibold text-yellow-300 uppercase tracking-wide">
                            Why Upgrade?
                        </span>
                        <ul className="space-y-1 mt-1">
                            <li className="flex items-center gap-2 text-[11px] text-gray-300">
                                <span className="text-indigo-400">•</span> Unlimited History
                            </li>
                            <li className="flex items-center gap-2 text-[11px] text-gray-300">
                                <span className="text-indigo-400">•</span> Export to PDF/CSV
                            </li>
                            <li className="flex items-center gap-2 text-[11px] text-gray-300">
                                <span className="text-indigo-400">•</span> Custom Alerts
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold py-2.5 rounded-lg transition-all"
                    >
                        Join Waitlist
                    </button>
                </div>
            </div>

            <WaitlistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                source="Right Rail Widget"
            />
        </>
    );
}

function ToolOfTheDayWidget() {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5">
                <Cpu className="h-16 w-16 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Tool of the Day
                    </span>
                </div>

                <h4 className="text-base font-bold mb-1 text-gray-900">AI Tools</h4>
                <p className="text-xs text-gray-500 mb-4">Discover the latest AI development tools.</p>

                <Link
                    href="/tool/cursor"
                    className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                >
                    Inspect Tool
                </Link>
            </div>
        </div>
    );
}

function TrendingTopicsWidget() {
    const topics = [
        "OpenAI o1",
        "Agentic Coding",
        "AI Safety Summit",
        "NVIDIA Earnings",
        "Robotics Transformers"
    ];

    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="h-3 w-3" />
                Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                    <Link
                        key={topic}
                        href={`/global-feed?topic=${encodeURIComponent(topic)}`}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 text-xs font-medium rounded-full transition-colors border border-gray-100 hover:border-blue-100"
                    >
                        {topic}
                    </Link>
                ))}
            </div>
        </div>
    );
}

function AboutNovaiWidget() {
    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">About Novai</span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                Novai is a real-time intelligence engine for the AI era.
                We aggregate, analyze, and rank global AI activity so you can separate signal from noise.
            </p>

            <ul className="space-y-2 mb-5">
                {[
                    "Real-time Global Feed",
                    "Daily Intelligence Snapshot",
                    "Deep Signal Analysis",
                    "Risk & Safety Monitoring",
                    "Market & Industry Tracking"
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
                        <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                        {item}
                    </li>
                ))}
            </ul>

            <div className="space-y-2">
                <Link href="/how-it-works" className="flex items-center gap-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors group">
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    Learn how Novai works
                </Link>
                <Link href="/about" className="flex items-center gap-2 text-[11px] font-bold text-gray-500 hover:text-gray-700 transition-colors group">
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    Read full mission
                </Link>
            </div>
        </div>
    );
}

function MarketPulseWidget() {
    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-[#14171F] flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Market Pulse
                </h3>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live</span>
            </div>

            <div className="space-y-4">
                <MarketTicker symbol="NVDA" price="924.50" change="+2.4%" isPositive={true} />
                <MarketTicker symbol="MSFT" price="415.20" change="+0.8%" isPositive={true} />
                <MarketTicker symbol="GOOGL" price="173.10" change="-0.5%" isPositive={false} />
                <MarketTicker symbol="META" price="490.22" change="+1.2%" isPositive={true} />
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <Link href="/market-pulse" className="text-[11px] font-medium text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors">
                    View Full Market
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
    );
}

function MarketTicker({ symbol, price, change, isPositive }: { symbol: string, price: string, change: string, isPositive: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="text-xs font-bold text-[#14171F]">{symbol}</div>
                <div className="text-[10px] text-gray-400">${price}</div>
            </div>

            {/* Sparkline Placeholder */}
            <div className={`h-1 w-12 rounded-full ${isPositive ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <div className={`h-full rounded-full ${isPositive ? 'bg-emerald-400 w-3/4' : 'bg-red-400 w-1/2'}`} />
            </div>

            <span className={`text-[11px] font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {change}
            </span>
        </div>
    );
}
