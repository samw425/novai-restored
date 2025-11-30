'use client';

import { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, AlertCircle, Download, Loader2, Shield } from 'lucide-react';

interface Theme {
    title: string;
    articles: any[];
    synthesis: string;
    implications: string[];
    confidence: number;
}

export default function IntelligenceBriefPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatedAt, setGeneratedAt] = useState<string>('');
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        fetchBrief();
    }, []);

    const fetchBrief = async () => {
        try {
            const response = await fetch('/api/intelligence/synthesize');
            const data = await response.json();
            setThemes(data.themes || []);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Intelligence Brief</h1>
                                    <p className="text-sm text-indigo-600 font-semibold mt-0.5">AI-Synthesized Insights</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg">{today}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                                </span>
                                <span className="text-xs font-bold text-indigo-700">LIVE SYNTHESIS</span>
                            </div>
                            {generatedAt && (
                                <span className="text-xs text-gray-500">
                                    Updated {new Date(generatedAt).toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </div>

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
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="animate-spin text-indigo-600 h-12 w-12 mb-4" />
                        <p className="text-gray-500 font-medium">Analyzing intelligence signals...</p>
                    </div>
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
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                            <Download className="h-10 w-10 mx-auto mb-3 opacity-90" />
                            <h3 className="text-xl font-bold mb-2">Want the full analysis?</h3>
                            <p className="text-indigo-100 mb-4 max-w-md mx-auto">
                                Upgrade to Pro for PDF exports, deeper synthesis, and personalized intelligence tracking.
                            </p>
                            <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
