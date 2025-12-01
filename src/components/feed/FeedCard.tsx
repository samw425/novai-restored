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

    return (
        <>
            <article className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group transform hover:-translate-y-[2px]">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {article.source}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {/* Handle potential date parsing errors safely */}
                            {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : 'Just now'} ago
                        </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900"><Bookmark size={16} /></button>
                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Title is now a Real Link */}
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group-hover:text-blue-600 transition-colors"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight flex items-start gap-2">
                        {article.title}
                        <ExternalLink size={14} className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                    </h3>
                </a>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {article.summary}
                </p>

                {article.relatedLinks && article.relatedLinks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Deep Dive</span>
                        <div className="space-y-1">
                            {article.relatedLinks.map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                                    <ExternalLink size={10} />
                                    {link.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Similarity Tags */}
                <div className="mt-4 flex gap-2">
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        #{article.topicSlug}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {article.category}
                    </span>
                </div>
            </article>
        </>
    );
}
