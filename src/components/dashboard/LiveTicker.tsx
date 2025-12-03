'use client';

import { useEffect, useState } from 'react';
import { fetchArticles } from '@/lib/api';
import { Radio } from 'lucide-react';

export function LiveTicker() {
    const [headlines, setHeadlines] = useState<string[]>([]);

    useEffect(() => {
        const loadHeadlines = async () => {
            try {
                // Fetch latest 10 articles for the ticker
                const articles = await fetchArticles(10);
                setHeadlines(articles.map(a => a.title));
            } catch (error) {
                console.error('Failed to load ticker headlines', error);
            }
        };
        loadHeadlines();
    }, []);

    if (headlines.length === 0) return null;

    return (
        <div className="w-full bg-white border-b border-gray-200 hidden md:flex items-center h-9 relative overflow-hidden">
            {/* Label */}
            <div className="h-full px-4 flex items-center gap-2 z-20 shrink-0 bg-gray-50 border-r border-gray-200">
                <Radio className="h-3 w-3 text-red-600" />
                <span className="text-[10px] font-black text-gray-900 tracking-widest uppercase">
                    Live Wire
                </span>
            </div>

            {/* Ticker Content */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <div className="animate-ticker whitespace-nowrap flex items-center gap-8 absolute pl-4">
                    {/* Duplicate list for seamless loop */}
                    {[...headlines, ...headlines].map((headline, i) => (
                        <span key={i} className="text-xs font-medium text-gray-600 flex items-center gap-2.5 group cursor-pointer hover:text-gray-900 transition-colors">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            {headline}
                        </span>
                    ))}
                </div>
            </div>

            {/* Gradient Masks */}
            <div className="absolute left-[100px] top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 45s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
