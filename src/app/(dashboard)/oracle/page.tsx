'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Brain, Zap, Globe, ArrowRight, Lock, Radio, Database, Cpu, Loader2, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { PremiumGlobeClient as PremiumGlobe } from '@/components/ui/PremiumGlobeClient';
import { Article } from '@/types';

import { ProWaitlistModal } from '@/components/modals/ProWaitlistModal';

export default function OraclePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingArticle, setProcessingArticle] = useState<Article | null>(null);
    const [insights, setInsights] = useState<Article[]>([]);
    const [detectedKeyword, setDetectedKeyword] = useState<string>("");
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center px-4 space-y-8">
                {/* Globe */}
                <div className="w-32 h-32 mx-auto opacity-90 mb-8">
                    <PremiumGlobe />
                </div>

                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wider mb-4">
                        <Lock className="w-3 h-3 text-amber-400" />
                        PRO FEATURE
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-tight">
                        THE ORACLE
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed font-medium">
                        Real-time synthesis engine and predictive modeling. <br />
                        Available exclusively to Pro members.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md mx-auto mt-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-left p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">Real-Time Signal Processing</div>
                                <div className="text-xs text-slate-500">Live filtering of 100+ global sources</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-left p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <Brain className="w-5 h-5 text-blue-500 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">Predictive Synthesis</div>
                                <div className="text-xs text-slate-500">AI-driven impact forecasting</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsWaitlistOpen(true)}
                        className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Join Pro Waitlist
                    </button>
                    <p className="text-xs text-slate-400 mt-4">
                        Limited access beta opening soon.
                    </p>
                </div>
            </div>

            <ProWaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                featureName="The Oracle"
            />
        </div>
    );
}
