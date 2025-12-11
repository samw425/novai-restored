'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Globe, FileText, Cpu, ShieldAlert, TrendingUp, Bot, Scale, Hexagon, ArrowUpRight } from 'lucide-react';
import { Article, Category } from '@/types';
import { motion } from 'framer-motion';

const categoryIcons: Record<Category, any> = {
    research: FileText,
    tools: Cpu,
    policy: Scale,
    market: TrendingUp,
    robotics: Bot,
    ai: Hexagon,
};

const categoryColors: Record<Category, string> = {
    research: 'bg-blue-50 text-blue-700 border-blue-100',
    tools: 'bg-purple-50 text-purple-700 border-purple-100',
    policy: 'bg-slate-50 text-slate-700 border-slate-100',
    market: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    robotics: 'bg-orange-50 text-orange-700 border-orange-100',
    ai: 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

interface ArticleCardProps {
    article: Article;
    index?: number; // For stagger animation
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
    const Icon = categoryIcons[article.category as Category] || Globe;
    const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

    // Check if article is from last 2 hours for "fresh" indicator
    const isFresh = new Date(article.publishedAt).getTime() > Date.now() - 1000 * 60 * 120;

    return (
        <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
        >
            <motion.article
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 transition-all duration-200 hover:shadow-lg hover:border-blue-200 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                    y: -2,
                    transition: { duration: 0.2, ease: 'easeOut' }
                }}
            >
                {/* Fresh article indicator pulse */}
                {isFresh && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                    />
                )}

                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <motion.span
                            className="font-semibold text-gray-900 flex items-center gap-1.5"
                            whileHover={{ scale: 1.02 }}
                        >
                            {article.source}
                        </motion.span>
                        <span>•</span>
                        <span className="tabular-nums">{timeAgo}</span>
                        {isFresh && (
                            <motion.span
                                className="flex items-center gap-1 text-blue-600 font-bold"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 + 0.3 }}
                            >
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                </span>
                                NEW
                            </motion.span>
                        )}
                    </div>

                    <motion.span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${categoryColors[article.category as Category] || 'bg-gray-50 text-gray-700 border-gray-100'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {article.category}
                    </motion.span>
                </div>

                <motion.h3
                    className="text-lg font-bold text-[#0F172A] mb-2 leading-tight group-hover:text-blue-600 transition-colors flex items-start gap-2"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                >
                    <span className="flex-1">{article.title}</span>
                    <ArrowUpRight
                        size={16}
                        className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"
                    />
                </motion.h3>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                    {article.summary}
                </p>

                {article.topicSlug && (
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                    >
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                            #{article.topicSlug}
                        </span>
                    </motion.div>
                )}
            </motion.article>
        </Link>
    );
}
