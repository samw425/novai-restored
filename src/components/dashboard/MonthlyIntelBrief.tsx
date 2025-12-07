'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, BrainCircuit, Globe, ChevronRight, FileText, Lock, Cpu, Radio, Zap, History, Calendar, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BriefItem, DailyBrief } from '@/lib/data/daily-briefs';

export function MonthlyIntelBrief() {
    const [brief, setBrief] = useState<DailyBrief | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'LATEST' | 'ARCHIVE'>('LATEST');
    const [archiveList, setArchiveList] = useState<DailyBrief[]>([]);

    useEffect(() => {
        fetchLatest();
    }, []);

    const fetchLatest = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/brief?mode=latest');
            const data = await res.json();
            setBrief(data.brief);
        } catch (error) {
            console.error('Failed to fetch brief:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArchive = async () => {
        if (archiveList.length > 0) {
            setViewMode('ARCHIVE');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/brief?mode=archive');
            const data = await res.json();
            setArchiveList(data.briefs);
            setViewMode('ARCHIVE');
        } catch (error) {
            console.error('Failed to fetch archive:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectBrief = (selected: DailyBrief) => {
        setBrief(selected);
        setViewMode('LATEST'); // Show the selected brief in the main view
    };

    if (loading && !brief && viewMode === 'LATEST') {
        return <div className="w-full h-64 bg-slate-900/50 animate-pulse rounded-2xl border border-blue-900/30"></div>;
    }

    return (
        <div className="w-full mb-12">
            {/* Glassmorphic Container - AI Command Center Aesthetic */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-slate-950/80 shadow-2xl backdrop-blur-xl transition-all duration-500">

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
                                    {brief?.headline || 'AI-INTEL BRIEF'}
                                </h2>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                    {brief?.date || 'Loading...'}
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
                            <div className="text-xs font-bold text-white font-mono tracking-wider">{brief?.clearanceLevel || 'TOP SECRET'}</div>
                        </div>
                        <div className="h-8 w-px bg-blue-500/20 hidden md:block"></div>

                        {/* Archive Toggle */}
                        {viewMode === 'LATEST' ? (
                            <button
                                onClick={fetchArchive}
                                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-bold uppercase tracking-wide rounded-lg transition-all flex items-center gap-2"
                            >
                                <History size={14} />
                                Past Briefs
                            </button>
                        ) : (
                            <button
                                onClick={() => setViewMode('LATEST')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wide rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
                            >
                                <ChevronLeft size={14} />
                                Back to Today
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative z-10 p-6 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {viewMode === 'LATEST' && brief ? (
                            <motion.div
                                key="latest"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            >
                                {brief.items.map((item, idx) => (
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
                                                    {item.category === 'MODEL INTELLIGENCE' && <Cpu size={12} className="text-purple-400" />}
                                                    {item.category === 'WAR ROOM' && <Shield size={12} className="text-orange-400" />}
                                                    {item.category === 'MARKET SIGNAL' && <Zap size={12} className="text-amber-400" />}
                                                    {item.category}
                                                </span>
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide border ${item.impact === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key="archive"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {archiveList.map((b) => (
                                    <button
                                        key={b.id}
                                        onClick={() => selectBrief(b)}
                                        className="text-left p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-blue-400 font-mono">{b.date}</span>
                                            <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                                            {b.headline.replace('AI-INTEL BRIEF: ', '')}
                                        </h3>
                                        <div className="mt-2 flex gap-1 flex-wrap">
                                            {b.items.slice(0, 3).map((i, idx) => (
                                                <span key={idx} className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors"></span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
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

