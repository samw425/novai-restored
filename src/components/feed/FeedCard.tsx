'use client';

import React, { useState } from 'react';
import { Article } from '@/types';
import { Clock, ExternalLink, Share2, Bookmark, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedCardProps {
    article: Article;
}

export function FeedCard({ article }: FeedCardProps) {
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Use window.location.origin to ensure the link works in Preview, Dev, and Production environments automatically
    // Default fallback is the live site
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/article/${article.id}`
        : `https://gonovai.vercel.app/article/${article.id}`;

    const isInsider = ['CIA', 'Mossad', 'FSB', 'IDF', 'State Dept', 'TASS', 'US-CERT', 'CISA', 'MI6', 'FBI', 'DHS', 'Shin Bet', 'Times of Israel', 'JPost', 'Jerusalem Post'].some(s => article.source.includes(s));

    // Show LIVE badge for articles from last 2 hours
    const isLive = new Date(article.publishedAt).getTime() > Date.now() - 1000 * 60 * 120; // 2 hours

    return (
        <article className="group relative py-8 first:pt-0 border-b border-gray-100 last:border-0">
            <div className="relative bg-transparent transition-all duration-300">

                {/* Meta Bar */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            {article.source}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                            {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : 'Just now'} ago
                        </span>
                    </div>

                    {/* Badges Container */}
                    <div className="flex items-center gap-3">
                        {/* Impact Score Badge - Only show for high impact */}
                        {article.score && article.score >= 8 && (
                            <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2 py-0.5 rounded-full">
                                <span className="text-[10px] font-bold tracking-wider">IMPACT</span>
                                <span className={`text-[10px] font-black ${article.score >= 9 ? 'text-red-400' : 'text-amber-400'}`}>
                                    {article.score}/10
                                </span>
                            </div>
                        )}

                        {/* LIVE Badge */}
                        {isLive && (
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                </span>
                                <span className="text-[10px] font-bold text-red-600 tracking-widest uppercase">LIVE</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-3 group/title"
                >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-[1.1] tracking-tight group-hover/title:text-blue-600 transition-colors duration-200">
                        {article.title}
                    </h3>
                </a>

                {/* Summary */}
                <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-6 line-clamp-3 font-medium max-w-3xl">
                    {article.summary}
                </p>

                {/* Footer / Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {article.category}
                        </span>
                    </div>

                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors duration-200 group/read"
                    >
                        <span>Read Source</span>
                        <ArrowUpRight size={14} className="group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 transition-transform duration-200" strokeWidth={2.5} />
                    </a>
                </div>
            </div>
        </article>
    );
}
