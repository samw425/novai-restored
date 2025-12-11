'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types';
import { Clock, ExternalLink, Share2, Bookmark, ArrowUpRight, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface FeedCardProps {
    article: Article;
    isNew?: boolean; // For highlighting newly arrived articles
}

export function FeedCard({ article, isNew = false }: FeedCardProps) {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [timeAgo, setTimeAgo] = useState('');

    // Real-time timestamp updates
    useEffect(() => {
        const updateTime = () => {
            setTimeAgo(article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt)) : 'Just now');
        };
        updateTime();
        const interval = setInterval(updateTime, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [article.publishedAt]);

    // Use window.location.origin to ensure the link works in Preview, Dev, and Production environments automatically
    // Default fallback is the live site
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/article/${article.id}`
        : `https://gonovai.vercel.app/article/${article.id}`;

    const isInsider = ['CIA', 'Mossad', 'FSB', 'IDF', 'State Dept', 'TASS', 'US-CERT', 'CISA', 'MI6', 'FBI', 'DHS', 'Shin Bet', 'Times of Israel', 'JPost', 'Jerusalem Post'].some(s => article.source.includes(s));

    // Show LIVE badge for articles from last 2 hours
    const isLive = new Date(article.publishedAt).getTime() > Date.now() - 1000 * 60 * 120; // 2 hours

    // Breaking news for very recent high-impact stories
    const isBreaking = isLive && article.importanceScore && article.importanceScore >= 9;

    return (
        <motion.article
            className={`group relative py-8 first:pt-0 border-b border-gray-100 last:border-0 transition-all duration-300 ${isNew ? 'bg-blue-50/50' : ''}`}
            whileHover={{
                x: 4,
                transition: { duration: 0.2, ease: 'easeOut' }
            }}
        >
            {/* New article glow indicator */}
            {isNew && (
                <motion.div
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-400 rounded-full"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Breaking news flash effect */}
            {isBreaking && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 rounded-lg pointer-events-none"
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            )}

            <div className="relative bg-transparent transition-all duration-300">

                {/* Meta Bar */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <motion.span
                            className="text-xs font-bold text-slate-900 uppercase tracking-wider"
                            whileHover={{ scale: 1.02 }}
                        >
                            {article.source}
                        </motion.span>
                        <span className="text-xs text-slate-400 font-medium tabular-nums">
                            {timeAgo} ago
                        </span>
                    </div>

                    {/* Badges Container */}
                    <div className="flex items-center gap-3">
                        {/* Breaking Badge */}
                        {isBreaking && (
                            <motion.div
                                className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20"
                                animate={{ scale: [1, 1.03, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <Zap className="w-3 h-3" fill="currentColor" />
                                <span className="text-[10px] font-black tracking-wider">BREAKING</span>
                            </motion.div>
                        )}

                        {/* Impact Score Badge - Only show for high impact */}
                        {article.importanceScore && article.importanceScore >= 8 && !isBreaking && (
                            <motion.div
                                className="flex items-center gap-1.5 bg-slate-900 text-white px-2 py-0.5 rounded-full"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="text-[10px] font-bold tracking-wider">IMPACT</span>
                                <span className={`text-[10px] font-black ${article.importanceScore >= 9 ? 'text-red-400' : 'text-amber-400'}`}>
                                    {article.importanceScore}/10
                                </span>
                            </motion.div>
                        )}

                        {/* LIVE Badge */}
                        {isLive && !isBreaking && (
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
                    <motion.h3
                        className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-[1.1] tracking-tight group-hover/title:text-blue-600 transition-colors duration-200"
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.15 }}
                    >
                        {article.title}
                    </motion.h3>
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

                    <motion.a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors duration-200 group/read"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>Read Source</span>
                        <ArrowUpRight size={14} className="group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 transition-transform duration-200" strokeWidth={2.5} />
                    </motion.a>
                </div>
            </div>
        </motion.article>
    );
}
