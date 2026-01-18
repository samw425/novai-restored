import React from 'react';
import type { ContentItem } from '../../lib/api';
import { ContentCard } from './ContentCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContentRailProps {
    title: string;
    subtitle?: string;
    items: ContentItem[];
    linkTo?: string;
    isLoading?: boolean;
}

export const ContentRail: React.FC<ContentRailProps> = ({
    title,
    subtitle,
    items,
    linkTo,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <section className="py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-7 w-48 bg-white/10 rounded-lg animate-pulse" />
                        {subtitle && <div className="h-4 w-64 bg-white/5 rounded mt-2 animate-pulse" />}
                    </div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-44 flex-shrink-0">
                            <div className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse" />
                            <div className="mt-3 h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!items.length) return null;

    return (
        <section className="py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                    {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
                </div>
                {linkTo && (
                    <Link
                        to={linkTo}
                        className="flex items-center gap-1 text-sm font-semibold text-vue-green hover:underline"
                    >
                        See All <ChevronRight size={16} />
                    </Link>
                )}
            </div>

            {/* Scrollable rail */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {items.slice(0, 10).map((item) => (
                    <ContentCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default ContentRail;
