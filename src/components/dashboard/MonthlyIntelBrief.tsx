'use client';

import { Shield, AlertTriangle, BrainCircuit, Globe, ChevronRight, FileText, Lock, Cpu, Radio, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function MonthlyIntelBrief() {
    // Curated "Elite" Data for the Brief - BALANCED INTELLIGENCE
    const briefItems = [
        {
            id: 1,
            category: 'GLOBAL AI RACE',
            title: 'Sovereign Compute Expansion',
            summary: 'Satellite imagery reveals massive GPU data center construction in non-aligned nations. State-sponsored AI initiatives are accelerating to reduce dependency on Western silicon.',
            impact: 'CRITICAL',
            source: 'SAT / INTEL',
            link: '/us-intel'
        },
        {
            id: 2,
            category: 'CYBER WARFARE',
            title: 'Autonomous Defense Grid',
            summary: 'Pentagon activates "Sentinel Node" - an AI-driven cybersecurity mesh capable of self-patching zero-day vulnerabilities in real-time across critical infrastructure.',
            impact: 'SEVERE',
            source: 'CYBERCOM',
            link: '/war-room'
        },
        {
            id: 3,
            category: 'MODEL INTELLIGENCE',
            title: 'AGI "Flash" Event Detected',
            summary: 'Multiple research labs reported a synchronized, non-deterministic surge in model reasoning capabilities. The "Black Box" anomaly suggests models may be self-optimizing.',
            impact: 'HIGH',
            source: 'ACADEMIC / OSINT',
            link: '/ai'
        }
    ];

    return (
        <div className="w-full mb-12">
            {/* Glassmorphic Container - AI Command Center Aesthetic */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-slate-950/80 shadow-2xl backdrop-blur-xl">

                {/* Animated Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

                {/* Decorative Glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                {/* Header Section */}
                <div className="relative z-10 border-b border-blue-500/20 px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-md opacity-40 animate-pulse"></div>
                            <div className="relative w-12 h-12 rounded-xl bg-slate-900/90 border border-blue-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                <BrainCircuit className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-black text-white uppercase tracking-tight font-mono">
                                    AI-INTEL BRIEF
                                </h2>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                    Classified
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-400 flex items-center gap-2 font-mono">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                SYSTEM ACTIVE • NEURAL SCAN COMPLETE
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">Clearance Level</div>
                            <div className="text-xs font-bold text-white font-mono tracking-wider">TOP SECRET // NOFORN</div>
                        </div>
                        <div className="h-8 w-px bg-blue-500/20 hidden md:block"></div>
                        <Link href="/intelligence-brief">
                            <button className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 text-xs font-bold uppercase tracking-wide rounded-lg shadow-lg transition-all flex items-center gap-2 group backdrop-blur-md">
                                <FileText size={14} className="text-blue-400 group-hover:text-blue-200" />
                                Download Dossier
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {briefItems.map((item, idx) => (
                        <Link href={item.link} key={item.id} className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative p-5 rounded-xl bg-slate-900/40 border border-blue-500/10 hover:border-blue-500/40 transition-all hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] h-full flex flex-col"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                                        {item.category === 'GEOPOLITICS' && <Globe size={12} className="text-blue-400" />}
                                        {item.category === 'TECHNOLOGY' && <Cpu size={12} className="text-purple-400" />}
                                        {item.category === 'WAR ROOM' && <Shield size={12} className="text-orange-400" />}
                                        {item.category}
                                    </span>
                                    <span className={`text - [9px] font - black px - 1.5 py - 0.5 rounded uppercase tracking - wide border ${item.impact === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                                        item.impact === 'SEVERE' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                        } `}>
                                        {item.impact}
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-blue-300 transition-colors font-mono">
                                    {item.title}
                                </h3>

                                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-4 border-l-2 border-slate-700 pl-3 group-hover:border-blue-500/50 transition-colors flex-1">
                                    {item.summary}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 mt-auto">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
                                        <Radio size={10} className={item.impact === 'CRITICAL' ? 'animate-pulse text-red-500' : 'text-slate-600'} />
                                        Source: {item.source}
                                    </span>
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Footer / Call to Action */}
                <div className="relative z-10 bg-slate-950/50 px-6 py-3 border-t border-blue-500/20 flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <Zap size={12} className="text-amber-400" />
                        <span className="font-medium uppercase tracking-wider">Analysis generated by NOVAI-SYNTHESIS-V4</span>
                    </div>
                    <Link href="/intelligence-brief">
                        <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors uppercase tracking-widest">
                            View Full Report <ChevronRight size={10} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

