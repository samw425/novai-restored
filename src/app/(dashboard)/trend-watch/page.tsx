'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Flame, ArrowUp, ArrowDown, Minus, Loader2 } from 'lucide-react';
import { Article } from '@/types';

export default function TrendWatchPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [trends, setTrends] = useState<{
        rising: { topic: string, velocity: number, count: number }[],
        stable: { topic: string, count: number }[],
        recent: Article[]
    }>({ rising: [], stable: [], recent: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/feed/live?limit=50');
                const data = await response.json();
                const fetchedArticles = data.articles || [];

                setArticles(fetchedArticles);
                analyzeTrendVelocity(fetchedArticles);
            } catch (error) {
                console.error('Failed to fetch trend data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const analyzeTrendVelocity = (data: Article[]) => {
        if (data.length === 0) return;

        // Extract keywords and track mentions over time
        const now = Date.now();
        const last6Hours = now - (6 * 60 * 60 * 1000);
        const last24Hours = now - (24 * 60 * 60 * 1000);

        const recentArticles = data.filter(a => new Date(a.publishedAt).getTime() > last6Hours);
        const olderArticles = data.filter(a => {
            const time = new Date(a.publishedAt).getTime();
            return time <= last6Hours && time > last24Hours;
        });

        // Count keyword occurrences
        const getKeywords = (articles: Article[]) => {
            const keywords: Record<string, number> = {};
            articles.forEach(a => {
                const words = a.title.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
                words.forEach(w => {
                    if (w.length > 4) { // Only meaningful words
                        keywords[w] = (keywords[w] || 0) + 1;
                    }
                });
            });
            return keywords;
        };

        const recentCounts = getKeywords(recentArticles);
        const olderCounts = getKeywords(olderArticles);

        // Calculate velocity (rising topics) - RELAXED from 3 to 2 mentions
        const velocities: { topic: string, velocity: number, count: number }[] = [];

        Object.entries(recentCounts).forEach(([topic, recentCount]) => {
            const olderCount = olderCounts[topic] || 0;
            const velocity = recentCount - olderCount;

            // RELAXED: Show if 2+ mentions OR positive velocity
            if ((velocity > 0 && recentCount >= 2) || recentCount >= 3) {
                velocities.push({ topic, velocity, count: recentCount });
            }
        });

        const risingTopics = velocities
            .sort((a, b) => b.velocity - a.velocity)
            .slice(0, 8);

        // Stable topics (consistently mentioned) - RELAXED from 4 to 3
        const stableTopics = Object.entries(recentCounts)
            .filter(([topic, count]) => count >= 3 && !risingTopics.find(r => r.topic === topic))
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([topic, count]) => ({ topic, count }));

        setTrends({
            rising: risingTopics,
            stable: stableTopics,
            recent: data.slice(0, 10) // Show most recent 10 regardless of time
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Flame className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Velocity Analysis</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Trend Watch</h1>
                <p className="text-gray-500 mt-2 text-lg">Real-time topic momentum and trending patterns.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : (
                <div className="space-y-8">

                    {/* Rising Trends */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                            <h2 className="text-lg font-bold text-gray-900">Rising Topics (Last 6 Hours)</h2>
                        </div>

                        {trends.rising.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {trends.rising.map((trend, i) => (
                                    <div key={i} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                                        <div className="flex items-center justify-between mb-2">
                                            <ArrowUp className="h-4 w-4 text-orange-600" />
                                            <span className="text-xs font-bold text-orange-700">+{trend.velocity}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm uppercase">{trend.topic}</h3>
                                        <span className="text-xs text-gray-500">{trend.count} mentions</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No significant rising trends detected.</p>
                        )}
                    </div>

                    {/* Stable Trends */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Minus className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900">Stable Topics</h2>
                        </div>

                        {trends.stable.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {trends.stable.map((trend, i) => (
                                    <div key={i} className="px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                                        <span className="font-bold text-gray-900 text-sm uppercase mr-2">{trend.topic}</span>
                                        <span className="text-xs text-gray-500">{trend.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No stable trends detected.</p>
                        )}
                    </div>

                    {/* Recent Articles */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Latest Updates</h2>
                        <div className="divide-y divide-gray-100">
                            {trends.recent.map((article, i) => (
                                <a
                                    key={i}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block py-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-16 text-center">
                                            <span className="block text-xs font-bold text-gray-400 group-hover:text-orange-600">
                                                {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                                {article.title}
                                            </h3>
                                            <div className="flex gap-2 mt-1">
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">{article.source}</span>
                                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">{article.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
