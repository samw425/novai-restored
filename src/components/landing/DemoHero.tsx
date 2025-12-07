'use client';

import React, { useState } from 'react';
import { Play, ArrowRight, Activity, Globe, Shield } from 'lucide-react';
import { SignupModal } from '@/components/ui/SignupModal';

export function DemoHero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 mb-16 group">
            <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Background - Simulating a "War Room" Screen */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"></div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

            {/* Floating UI Elements (Decorative) */}
            <div className="absolute top-8 left-8 flex gap-2 z-30">
                <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    LIVE FEED
                </div>
            </div>

            {/* Main Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">

                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 md:mt-0">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    The Citizen Intelligence Agency
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Global situational awareness.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                        No clearance required.
                    </span>
                </h1>

                {/* Subhead */}
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    We aggregate, synthesize, and verify the world's most critical data streams to give you an unfair advantage in the age of AGI.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        Join the Waitlist
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Bottom Metrics Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex items-center justify-between px-8 text-xs font-mono text-slate-500">
                <div className="flex gap-8">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span>SYSTEMS: ONLINE</span>
                    </div>
                    <div className="flex items-center gap-2 hidden md:flex">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span>GLOBAL COVERAGE</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>ANALYSIS: ACTIVE</span>
                </div>
            </div>
        </div>
    );
}
