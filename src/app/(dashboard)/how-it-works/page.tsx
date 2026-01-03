'use client';

import React from 'react';
import { Eye, Layers, Brain, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
    return (
        <div className="max-w-5xl mx-auto pb-20 px-6">
            <div className="text-center py-16 space-y-6">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                    How to Wield <span className="text-blue-600">Novai</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Stop doomscrolling. Start analyzing.
                    <br />
                    Here is your protocol for gaining an information advantage.
                </p>
            </div>

            <div className="space-y-24">
                {/* STEP 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative group">
                        <div className="absolute inset-0 bg-blue-100 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                        <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-64 flex flex-col justify-center">
                            {/* Placeholder for visual - simple mock UI */}
                            <div className="space-y-4">
                                <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse"></div>
                                <div className="space-y-3">
                                    <div className="h-20 bg-slate-50 rounded-xl border border-slate-100 p-4">
                                        <div className="h-3 w-3/4 bg-slate-200 rounded mb-2"></div>
                                        <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                                    </div>
                                    <div className="h-20 bg-slate-50 rounded-xl border border-slate-100 p-4 opacity-75">
                                        <div className="h-3 w-3/4 bg-slate-200 rounded mb-2"></div>
                                        <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Eye size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">1. The Morning Protocol</h2>
                        <h3 className="text-lg font-semibold text-blue-600">Start with the God's Eye View</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Check the <Link href="/global-feed" className="text-blue-600 hover:underline font-medium">Global Feed</Link> first.
                            It aggregates 50+ major sources into a single stream. Scan the headlines to understand the macro narrative in 60 seconds.
                        </p>
                    </div>
                </div>

                {/* STEP 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Layers size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">2. Deep Dive for Alpha</h2>
                        <h3 className="text-lg font-semibold text-emerald-600">Sector-Specific Intelligence</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Don't rely on generalists. Use the sidebar to drill into <Link href="/semiconductors" className="text-emerald-600 hover:underline font-medium">Semiconductors</Link>, <Link href="/biotech" className="text-emerald-600 hover:underline font-medium">Biotech</Link>, or the <Link href="/war-room" className="text-emerald-600 hover:underline font-medium">War Room</Link>.
                            <br /><br />
                            This is where you find the localized signals and technical shifts that mainstream news misses.
                        </p>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-100 rounded-3xl transform -rotate-3 transition-transform group-hover:-rotate-6"></div>
                        <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-64 flex flex-col justify-center">
                            {/* Mock sidebar UI */}
                            <div className="flex gap-4">
                                <div className="w-1/3 space-y-2">
                                    <div className="h-8 bg-slate-100 rounded-lg w-full"></div>
                                    <div className="h-8 bg-emerald-50 border border-emerald-100 rounded-lg w-full border-l-4 border-l-emerald-500"></div>
                                    <div className="h-8 bg-slate-100 rounded-lg w-full"></div>
                                </div>
                                <div className="w-2/3 space-y-3">
                                    <div className="h-20 bg-slate-50 rounded-xl border border-slate-100"></div>
                                    <div className="h-20 bg-slate-50 rounded-xl border border-slate-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative group">
                        <div className="absolute inset-0 bg-purple-100 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                        <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-64 flex flex-col justify-center">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="w-5 h-5 text-purple-500" />
                                    <span className="font-bold text-slate-700">US Intelligence / CIA</span>
                                </div>
                                <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4 text-sm text-slate-400 font-mono flex flex-col justify-center">
                                    <p>Analyzing agency positioning...</p>
                                    <p className="text-purple-500">{'>'} Correlating defense spending...</p>
                                    <p>{'>'} Identifying strategic pivot...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <Brain size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">3. Contextualize the Noise</h2>
                        <h3 className="text-lg font-semibold text-purple-600">Synthesis & Oracle</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Raw data isn't enough. Use the <Link href="/us-intel" className="text-purple-600 hover:underline font-medium">US Intelligence</Link> dossiers to understand agency positioning.
                            <br /><br />
                            Connect the dots. See who is pulling the strings.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-24 text-center">
                <Link href="/global-feed" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-transform active:scale-95 shadow-lg hover:shadow-xl">
                    Start Your Briefing <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
