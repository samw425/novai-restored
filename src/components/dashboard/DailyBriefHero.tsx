'use client';

/**
 * DailyBriefHero - Premium "Command Center" Daily Intelligence Brief
 * 
 * This is an ADDITIVE component that displays at the top of Global Feed.
 * It does NOT modify any existing components.
 */

import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ChevronRight, Loader2, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BriefItem {
    title: string;
    category: string;
    bottomLine: string;
    signalScore: number;
    source: string;
    url: string;
}

interface DailyBriefData {
    date: string;
    headline: string;
    briefingItems: BriefItem[];
    overallSentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Crisis';
    statOfTheDay: { value: string; label: string };
}

interface DailyBriefHeroProps {
    className?: string;
}

export function DailyBriefHero({ className = '' }: DailyBriefHeroProps) {
    const [brief, setBrief] = useState<DailyBriefData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Fetch from our new synthesis API endpoint
        fetch('/api/daily-brief')
            .then(res => res.json())
            .then(data => {
                if (data.brief) {
                    setBrief(data.brief);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('[DailyBriefHero] Failed to load:', err);
                setError(true);
                setLoading(false);
            });
    }, []);

    // Get sentiment styling
    const getSentimentStyle = (sentiment: string) => {
        switch (sentiment) {
            case 'Bullish':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            case 'Bearish':
                return 'bg-red-500/10 text-red-400 border-red-500/30';
            case 'Crisis':
                return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
        }
    };

    // Get signal score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-blue-400';
        if (score >= 40) return 'text-amber-400';
        return 'text-slate-400';
    };

    if (loading) {
        return (
            <div className={`bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-8 ${className}`}>
                <div className="flex items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-mono text-sm">Neural Sentinel synthesizing...</span>
                </div>
            </div>
        );
    }

    if (error || !brief) {
        return null; // Fail silently - don't break the page
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl ${className}`}
        >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            Daily Intelligence Brief
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 font-mono">{brief.date}</p>
                    </div>
                </div>

                {/* Sentiment Badge */}
                <div className={`px-3 py-1.5 rounded-lg border ${getSentimentStyle(brief.overallSentiment)} flex items-center gap-2`}>
                    {brief.overallSentiment === 'Crisis' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {brief.overallSentiment === 'Bullish' && <TrendingUp className="w-3.5 h-3.5" />}
                    <span className="text-xs font-bold uppercase tracking-wider">{brief.overallSentiment}</span>
                </div>
            </div>

            {/* Top Stories Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {brief.briefingItems.slice(0, expanded ? 6 : 3).map((item, idx) => (
                            <motion.a
                                key={item.url}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group block bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-300"
                            >
                                {/* Category + Score */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                        {item.category}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Zap className={`w-3 h-3 ${getScoreColor(item.signalScore)}`} />
                                        <span className={`text-xs font-mono font-bold ${getScoreColor(item.signalScore)}`}>
                                            {item.signalScore}
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                                    {item.title}
                                </h3>

                                {/* Bottom Line */}
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.bottomLine}
                                </p>

                                {/* Source */}
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 font-mono uppercase">{item.source}</span>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.a>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Expand/Collapse Button */}
                {brief.briefingItems.length > 3 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-4 w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 rounded-lg transition-all uppercase tracking-wider"
                    >
                        {expanded ? 'Show Less' : `View All ${brief.briefingItems.length} Signals`}
                    </button>
                )}
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-3 bg-slate-800/20 border-t border-slate-700/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="font-mono">Powered by Neural Sentinel</span>
                </div>
                <div className="text-xs text-slate-400">
                    <span className="font-bold text-white">{brief.statOfTheDay.value}</span>
                    <span className="ml-1">{brief.statOfTheDay.label}</span>
                </div>
            </div>
        </motion.div>
    );
}
