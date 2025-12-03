'use client';

import Link from 'next/link';
import { Activity, Zap, Cpu, ArrowUpRight, Info, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

import { ProAd } from '@/components/ads/ProAd';

export function RightRail() {
    return (
        <div className="sticky top-24 space-y-6 w-full">
            <WhatIsNovaiWidget />
            <HowItWorksWidget />
            <ProAd />
            <ToolOfTheDayWidget />
            <TrendingTopicsWidget />
        </div>
    );
}


function WhatIsNovaiWidget() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-black text-gray-900">Novai Intelligence Engine</h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Novai is a real-time intelligence system for the AI era. We don't just aggregate news; we distill global signals into actionable insights for decision-makers.
            </p>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-600">109+ global intelligence sources</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-600">Real-time signal processing</span>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-gray-600">Sector-specific deep dives</span>
                </div>
            </div>
        </div>
    );
}

function HowItWorksWidget() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-black text-gray-900">How It Works</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-black flex items-center justify-center">1</span>
                        <span className="text-sm font-bold text-gray-900">We Aggregate</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8.5">Continuously fetch from top AI publishers worldwide</p>
                </div>

                <div>
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-black flex items-center justify-center">2</span>
                        <span className="text-sm font-bold text-gray-900">We Categorize</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8.5">Organize by research, robotics, policy, market, and tools</p>
                </div>

                <div>
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-black flex items-center justify-center">3</span>
                        <span className="text-sm font-bold text-gray-900">You Stay Ahead</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8.5">Get the latest AI news in one place, updated in real-time</p>
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
                    <span className="text-gray-500">Daily Growth</span>
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Active
                    </span>
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



function ToolOfTheDayWidget() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5">
                <Cpu className="h-16 w-16 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Tool of the Day
                    </span>
                </div>

                <h4 className="text-xl font-black mb-2 text-gray-900">AI Tools</h4>
                <p className="text-sm text-gray-600 mb-5">Discover the latest AI development tools.</p>

                <Link
                    href="/tool/cursor"
                    className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
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
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                    <Link
                        key={topic}
                        href={`/global-feed?topic=${encodeURIComponent(topic)}`}
                        className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm font-medium rounded-full transition-colors border border-gray-200 hover:border-blue-200"
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

            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        109+ Verified Sources
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        Growing Daily
                    </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Novai is a living intelligence engine. We aggregate verified global sources and evolve daily,
                    continuously integrating new signals so you can separate signal from noise.
                </p>
            </div>

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
