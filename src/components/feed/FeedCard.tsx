'use client';

import React, { useState } from 'react';
import { Article } from '@/types';
import { Clock, ExternalLink, Share2, Bookmark } from 'lucide-react';
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
        <article className="group relative">
            {/* Hover Glow Effect */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-purple-50/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10" />

            {/* Card */}
            <div className="relative bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:-translate-y-1">

                {/* LIVE Indicator with stronger pulse */}
                {isLive && (
                    <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-lg shadow-red-500/30">
                        <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        Live
                    </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-900 tracking-wide uppercase">
                            {article.source}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-xs text-gray-400 font-medium">
                            {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : 'Just now'} ago
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all duration-200"
                            aria-label="Bookmark"
                        >
                            <Bookmark size={16} strokeWidth={2} />
                        </button>
                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all duration-200"
                            aria-label="Share"
                        >
                            <Share2 size={16} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Title */}
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-4 group/title"
                >
                    <h3 className="text-2xl font-bold text-gray-900 leading-[1.2] tracking-tight mb-3 group-hover/title:text-blue-600 transition-colors duration-300">
                        {article.title}
                    </h3>
                </a>

                {/* Summary */}
                <p className="text-base text-gray-600 leading-relaxed mb-6 line-clamp-2">
                    {article.summary}
                </p>

                {/* Deep Dive */}
                {article.relatedLinks && article.relatedLinks.length > 0 && (
                    <div className="mb-6 pt-6 border-t border-gray-50">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">
                            Related Intelligence
                        </span>
                        <div className="space-y-2">
                            {article.relatedLinks?.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 group/link"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/link:scale-125 transition-transform" />
                                    <span className="group-hover/link:underline underline-offset-2">{link.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex gap-2">
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full uppercase tracking-wide">
                            {article.category}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                            #{article.topicSlug}
                        </span>
                    </div>

                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 group/read"
                    >
                        <span>Read</span>
                        <ExternalLink size={14} className="group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 transition-transform duration-200" strokeWidth={2.5} />
                    </a>
                </div>
            </div>
        </article>
    );
}
