'use client';

import { useEffect, useState } from 'react';
import { fetchArticles } from '@/lib/api';
import { Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface TickerArticle {
    title: string;
    link: string;
    source: string;
}

export function LiveTicker() {
    const [articles, setArticles] = useState<TickerArticle[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const loadHeadlines = async () => {
            try {
                const data = await fetchArticles(15);
                setArticles(data.slice(0, 15).map(a => ({
                    title: a.title,
                    link: a.url || '#', // Corrected from .link to .url
                    source: a.source
                })));
            } catch (error) {
                console.error('Failed to load ticker headlines', error);
            }
        };
        loadHeadlines();
    }, []);

    if (articles.length === 0) return null;

    // Duplicate list for seamless infinite loop (x3 to be safe on wide screens)
    const tickerContent = [...articles, ...articles, ...articles];

    return (
        <div className="w-full bg-slate-50 border-b border-slate-200 hidden md:flex items-center h-10 relative overflow-hidden group">
            {/* Label */}
            <div className="h-full px-5 flex items-center gap-2.5 z-20 shrink-0 bg-white border-r border-slate-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                    <Radio className="h-4 w-4 text-red-600 relative z-10" />
                </div>
                <span className="text-[11px] font-black text-slate-900 tracking-[0.2em] uppercase font-mono">
                    Live Wire
                </span>
            </div>

            {/* Ticker Content */}
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <div className="animate-ticker whitespace-nowrap flex items-center gap-12 pl-4">
                    {tickerContent.map((article, i) => (
                        <Link
                            key={i}
                            href={article.link}
                            target="_blank"
                            className="flex items-center gap-3 group/item transition-opacity hover:opacity-100 opacity-80"
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{article.source}</span>
                            <motion.span
                                whileHover={{ color: '#2563eb' }}
                                className="text-xs font-semibold text-slate-700 transition-colors"
                            >
                                {article.title}
                            </motion.span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Premium Gradient Masks */}
            <div className="absolute left-[120px] top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-ticker {
                    animation: ticker 60s linear infinite;
                }
                .group:hover .animate-ticker {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
