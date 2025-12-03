'use client';

import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, LinkIcon, Eye, Loader2 } from 'lucide-react';

interface Synthesis {
    summary: string[];
    themes: string[];
    signalRating: number;
    signalExplanation: string;
    connections: string;
    predictions: string[];
}

interface AIBriefProps {
    className?: string;
}

export function AIBrief({ className = '' }: AIBriefProps) {
    const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('/api/synthesis')
            .then(res => res.json())
            .then(data => {
                setSynthesis(data.synthesis);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load AI synthesis:', err);
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={`bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/30 rounded-2xl p-8 ${className}`}>
                <div className="flex items-center justify-center gap-3 text-blue-300">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-mono text-sm">The Oracle is analyzing...</span>
                </div>
            </div>
        );
    }

    if (error || !synthesis) {
        return null;
    }

    // Signal rating color
    const getRatingColor = (rating: number) => {
        if (rating >= 8) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        if (rating >= 5) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
        return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    };

    return (
        <div className={`bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/30 rounded-2xl overflow-hidden ${className}`}>
            {/* Header */}
            <div className="px-8 py-6 border-b border-blue-800/30 bg-blue-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">The Oracle's Brief</h2>
                            <p className="text-sm text-blue-300/70 font-mono">AI-Synthesized Intelligence</p>
                        </div>
                    </div>

                    {/* Signal Rating */}
                    <div className={`px-4 py-2 rounded-xl border ${getRatingColor(synthesis.signalRating)} flex items-center gap-2`}>
                        <Eye className="w-4 h-4" />
                        <span className="font-mono font-bold">{synthesis.signalRating}/10</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
                {/* Executive Summary */}
                <div>
                    <h3 className="text-sm font-mono text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Why This Matters
                    </h3>
                    <ul className="space-y-2">
                        {synthesis.summary.map((point, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-blue-400 font-bold shrink-0 font-mono text-sm">→</span>
                                <span className="text-slate-200 text-sm leading-relaxed">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Key Themes */}
                {synthesis.themes && synthesis.themes.length > 0 && (
                    <div>
                        <h3 className="text-sm font-mono text-blue-300 uppercase tracking-wider mb-3">Key Themes</h3>
                        <div className="flex flex-wrap gap-2">
                            {synthesis.themes.map((theme, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-lg text-xs font-medium text-blue-200"
                                >
                                    {theme}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Signal Explanation */}
                <div className="border-t border-blue-800/30 pt-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="font-bold text-blue-300">Signal Rating: </span>
                        {synthesis.signalExplanation}
                    </p>
                </div>

                {/* Cross-Story Connections */}
                {synthesis.connections && (
                    <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                        <h3 className="text-sm font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Connections
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed">{synthesis.connections}</p>
                    </div>
                )}

                {/* Predictions */}
                {synthesis.predictions && synthesis.predictions.length > 0 && (
                    <div>
                        <h3 className="text-sm font-mono text-blue-300 uppercase tracking-wider mb-3">What to Watch</h3>
                        <ul className="space-y-2">
                            {synthesis.predictions.map((pred, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-emerald-400 font-bold shrink-0">▸</span>
                                    <span className="text-slate-200 text-sm">{pred}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer Badge */}
            <div className="px-8 py-4 bg-blue-900/10 border-t border-blue-800/30">
                <div className="flex items-center justify-between text-xs text-blue-300/60">
                    <span className="font-mono">Powered by GPT-4</span>
                    <span className="font-mono">Updates every 24h</span>
                </div>
            </div>
        </div>
    );
}
