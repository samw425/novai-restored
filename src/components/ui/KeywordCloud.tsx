'use client';

import React from 'react';

interface Keyword {
    text: string;
    weight: number; // 1-5 scale
}

interface KeywordCloudProps {
    keywords: Keyword[];
}

export function KeywordCloud({ keywords }: KeywordCloudProps) {
    // Sort by weight descending
    const sortedKeywords = [...keywords].sort((a, b) => b.weight - a.weight);

    const getSizeClass = (weight: number) => {
        switch (weight) {
            case 5: return 'text-lg font-black text-indigo-700';
            case 4: return 'text-base font-bold text-indigo-600';
            case 3: return 'text-sm font-semibold text-indigo-500';
            case 2: return 'text-xs font-medium text-indigo-400';
            default: return 'text-[10px] text-indigo-300';
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Dominant Themes</h3>
            <div className="flex flex-wrap gap-2 items-center justify-center min-h-[64px]">
                {sortedKeywords.map((kw, i) => (
                    <span
                        key={i}
                        className={`${getSizeClass(kw.weight)} transition-all hover:scale-110 cursor-default`}
                    >
                        {kw.text}
                    </span>
                ))}
            </div>
        </div>
    );
}
