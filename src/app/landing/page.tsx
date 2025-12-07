'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Globe, Zap, Lock, Play, ArrowRight } from 'lucide-react';
import { NovaiLogo } from '@/components/Logo';
import { LiveIntelPreview } from '@/components/landing/LiveIntelPreview';

export default function LandingPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        // Simulate API call
        setTimeout(() => setStatus('SUCCESS'), 1500);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/global-feed" className="flex items-center gap-2">
                        <NovaiLogo className="w-6 h-6 text-white" />
                        <span className="font-bold tracking-tight">NOVAI</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/global-feed" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link href="/global-feed">
                            <button className="px-4 py-2 bg-white text-slate-950 text-sm font-bold rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2">
                                Enter Command <ArrowRight size={14} />
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full opacity-30 pointer-events-none"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Live Intelligence Network
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                            THE CITIZEN<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                                INTELLIGENCE AGENCY
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Global situational awareness. No clearance required.
                            <br />
                            <span className="text-slate-500 text-lg">
                                Tracking kinetic warfare, regulatory shifts, and AI acceleration in real-time.
                            </span>
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link href="/global-feed">
                                <button className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2">
                                    <Zap size={18} />
                                    Launch Interface
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Live Intel Preview Section */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                    <LiveIntelPreview />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 bg-slate-950">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                            <Globe className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Global Feed</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Curated intelligence from 500+ sources. We filter the noise so you only see the signal.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                            <Shield className="text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">War Room</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Live tracking of kinetic conflicts. Satellite data, troop movements, and cyber warfare alerts.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                            <Lock className="text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Analyst Notes</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Proprietary synthesis. We don't just tell you what happened; we tell you why it matters.
                        </p>
                    </div>
                </div>
            </section>

            {/* Waitlist Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/5"></div>
                <div className="max-w-xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl font-black mb-6">Join the Inner Circle</h2>
                    <p className="text-slate-400 mb-8">
                        Get the Daily Intelligence Brief delivered to your inbox.
                        <br />
                        Join 10,000+ founders, investors, and analysts.
                    </p>

                    <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 pl-4 pr-32 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder:text-slate-600"
                            required
                        />
                        <button
                            type="submit"
                            disabled={status === 'LOADING' || status === 'SUCCESS'}
                            className="absolute right-1 top-1 h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'LOADING' ? '...' : status === 'SUCCESS' ? 'Joined' : 'Join'}
                        </button>
                    </form>
                    {status === 'SUCCESS' && (
                        <p className="mt-4 text-green-400 text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                            Welcome to the agency. Briefing inbound.
                        </p>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-slate-600 text-sm">
                <p>&copy; 2025 Novai Intelligence. All rights reserved.</p>
            </footer>
        </div>
    );
}
