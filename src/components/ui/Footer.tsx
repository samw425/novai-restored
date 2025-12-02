import React from 'react';
import { Globe, Zap } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
    return (
        <footer className="w-full bg-white border-t border-slate-200 py-12 px-6 mt-auto">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    {/* BRAND COLUMN */}
                    <div className="col-span-1 md:col-span-4 space-y-4 pr-8">
                        <Logo theme="light" />
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            The central nervous system for the post-AI world. Autonomously monitoring 70+ high-signal sources to provide a God's Eye View of the technological singularity.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            SYSTEM OPERATIONAL
                        </div>
                    </div>

                    {/* LINKS COLUMN 1: PLATFORM */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><a href="/global-feed" className="text-slate-600 hover:text-blue-600 transition-colors">Global Feed</a></li>
                            <li><a href="/deep-signals" className="text-slate-600 hover:text-blue-600 transition-colors">Deep Signals</a></li>
                            <li><a href="/daily-snapshot" className="text-slate-600 hover:text-blue-600 transition-colors">Daily Snapshot</a></li>
                            <li><a href="/live-wire" className="text-slate-600 hover:text-blue-600 transition-colors">Live Wire</a></li>
                            <li><a href="/war-room" className="text-slate-600 hover:text-blue-600 transition-colors">War Room</a></li>
                            <li><a href="/market-pulse" className="text-slate-600 hover:text-blue-600 transition-colors">Market Pulse</a></li>
                        </ul>
                    </div>

                    {/* LINKS COLUMN 2: SECTORS */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sectors</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><a href="/ai-news" className="text-slate-600 hover:text-blue-600 transition-colors">AI News</a></li>
                            <li><a href="/llms" className="text-slate-600 hover:text-blue-600 transition-colors">LLMs & Models</a></li>
                            <li><a href="/robotics" className="text-slate-600 hover:text-blue-600 transition-colors">Robotics</a></li>
                            <li><a href="/us-intel" className="text-slate-600 hover:text-blue-600 transition-colors">US Intelligence</a></li>
                            <li><a href="/research" className="text-slate-600 hover:text-blue-600 transition-colors">Research</a></li>
                            <li><a href="/policy" className="text-slate-600 hover:text-blue-600 transition-colors">Policy & Regulation</a></li>
                            <li><a href="/cyber-intel" className="text-slate-600 hover:text-blue-600 transition-colors">Cyber Intelligence</a></li>
                            <li><a href="/hacker-news" className="text-slate-600 hover:text-blue-600 transition-colors">Hacker News</a></li>
                        </ul>
                    </div>

                    {/* LINKS COLUMN 3: RESOURCES */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Resources</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><a href="/tools" className="text-slate-600 hover:text-blue-600 transition-colors">AI Tools Database</a></li>
                            <li><a href="/lab-tools" className="text-slate-600 hover:text-blue-600 transition-colors">Lab Tools</a></li>
                            <li><a href="/trend-watch" className="text-slate-600 hover:text-blue-600 transition-colors">Trend Watch</a></li>
                            <li><a href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">How It Works</a></li>
                            <li><a href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Mission</a></li>

                            <li><a href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About Novai</a></li>
                            <li><a href="/feedback" className="text-slate-600 hover:text-blue-600 transition-colors">Feedback</a></li>
                        </ul>
                    </div>

                    {/* LINKS COLUMN 4: LEGAL */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><a href="/legal/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="/legal/terms" className="text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="/legal/cookies" className="text-slate-600 hover:text-blue-600 transition-colors">Cookie Policy</a></li>
                            <li><a href="/legal/data-governance" className="text-slate-600 hover:text-blue-600 transition-colors">Data Governance</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-400 text-xs font-mono">
                        © 2026 NOVAI INTELLIGENCE. ALL RIGHTS RESERVED.
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Zap size={14} className="text-amber-500" />
                            <span>Powered by Aether</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <Globe size={12} />
                            <span>Los Angeles, CA</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
