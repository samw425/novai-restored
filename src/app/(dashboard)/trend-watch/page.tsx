'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, Minus, ArrowDownRight, Flame, Clock, Hash, ArrowUp } from 'lucide-react';
import { Article } from '@/types';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';

export default function TrendWatchPage() {
    const [loading, setLoading] = useState(true);
    const [trends, setTrends] = useState<{
        rising: { topic: string, velocity: number, count: number }[],
        stable: { topic: string, count: number }[]
    }>({ rising: [], stable: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/feed/live?limit=100');
                const data = await response.json();
                const fetchedArticles = data.articles || [];
                analyzeTrendVelocity(fetchedArticles);
            } catch (error) {
                console.error('Failed to fetch trend data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Poll every 60s
        return () => clearInterval(interval);
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
            if ((velocity > 0 && recentCount >= 1) || recentCount >= 2) {
                velocities.push({ topic, velocity, count: recentCount });
            }
        });

        let risingTopics = velocities
            .sort((a, b) => b.velocity - a.velocity)
            .slice(0, 8);

        // FALLBACK: If no rising topics, use top recent keywords even if low count
        if (risingTopics.length === 0) {
            risingTopics = Object.entries(recentCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([topic, count]) => ({ topic, velocity: 1, count }));
        }

        // Stable topics (consistently mentioned) - RELAXED from 4 to 3
        let stableTopics = Object.entries(recentCounts)
            .filter(([topic, count]) => count >= 2 && !risingTopics.find(r => r.topic === topic))
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([topic, count]) => ({ topic, count }));

        // FALLBACK for stable topics
        if (stableTopics.length === 0) {
            stableTopics = Object.entries(olderCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([topic, count]) => ({ topic, count }));
        }

        setTrends({
            rising: risingTopics,
            stable: stableTopics
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Trend Watch"
                description="Real-time topic momentum and trending patterns."
                insight="Distinguishing hype from reality. We track velocity and sentiment to identify sustainable technological shifts."
                icon={<Flame className="w-8 h-8 text-orange-600" />}
            />

            {loading ? (
                <ResourceLoader message="Analyzing global trend velocity..." />
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

                    {/* Live Trend Feed */}
                    <div className="pt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                            Live Trend Feed
                        </h2>
                        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                            <FeedContainer forcedCategory="all" showTicker={false} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
