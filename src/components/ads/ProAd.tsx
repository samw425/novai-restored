'use client';

import { Zap, ArrowRight, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

export function ProAd() {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm group hover:shadow-md transition-all duration-300">
            {/* Background Effects - Subtle Light Theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/30" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-100/80 transition-all duration-500" />

            <div className="relative p-6">
                {/* Header Badge */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="px-2 py-1 rounded-full bg-blue-50 border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase flex items-center gap-1.5">
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
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 tracking-tight">
                        Unlock <span className="text-blue-600">Pro Access</span>
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
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
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 group-hover/item:border-blue-200 transition-colors">
                                <item.icon className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">
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
                    <div className="relative flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Join Waitlist
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <p className="text-center mt-3 text-[10px] text-slate-400 font-medium">
                    Limited spots available for beta access.
                </p>
            </div>
        </div>
    );
}
