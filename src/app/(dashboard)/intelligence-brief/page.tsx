'use client';

import { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertCircle, TrendingUp, Shield, FileText, ExternalLink, ArrowRight } from 'lucide-react';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { PageHeader } from '@/components/ui/PageHeader';
import { DeepDiveModal } from '@/components/ui/DeepDiveModal';
import { WaitlistModal } from '@/components/ui/WaitlistModal';
import { DailyBrief } from '@/lib/data/daily-briefs';

interface Theme {
    title: string;
    articles: any[];
    synthesis: string;
    implications: string[];
    confidence: number;
}

export default function IntelligenceBriefPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch with resilience: Brief (Pipeline A) + Themes (Pipeline B)
                const [briefResult, themesResult] = await Promise.allSettled([
                    fetch('/api/brief'),
                    fetch('/api/intelligence/synthesize')
                ]);

                // Handle Brief Result
                if (briefResult.status === 'fulfilled') {
                    const briefData = await briefResult.value.json();
                    if (briefData.brief) setDailyBrief(briefData.brief);
                } else {
                    console.error('Failed to fetch daily brief:', briefResult.reason);
                }

                // Handle Themes Result
                if (themesResult.status === 'fulfilled') {
                    const themesData = await themesResult.value.json();
                    if (themesData.themes) setThemes(themesData.themes);
                } else {
                    console.error('Failed to fetch themes:', themesResult.reason);
                }

            } catch (error) {
                console.error('Failed to fetch intelligence:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (confidence >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <PageHeader
                    title="Daily Briefing."
                    description={today}
                    insight="Executive Intelligence Summary. The complete 4-point Executive Brief and thematic deep dives for strategic alignment."
                    icon={<Brain className="w-8 h-8 text-blue-600" />}
                />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {loading ? (
                    <ResourceLoader message="Synthesizing daily intelligence brief..." />
                ) : (
                    <div className="space-y-12 animate-in fade-in duration-500">

                        {/* 1. THE MORNING PROTOCOL (Primary Brief) */}
                        {dailyBrief && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                                    <div className="p-2 bg-slate-900 rounded-lg">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">{dailyBrief.headline}</h2>
                                        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">{dailyBrief.clearanceLevel}</div>
                                    </div>
                                </div>

                                {/* Single Column "Report" Layout */}
                                <div className="max-w-3xl mx-auto space-y-16">
                                    {dailyBrief.items.map((item, index) => (
                                        <div key={item.id} className="group relative">
                                            {/* Connector Line (except for last item) */}
                                            {index !== dailyBrief.items.length - 1 && (
                                                <div className="absolute left-[11px] top-12 bottom-[-64px] w-[2px] bg-slate-100 group-hover:bg-blue-50 transition-colors" />
                                            )}

                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block pl-10 relative"
                                            >
                                                {/* Status Dot */}
                                                <div className={`absolute left-0 top-2 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${item.impact === 'CRITICAL' ? 'bg-red-500' :
                                                        item.impact === 'SEVERE' ? 'bg-orange-500' :
                                                            item.impact === 'HIGH' ? 'bg-blue-500' : 'bg-slate-400'
                                                    }`}>
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
                                                </div>

                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-300">|</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                        Source: {item.source || 'INTEL WIRE'}
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight">
                                                    {item.title}
                                                </h3>

                                                <p className="text-slate-600 leading-relaxed text-lg border-l-2 border-slate-100 pl-6 group-hover:border-blue-200 transition-colors">
                                                    {item.summary}
                                                </p>

                                                <div className="mt-4 pl-6 flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                                                    Read Full Source <ExternalLink className="w-4 h-4" />
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. THEMATIC DEEP DIVES (Secondary) */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="h-5 w-5 text-slate-400" />
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Thematic Deep Dives
                                </h3>
                            </div>

                            <div className="space-y-8">
                                {themes.map((theme, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                        <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                                                        {theme.title}
                                                    </h2>
                                                    <p className="text-sm text-slate-500">{theme.articles.length} sources analyzed</p>
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getConfidenceColor(theme.confidence)}`}>
                                                    {theme.confidence}% CONFIDENCE
                                                </div>
                                            </div>
                                        </div>

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
                                                                {new Date(article.publishedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upgrade CTA */}
                        <div className="bg-slate-900 rounded-2xl p-8 text-white text-center relative overflow-hidden mt-8">
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
