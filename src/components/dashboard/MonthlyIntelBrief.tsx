'use client';

import { Article } from '@/types';
import { Calendar, Star, ArrowRight, ShieldAlert } from 'lucide-react';

interface MonthlyIntelBriefProps {
    articles: Article[];
    fullView?: boolean;
}

export function MonthlyIntelBrief({ articles, fullView = false }: MonthlyIntelBriefProps) {
    // Filter for high priority items from the last 30 days
    const limit = fullView ? 24 : 3;

    const majorUpdates = articles
        .filter(a => a.category !== 'market' && (a.description?.length || 0) > 50)
        .slice(0, limit);

    if (majorUpdates.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500 font-mono text-sm">No major intelligence briefings available for this period.</p>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                        {fullView ? 'Intelligence Briefing Archive (30 Days)' : '30-Day Intel Brief'}
                    </h3>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {majorUpdates.length} REPORTS
                </span>
            </div>

            <div className={`grid gap-4 ${fullView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
                {majorUpdates.map((article) => (
                    <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/0 group-hover:bg-blue-500 transition-all"></div>

                        <div className="flex items-start justify-between mb-3">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            <span className="text-[10px] font-mono text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded">{article.source}</span>
                        </div>

                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-3 line-clamp-3 flex-1">
                            {article.title}
                        </h4>

                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
                            {article.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            <span className="text-[10px] text-gray-400 font-medium">{new Date(article.publishedAt).toLocaleDateString()}</span>
                            <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
