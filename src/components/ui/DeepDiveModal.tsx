'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, ArrowRight, Globe, Zap, Shield } from 'lucide-react';

interface DeepDiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    term: string;
}

export function DeepDiveModal({ isOpen, onClose, term }: DeepDiveModalProps) {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        if (isOpen && term) {
            setLoading(true);
            // Simulate AI generation
            setTimeout(() => {
                setContent({
                    definition: `A strategic analysis of ${term} reveals significant implications for global stability and market dynamics.`,
                    context: "This development is not isolated. It connects to broader trends in geopolitical shifting alliances and technological sovereignty.",
                    implications: [
                        "Immediate impact on supply chain resilience.",
                        "Long-term shift in regulatory frameworks.",
                        "Potential for increased volatility in related sectors."
                    ],
                    related: ["Semiconductor Trade War", "AI Safety Protocols", "Energy Independence"]
                });
                setLoading(false);
            }, 1500);
        }
    }, [isOpen, term]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                Deep Dive Analysis
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                                AI-GENERATED CONTEXT
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{term}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    {loading ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="space-y-3 pt-4">
                                <div className="h-20 bg-gray-100 rounded-xl"></div>
                                <div className="h-20 bg-gray-100 rounded-xl"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Definition / Core Analysis */}
                            <div className="prose prose-indigo">
                                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                    {content.definition}
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    {content.context}
                                </p>
                            </div>

                            {/* Key Implications Grid */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Strategic Implications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {content.implications.map((imp: string, i: number) => (
                                        <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-xs font-bold text-indigo-600 border border-gray-100">
                                                {i + 1}
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium">
                                                {imp}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Related Intelligence */}
                            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-indigo-600" />
                                    Connected Intelligence
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {content.related.map((tag: string, i: number) => (
                                        <button key={i} className="px-3 py-1.5 bg-white text-indigo-700 text-xs font-semibold rounded-lg shadow-sm border border-indigo-100 hover:border-indigo-300 transition-colors flex items-center gap-1">
                                            {tag}
                                            <ArrowRight className="w-3 h-3 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        <span>Novai Intelligence Engine v2.4</span>
                    </div>
                    <span>Confidence Score: 94%</span>
                </div>
            </div>
        </div>
    );
}
