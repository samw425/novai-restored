'use client';

import React, { useState } from 'react';
import { Shield, Zap, Globe, Brain, ArrowRight } from 'lucide-react';
import { SignupModal } from '@/components/ui/SignupModal';

export default function AboutPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white mb-16 shadow-2xl shadow-slate-200">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-900/40"></div>

                <div className="relative z-10 p-12 md:p-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        Mission Critical
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
                        Intelligence for the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Post-Human Era.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                        We aggregate, synthesize, and verify the world's most critical data streams to give you an unfair advantage in the age of AGI.
                    </p>
                </div>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Total Awareness</h3>
                    <p className="text-slate-600 leading-relaxed">
                        The signal is drowning in noise. We deploy autonomous agents to monitor 50,000+ sources simultaneously, filtering out 99.9% of the fluff to deliver pure, actionable intelligence.
                    </p>
                </div>

                <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Brain className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Agentic Synthesis</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Information without context is useless. Our proprietary LLM clusters don't just read the news—they understand it, connecting dots between geopolitics, markets, and technology that humans miss.
                    </p>
                </div>

                <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Speed of Thought</h3>
                    <p className="text-slate-600 leading-relaxed">
                        In the exponential age, latency is death. Our infrastructure is built on the edge, delivering insights milliseconds after the event occurs, not hours later.
                    </p>
                </div>

                <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Uncompromising Truth</h3>
                    <p className="text-slate-600 leading-relaxed">
                        We are beholden to no one. No ads, no sponsors, no hidden agendas. Just raw, verified data presented without bias or spin.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                <h2 className="text-3xl font-bold text-white mb-6">Ready to upgrade your operating system?</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Join the elite circle of decision-makers who rely on Novai for their daily intelligence briefing.
                </p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                    Start Your Briefing
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
