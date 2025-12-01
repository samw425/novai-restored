'use client';

import { useEffect, useState } from 'react';
import { fetchArticles } from '@/lib/api';
import { Zap } from 'lucide-react';

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
        <div className="w-full bg-gray-950/80 backdrop-blur-md border-b border-white/10 hidden md:flex items-center h-10 relative z-40 overflow-hidden">
            {/* Label */}
            <div className="h-full px-4 flex items-center gap-2 z-20 shrink-0 bg-gray-950/50 backdrop-blur-xl border-r border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <div className="relative">
                    <Zap className="h-3.5 w-3.5 text-blue-400 fill-blue-400 animate-pulse" />
                    <div className="absolute inset-0 blur-sm bg-blue-400/50 animate-pulse"></div>
                </div>
                <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-widest uppercase">
                    Live Wire
                </span>
            </div>

            {/* Ticker Content */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center mask-linear-fade">
                <div className="animate-ticker whitespace-nowrap flex items-center gap-12 absolute pl-4">
                    {/* Duplicate list for seamless loop */}
                    {[...headlines, ...headlines].map((headline, i) => (
                        <span key={i} className="text-xs font-medium text-gray-300 flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                            <span className="w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                            {headline}
                        </span>
                    ))}
                </div>
            </div>

            {/* Gradient Masks */}
            <div className="absolute left-[120px] top-0 bottom-0 w-12 bg-gradient-to-r from-gray-950/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-950/80 to-transparent z-10 pointer-events-none"></div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 80s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
