'use client';

import { Zap, ArrowRight, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

export function ProAd() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500" />
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transform group-hover:scale-110 transition-transform duration-700">
                <Zap className="w-32 h-32 text-white" fill="currentColor" />
            </div>

            <div className="relative p-6">
                {/* Header Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase flex items-center gap-1.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                            Coming Soon
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                        Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">God Mode</span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        See what others miss. Get the unfair advantage with AI-synthesized intelligence and predictive signals.
                    </p>
                </div>

                {/* Feature Hooks */}
                <div className="space-y-3 mb-8">
                    {[
                        { icon: Zap, text: "Real-time Signal Processing" },
                        { icon: Activity, text: "Predictive Market Trends" },
                        { icon: Lock, text: "Exclusive Deep Dives" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group/item">
                            <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 group-hover/item:border-blue-500/50 transition-colors">
                                <item.icon className="w-3 h-3 text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover/item:text-white transition-colors">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <Link
                    href="/pro"
                    className="relative block w-full group/btn"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-75 group-hover/btn:opacity-100 blur-[1px] transition duration-200" />
                    <div className="relative flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all">
                        Join Waitlist
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <p className="text-center mt-3 text-[10px] text-slate-500 font-medium">
                    Limited spots available for beta access.
                </p>
            </div>
        </div>
    );
}
