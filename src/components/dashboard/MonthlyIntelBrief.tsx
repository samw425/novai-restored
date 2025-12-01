'use client';

import { Article } from '@/types';
import { ShieldAlert } from 'lucide-react';
import { FeedCard } from '@/components/feed/FeedCard';

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
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {majorUpdates.length} REPORTS
                </span>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                {majorUpdates.map((article) => (
                    <FeedCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
