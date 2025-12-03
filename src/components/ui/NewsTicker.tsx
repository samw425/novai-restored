'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export function NewsTicker() {
    const headlines = [
        "OpenAI releases GPT-5 preview to select partners",
        "NVIDIA announces Blackwell B200 availability",
        "Anthropic Claude 3.5 Opus tops coding benchmarks",
        "Tesla Optimus Gen 3 demonstrates autonomous assembly",
        "Google DeepMind solves new protein folding challenge",
        "Meta releases Llama 4 100B open source model",
        "Apple integrates Gemini into iOS 19 core",
        "SpaceX Starship achieves orbit with full payload",
        "Microsoft AI CEO announces new safety protocols"
    ];

    return (
        <div className="w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 text-white overflow-hidden h-10 flex items-center relative z-50">
            {/* Label */}
            <div className="bg-blue-600 h-full px-4 flex items-center gap-2 font-bold text-xs uppercase tracking-wider shrink-0 z-10 shadow-lg shadow-blue-900/20">
                <Zap size={12} className="fill-white animate-pulse" />
                Live Wire
            </div>

            {/* Ticker Content */}
            <div className="flex-1 overflow-hidden relative flex items-center">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-12 px-4">
                    {headlines.map((headline, i) => (
                        <span key={i} className="text-xs font-medium text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                            {headline}
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {headlines.map((headline, i) => (
                        <span key={`dup-${i}`} className="text-xs font-medium text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></span>
                            {headline}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
