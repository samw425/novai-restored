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
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Official Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <ShieldAlert className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
                            Intelligence Briefing
                        </h3>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                            30-Day Retrospective • Top Priority Items
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                            {majorUpdates.length} Reports
                        </span>
                    </div>
                    <div className="hidden sm:block text-[10px] font-mono text-slate-400">
                        CONFIDENTIAL // NOFORN
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div className="p-6 bg-slate-50/30">
                <div className="max-w-3xl mx-auto space-y-6">
                    {majorUpdates.map((article) => (
                        <FeedCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}
