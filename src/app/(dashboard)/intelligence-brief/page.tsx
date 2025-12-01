'use client';

import { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertCircle, TrendingUp, Shield, Clock, Download } from 'lucide-react';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { SentimentGauge } from '@/components/ui/SentimentGauge';
import { KeywordCloud } from '@/components/ui/KeywordCloud';
import { DeepDiveModal } from '@/components/ui/DeepDiveModal';
import { WaitlistModal } from '@/components/ui/WaitlistModal';
import { PageHeader } from '@/components/ui/PageHeader';

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

    // Construct the brief text for audio
    const briefText = themes.length > 0
        ? `Here is your intelligence brief for ${today}. ${themes.map(t => `${t.title}. ${t.synthesis}`).join(' ')}`
        : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    LIVE SYNTHESIS
                                </span>
                                {generatedAt && (
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Updated {new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            <PageHeader
                                title="Intelligence Brief"
                                description="AI-synthesized analysis from 70+ global sources."
                                insight="This isn't just news aggregation. Our AI connects the dots to explain NOT just what happened, but why it matters."
                                icon={<Brain className="w-8 h-8 text-indigo-600" />}
                            />
                        </div>
                    </div>

                    {/* Visual Synthesis Section */}
                    {!loading && themes.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <SentimentGauge value={globalSentiment} label="Global Stability Index" />
                            <div onClick={() => setSelectedTerm("Global Intelligence Trends")} className="cursor-pointer">
                                <KeywordCloud keywords={topKeywords} />
                            </div>
                            <div className="p-4 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl text-white flex flex-col justify-center shadow-lg transform hover:scale-[1.02] transition-transform cursor-default border border-indigo-700/50 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>

                                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1 relative z-10">Active Sensors</span>
                                <div className="flex items-baseline gap-1 relative z-10">
                                    <span className="text-4xl font-black text-white tracking-tight">{articleCount}</span>
                                    <span className="text-xs font-bold text-blue-400">SOURCES</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 relative z-10">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-mono text-emerald-400">SYSTEM ONLINE</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
                        <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <h2 className="font-bold text-lg mb-1">What makes this different?</h2>
                                <p className="text-indigo-100 text-sm leading-relaxed">
                                    This isn't just news aggregation. Our AI analyzes patterns across <span className="font-bold text-white">70+ global sources</span>,
                                    connects the dots, and explains <span className="font-bold text-white">what it means</span> and
                                    <span className="font-bold text-white"> why it matters</span> for your work.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {loading ? (
                    <ResourceLoader message="Synthesizing daily intelligence brief..." />
                ) : themes.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No intelligence themes detected in the last 24 hours.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {themes.map((theme, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Theme Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                                {theme.title}
                                            </h2>
                                            <p className="text-sm text-gray-600">{theme.articles.length} sources analyzed</p>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getConfidenceColor(theme.confidence)}`}>
                                            {theme.confidence}% CONFIDENCE
                                        </div>
                                    </div>
                                </div>

                                {/* Synthesis */}
                                <div className="p-6 border-b border-gray-100 bg-indigo-50/30">
                                    <div className="flex gap-3">
                                        <Brain className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">AI Synthesis</h3>
                                            <p className="text-gray-800 leading-relaxed text-base">
                                                {theme.synthesis}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Implications */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex gap-3">
                                        <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-3">Key Implications</h3>
                                            <ul className="space-y-2">
                                                {theme.implications.map((imp, j) => (
                                                    <li key={j} className="flex gap-2 text-sm text-gray-700">
                                                        <span className="text-purple-600 font-bold">•</span>
                                                        <span>{imp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Source Articles */}
                                <div className="p-6 bg-gray-50">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Supporting Evidence</h3>
                                    <div className="space-y-2">
                                        {theme.articles.map((article, j) => (
                                            <a
                                                key={j}
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
                                                            {article.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mt-1">{article.source}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-400 flex-shrink-0">
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
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                COMING SOON
                            </div>
                            <Download className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <h3 className="text-xl font-bold mb-2">Novai Pro Intelligence</h3>
                            <p className="text-indigo-100 mb-4 max-w-md mx-auto">
                                Deeper synthesis, PDF exports, and personalized intelligence tracking are currently in development.
                            </p>
                            <button
                                onClick={() => setIsWaitlistOpen(true)}
                                className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
                            >
                                Join Waitlist
                            </button>
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
