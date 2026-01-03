'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { FeedCard } from '@/components/feed/FeedCard';
import { Article } from '@/types';
import { Loader2, Radio } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

interface CategoryFeedProps {
    category: string;
    title?: string;
    description?: string;
    insight?: string;
    icon?: React.ReactNode;
    showHeader?: boolean;
    variant?: 'default' | 'minimal';
    className?: string;
}

export function CategoryFeed({
    category,
    title,
    description,
    insight,
    icon,
    showHeader = true,
    variant = 'default',
    className = ''
}: CategoryFeedProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { ref, inView } = useInView();

    // Initial load
    useEffect(() => {
        const fetchCategoryFeed = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/feed/live?category=${category}&limit=20&page=1`, {
                    cache: 'no-store'
                });
                const data = await response.json();
                setArticles(data.articles || []);
                setHasMore((data.articles || []).length >= 20);
                setPage(1);
            } catch (error) {
                console.error('Failed to fetch category feed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryFeed();
    }, [category]);

    // Load more when scrolling
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const response = await fetch(`/api/feed/live?category=${category}&limit=20&page=${nextPage}`, {
                cache: 'no-store'
            });
            const data = await response.json();
            const newArticles = data.articles || [];

            if (newArticles.length < 20) {
                setHasMore(false);
            }

            setArticles(prev => {
                const uniqueNew = newArticles.filter((n: Article) => !prev.some(p => p.id === n.id));
                return [...prev, ...uniqueNew];
            });
            setPage(nextPage);
        } catch (error) {
            console.error('Failed to load more articles:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [category, page, loadingMore, hasMore]);

    // Trigger load more when sentinel is in view
    useEffect(() => {
        if (inView && hasMore && !loading && !loadingMore) {
            loadMore();
        }
    }, [inView, hasMore, loading, loadingMore, loadMore]);

    const containerClasses = variant === 'minimal'
        ? `space-y-0 ${className}`
        : `bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6 ${className}`;

    const wrapperClasses = variant === 'minimal'
        ? "w-full pb-12"
        : "max-w-3xl mx-auto pb-12";

    return (
        <div className={wrapperClasses}>
            {showHeader && title && description && (
                <PageHeader
                    title={title}
                    description={description}
                    insight={insight}
                    icon={icon}
                />
            )}

            <div className={containerClasses}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                        <div className="relative mb-4">
                            <Radio className="animate-pulse text-blue-500" size={32} />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                        </div>
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                            Processing 109+ sources...
                        </span>
                    </div>
                ) : articles.length > 0 ? (
                    <>
                        <div className={variant === 'minimal' ? "divide-y divide-slate-100" : ""}>
                            {articles.map(article => (
                                <FeedCard key={article.id} article={article} />
                            ))}
                        </div>

                        {/* Infinite scroll sentinel */}
                        <div ref={ref} className="py-8 flex justify-center">
                            {loadingMore && (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="animate-spin text-blue-500" size={24} />
                                    <span className="text-xs font-mono text-slate-400">Loading more...</span>
                                </div>
                            )}
                            {!hasMore && articles.length > 0 && (
                                <p className="text-slate-400 text-sm font-medium">End of Stream.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
                        <p className="text-[#64748B] mb-4">No articles found in this category yet.</p>
                        <a href="/global-feed" className="text-[#2563EB] font-medium hover:underline">
                            View all articles →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
