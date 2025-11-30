'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Globe, FileText, Cpu, ShieldAlert, TrendingUp, Bot, Scale, Hexagon } from 'lucide-react';
import { Article, Category } from '@/types';

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

export function ArticleCard({ article }: { article: Article }) {
    const Icon = categoryIcons[article.category as Category] || Globe;
    const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

    return (
        <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
        >
            <article className="bg-white rounded-xl border border-[#E5E7EB] p-5 transition-all duration-200 hover:shadow-md hover:border-blue-200 relative overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {article.source}
                        </span>
                        <span>•</span>
                        <span>{timeAgo}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${categoryColors[article.category as Category] || 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                        {article.category}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-[#0F172A] mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                    {article.summary}
                </p>

                {article.topicSlug && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            #{article.topicSlug}
                        </span>
                    </div>
                )}
            </article>
        </Link>
    );
}
