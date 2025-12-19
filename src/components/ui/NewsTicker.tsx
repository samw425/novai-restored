import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { fetchArticles } from '@/lib/api';

export function NewsTicker() {
    const [headlines, setHeadlines] = useState<string[]>([
        "Initializing global intelligence streams...",
        "Connecting to secure uplinks...",
        "Decrypting real-time signals..."
    ]);

    useEffect(() => {
        const loadHeadlines = async () => {
            try {
                const articles = await fetchArticles(15);
                if (articles && articles.length > 0) {
                    setHeadlines(articles.map(a => a.title));
                }
            } catch (error) {
                console.error('Failed to load ticker headlines', error);
            }
        };
        loadHeadlines();
        // Refresh every minute
        const interval = setInterval(loadHeadlines, 300000); // Poll every 5 min (was 60s)
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 text-white overflow-hidden h-10 flex items-center relative z-[110] fixed top-0 left-0 right-0">
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
