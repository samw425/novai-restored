'use client';

import { Article } from '@/types';
import { Calendar, Star, ArrowRight, ShieldAlert } from 'lucide-react';

interface MonthlyIntelBriefProps {
    articles: Article[];
    fullView?: boolean;
    category?: string;
}

export function MonthlyIntelBrief({ articles, fullView = false, category }: MonthlyIntelBriefProps) {
    // Filter for high priority items from the last 30 days
    const limit = fullView ? 24 : 3;

    console.log(`MonthlyIntelBrief: Received ${articles.length} articles, filtering for category: "${category}"`);

    const majorUpdates = articles
        .filter(a => {
            // If category is specified and not 'all', filter by it
            if (category && a.category !== category) {
                return false;
            }
            // Must have a meaningful description
            return (a.description?.length || 0) > 50;
        })
        .slice(0, limit);

    console.log(`MonthlyIntelBrief: After filtering, ${majorUpdates.length} articles match category "${category}"`);

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

            <div className="max-w-3xl mx-auto space-y-4">
                {majorUpdates.map((article, index) => (
                    <div key={article.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group relative overflow-hidden">
                        {index < 3 && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10">
                                TOP STORY
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <Star className={`h-4 w-4 ${index < 3 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} flex-shrink-0`} />
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">{article.source}</span>
                                <span className="text-xs text-gray-400 font-mono">{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <ArrowRight className="h-5 w-5" />
                            </a>
                        </div>

                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-3 pr-8">
                            {article.title}
                        </h4>

                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {article.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
