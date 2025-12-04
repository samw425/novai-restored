'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Brain, Zap, Globe, ArrowRight, Lock, Radio, Database, Cpu, Loader2, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { PremiumGlobe } from '@/components/ui/PremiumGlobe';
import { Article } from '@/types';

export default function OraclePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingArticle, setProcessingArticle] = useState<Article | null>(null);
    const [insights, setInsights] = useState<Article[]>([]);
    const [detectedKeyword, setDetectedKeyword] = useState<string>("");

    // Keywords to simulate detection
    const KEYWORDS = ["CRISIS", "BREAKTHROUGH", "MARKET SHOCK", "REGULATION", "MILITARY MOVEMENT", "SUPPLY CHAIN", "IPO", "FUNDING"];

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/feed/live?limit=50');
                const data = await response.json();
                if (data.articles) {
                    setArticles(data.articles);
                    // Simple "Insight" logic: Filter for high-signal categories or keywords
                    const highSignal = data.articles.filter((a: Article) =>
                        a.category === 'us-intel' ||
                        a.category === 'market' ||
                        a.title.toLowerCase().includes('crisis') ||
                        a.title.toLowerCase().includes('alert') ||
                        a.title.toLowerCase().includes('breakthrough')
                    ).slice(0, 8); // Increased limit slightly
                    setInsights(highSignal);
                }
            } catch (error) {
                console.error('Failed to fetch oracle data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Simulation Effect: "Processing" the feed
    useEffect(() => {
        if (articles.length === 0) return;

        const interval = setInterval(() => {
            const randomArticle = articles[Math.floor(Math.random() * articles.length)];
            setProcessingArticle(randomArticle);
            setDetectedKeyword(KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]);
        }, 2000); // Switch processed article every 2s

        return () => clearInterval(interval);
    }, [articles]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="max-w-7xl mx-auto space-y-12 py-8">

                {/* Header Section */}
                <div className="text-center space-y-6 relative">
                    <div className="w-24 h-24 mx-auto mb-8 opacity-90">
                        <PremiumGlobe />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-tight">
                        THE ORACLE
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        The top 1% of global signals, filtered for impact. <br className="hidden md:block" />
                        Don't miss the stories that matter.
                    </p>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Raw Feed (3 cols) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[600px] shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Radio className="w-4 h-4 text-slate-400" />
                                    Raw Global Feed
                                </h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-400">LIVE</span>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar relative pr-2">
                                {loading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                    </div>
                                ) : (
                                    articles.map((article) => (
                                        <div key={article.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group opacity-70 hover:opacity-100">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{article.source}</div>
                                                <div className="text-xs font-medium text-slate-700 line-clamp-2 leading-snug">{article.title}</div>
                                                <div className="text-[10px] text-slate-400 mt-1">{article.timeAgo}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Signal Processor (6 cols) */}
                    <div className="lg:col-span-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 h-[600px] shadow-sm relative overflow-hidden group flex flex-col">

                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-blue-500" />
                                        Signal Processor
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-xs font-mono text-slate-500">ACTIVE</span>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">

                                    {/* Central Processor Visual */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
                                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center ring-8 ring-blue-50 shadow-2xl relative z-10">
                                            <Brain className="w-12 h-12 text-blue-600" />
                                        </div>

                                        {/* Orbiting Particles */}
                                        <div className="absolute inset-0 animate-spin-slow">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-3 h-3 bg-emerald-400 rounded-full shadow-lg" />
                                        </div>
                                        <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }}>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-2 h-2 bg-amber-400 rounded-full shadow-lg" />
                                        </div>
                                    </div>

                                    {/* Active Processing Text */}
                                    <div className="max-w-md space-y-6 w-full">
                                        <div className="h-20 flex items-center justify-center">
                                            {processingArticle ? (
                                                <div key={processingArticle.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DETECTED:</span>
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100">
                                                            {detectedKeyword}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-900 line-clamp-2 px-8">
                                                        "{processingArticle.title}"
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-slate-400">Initializing Neural Link...</div>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="h-full bg-blue-500 w-1/3 animate-[shimmer_2s_infinite_linear] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"
                                                style={{ width: '100%', backgroundSize: '200% 100%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Priority Intelligence (3 cols) */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-[600px] shadow-lg flex flex-col relative overflow-hidden">

                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Priority Intelligence
                                </h3>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar relative z-10">
                                {loading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                                    </div>
                                ) : insights.length > 0 ? (
                                    insights.map((article) => (
                                        <div key={article.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition-all hover:shadow-md group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {article.category === 'us-intel' ? (
                                                        <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100">
                                                            INTEL SOURCE
                                                        </span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded border border-amber-100">
                                                            HIGH SIGNAL
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400">{article.timeAgo}</span>
                                            </div>

                                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors block mb-2">
                                                {article.title}
                                            </a>

                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <Database className="w-3 h-3" />
                                                <span className="font-medium">{article.source}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-500 text-sm py-10">
                                        Waiting for high-signal events...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
