'use client';

import { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertCircle, TrendingUp, Shield, Clock, Download, FileText, ExternalLink, Activity, Globe } from 'lucide-react';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { SentimentGauge } from '@/components/ui/SentimentGauge';
import { KeywordCloud } from '@/components/ui/KeywordCloud';
import { DeepDiveModal } from '@/components/ui/DeepDiveModal';
import { WaitlistModal } from '@/components/ui/WaitlistModal';
import { PremiumGlobe } from '@/components/ui/PremiumGlobe';

interface Theme {
    title: string;
    articles: any[];
    synthesis: string;
    implications: string[];
    confidence: number;
}

export default function IntelligenceBriefPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [globalSentiment, setGlobalSentiment] = useState(50);
    const [topKeywords, setTopKeywords] = useState<any[]>([]);
    const [articleCount, setArticleCount] = useState(0);
    const [executiveSummary, setExecutiveSummary] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
    const [generatedAt, setGeneratedAt] = useState<string>('');
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    useEffect(() => {
        fetchBrief();
    }, []);

    const fetchBrief = async () => {
        try {
            const response = await fetch('/api/intelligence/synthesize');
            const data = await response.json();
            setThemes(data.themes || []);
            setGlobalSentiment(data.globalSentiment || 50);
            setTopKeywords(data.topKeywords || []);
            setArticleCount(data.articleCount || 0);
            setExecutiveSummary(data.executiveSummary || '');
            setGeneratedAt(data.generatedAt || new Date().toISOString());
        } catch (error) {
            console.error('Failed to fetch intelligence brief:', error);
        } finally {
            setLoading(false);
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (confidence >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    return (
        <div className="space-y-12">
            {/* Hero Section - Apple/Nike Minimalist Style */}
            <div className="relative pt-12 pb-12 md:pt-20 md:pb-16 overflow-hidden">
                <div className="space-y-8 max-w-5xl mx-auto text-center px-4 relative z-10">
                    {/* Globe */}
                    <div className="w-full h-[180px] md:h-[240px] flex items-center justify-center mb-8 opacity-90">
                        <PremiumGlobe />
                    </div>

                    {/* Header */}
                    <div className="space-y-6 relative z-10">
                        <h1 className="text-6xl md:text-8xl font-sans font-extrabold text-slate-900 tracking-tighter leading-[0.9]">
                            Daily Briefing.
                            <br />
                            <span className="text-slate-900">State of the System.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed font-sans tracking-tight">
                            {today}
                        </p>
                    </div>

                    {/* Executive Summary Card */}
                    {!loading && executiveSummary && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden text-left max-w-4xl mx-auto mt-12">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="flex gap-5 relative z-10">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm ring-4 ring-slate-50">
                                        <FileText className="w-6 h-6 text-white" strokeWidth={2} />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                            EXECUTIVE SUMMARY
                                        </h3>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                        </span>
                                    </div>
                                    <div className="text-slate-900 leading-relaxed text-lg font-medium whitespace-pre-line space-y-4">
                                        {executiveSummary.split('**').map((part, i) =>
                                            i % 2 === 1 ? <span key={i} className="font-black text-slate-800 block mt-6 mb-2 text-sm uppercase tracking-widest">{part}</span> : part
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {loading ? (
                    <ResourceLoader message="Synthesizing daily intelligence brief..." />
                ) : themes.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">No intelligence themes detected in the last 24 hours.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {themes.map((theme, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                {/* Theme Header */}
                                <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                                {theme.title}
                                            </h2>
                                            <p className="text-sm text-slate-500">{theme.articles.length} sources analyzed</p>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getConfidenceColor(theme.confidence)}`}>
                                            {theme.confidence}% CONFIDENCE
                                        </div>
                                    </div>
                                </div>

                                {/* Synthesis */}
                                <div className="p-6 border-b border-slate-100">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 mt-1">
                                            <Brain className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Synthesis</h3>
                                            <p className="text-slate-800 leading-relaxed text-base">
                                                {theme.synthesis}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Implications */}
                                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 mt-1">
                                            <Shield className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Implications</h3>
                                            <ul className="space-y-2">
                                                {theme.implications.map((imp, j) => (
                                                    <li key={j} className="flex gap-2 text-sm text-slate-700">
                                                        <span className="text-purple-600 font-bold">•</span>
                                                        <span>{imp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Source Articles */}
                                <div className="p-6 bg-slate-50">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <ExternalLink className="w-3 h-3" />
                                        Most Important Links
                                    </h3>
                                    <div className="space-y-2">
                                        {theme.articles.map((article, j) => (
                                            <a
                                                key={j}
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group/link"
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-bold text-slate-900 group-hover/link:text-blue-600 transition-colors line-clamp-2">
                                                            {article.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 mt-1">{article.source}</p>
                                                    </div>
                                                    <span className="text-xs text-slate-400 flex-shrink-0">
                                                        {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Upgrade CTA */}
                        <div className="bg-slate-900 rounded-2xl p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-4">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    COMING SOON
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Novai Pro Intelligence</h3>
                                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                                    Deeper synthesis, PDF exports, and personalized intelligence tracking are currently in development.
                                </p>
                                <button
                                    onClick={() => setIsWaitlistOpen(true)}
                                    className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                                >
                                    Join Waitlist
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DeepDiveModal
                isOpen={!!selectedTerm}
                onClose={() => setSelectedTerm(null)}
                term={selectedTerm || ''}
            />

            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                source="Intelligence Brief Page"
            />
        </div>
    );
}
