'use client';

import { useState, useEffect } from 'react';
import { FeedCard } from '@/components/feed/FeedCard';
import { Article } from '@/types';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

interface CategoryFeedProps {
    category: string;
    title: string;
    description: string;
    insight?: string;
    icon?: React.ReactNode;
}

export function CategoryFeed({ category, title, description, insight, icon }: CategoryFeedProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryFeed = async () => {
            try {
                const response = await fetch(`/api/feed/live?category=${category}&limit=30`, {
                    cache: 'no-store'
                });
                const data = await response.json();
                setArticles(data.articles || []);
            } catch (error) {
                console.error('Failed to fetch category feed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryFeed();
    }, [category]);

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <PageHeader
                title={title}
                description={description}
                insight={insight}
                icon={icon}
            />

            <div className="space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                ) : articles.length > 0 ? (
                    articles.map(article => (
                        <FeedCard key={article.id} article={article} />
                    ))
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
