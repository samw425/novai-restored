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
        <article className="group relative">
            {/* Hover Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-purple-50/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

            {/* Card - More Premium */}
            <div className="relative bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5">

                {/* Meta Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                            {article.source}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-sm text-gray-400 font-medium">
                            {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : 'Just now'} ago
                        </span>
                    </div>

                    {/* LIVE Badge */}
                    {isLive && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-black tracking-wider uppercase rounded-full shadow-lg">
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                            </span>
                            LIVE
                        </div>
                    )}
                </div>

                {/* Title - Bigger, Bolder */}
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-5 group/title"
                >
                    <h3 className="text-3xl font-black text-gray-900 leading-tight tracking-tight mb-4 group-hover/title:text-blue-600 transition-colors duration-200">
                        {article.title}
                    </h3>
                </a>

                {/* Summary */}
                <p className="text-lg text-gray-600 leading-relaxed mb-8 line-clamp-3">
                    {article.summary}
                </p>

                {/* Related Links */}
                {article.relatedLinks && article.relatedLinks.length > 0 && (
                    <div className="mb-8 pt-8 border-t border-gray-100">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">
                            Related Intelligence
                        </span>
                        <div className="space-y-3">
                            {article.relatedLinks?.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 text-base font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200 group/link"
                                >
                                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover/link:scale-125 transition-transform" />
                                    <span className="group-hover/link:underline underline-offset-4">{link.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                    <div className="flex gap-2">
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full uppercase tracking-wider">
                            {article.category}
                        </span>
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
                            #{article.topicSlug}
                        </span>
                    </div>

                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-base font-black text-gray-900 hover:text-blue-600 transition-colors duration-200 group/read"
                    >
                        <span>Read Full Article</span>
                        <ArrowUpRight size={16} className="group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 transition-transform duration-200" strokeWidth={3} />
                    </a>
                </div>
            </div>
        </article>
    );
}
