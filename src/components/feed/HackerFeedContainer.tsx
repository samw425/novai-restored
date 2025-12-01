'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Article } from '@/types';
import { fetchArticles, checkNewArticles } from '@/lib/api';
import { FeedCard } from './FeedCard';
import { Loader2, ArrowUp, Shield, Terminal } from 'lucide-react';

import { LiveTicker } from '@/components/dashboard/LiveTicker';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';
import { PageHeader } from '@/components/ui/PageHeader';

export function HackerFeedContainer() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [newCount, setNewCount] = useState(0);

    const { ref, inView } = useInView();

    const loadArticles = useCallback(async (reset = false) => {
        if (loading) return;
        setLoading(true);

        try {
            // We don't have pagination on the hacker feed yet, so just fetch once or refresh
            // For now, re-fetch the main endpoint
            // In a real app, we'd pass a cursor
            if (!reset && articles.length > 0) {
                // Mock infinite scroll: just stop for now as we fetch all at once
                setHasMore(false);
                return;
            }

            const response = await fetch('/api/feed/hacker');
            const data = await response.json();
            setArticles(data.articles || []);
            setHasMore(false); // No pagination implemented yet for this feed
        } catch (error) {
            console.error("Failed to load hacker articles", error);
        } finally {
            setLoading(false);
        }
    }, [loading, articles.length]);

    // Initial load
    useEffect(() => {
        loadArticles(true);
    }, []);

    // Polling for new items
    useEffect(() => {
        const interval = setInterval(async () => {
            if (articles.length > 0) {
                // We can reuse the checkNewArticles logic if we want, or just re-fetch
                // For now, let's just re-fetch silently to check count
                try {
                    const response = await fetch('/api/feed/hacker');
                    const data = await response.json();
                    const latestId = data.articles?.[0]?.id;
                    if (latestId && latestId !== articles[0].id) {
                        setNewCount(prev => prev + 1); // Simplified count
                    }
                } catch (e) { }
            }
        }, 30000); // 30s check
        return () => clearInterval(interval);
    }, [articles]);

    const handleRefresh = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setNewCount(0);
        loadArticles(true);
    };

    const [activeTab, setActiveTab] = useState<'live' | 'brief'>('live');

    return (
        <div className="relative min-h-screen pb-20 bg-gray-50/50">
            {/* System Header Components */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <LiveTicker />
                <SystemStatus />

                {/* Tab Navigation */}
                <div className="flex items-center justify-center border-b border-gray-200 bg-gray-50/50">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'live'
                            ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Terminal className="h-3 w-3" />
                        Signal Intercept
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button
                        onClick={() => setActiveTab('brief')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'brief'
                            ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Shield className="h-3 w-3" />
                        Threat Intel Brief
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <PageHeader
                    title="Hacker News & Security"
                    description="Real-time cybersecurity threats, vulnerabilities, and engineering discussions."
                    insight="In the age of AI, security is the new baseline. We track the exploits and patches that define the digital battlefield."
                    icon={<Shield className="w-8 h-8 text-blue-600" />}
                />

                {/* LIVE TAB CONTENT */}
                {activeTab === 'live' && (
                    <>
                        {newCount > 0 && (
                            <div
                                onClick={handleRefresh}
                                className="sticky top-32 z-30 mx-auto w-fit mb-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-bold animate-in slide-in-from-top-2"
                            >
                                <ArrowUp className="h-4 w-4" />
                                {newCount} New Signals
                            </div>
                        )}

                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                Encrypted Channels
                            </span>
                            <div className="h-px flex-1 bg-gray-200"></div>
                        </div>

                        {/* List Layout */}
                        <div className="max-w-3xl mx-auto space-y-6">
                            {articles.map((article) => (
                                <FeedCard key={article.id} article={article} />
                            ))}
                        </div>

                        {/* Loading / End Sentinel */}
                        <div ref={ref} className="py-12 flex justify-center w-full">
                            {loading && <Loader2 className="h-8 w-8 animate-spin text-gray-400" />}
                            {!hasMore && articles.length > 0 && (
                                <p className="text-gray-400 text-sm font-mono">Connection Terminated.</p>
                            )}
                        </div>
                    </>
                )}

                {/* BRIEF TAB CONTENT */}
                {activeTab === 'brief' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <MonthlyIntelBrief articles={articles} fullView={true} />
                    </div>
                )}
            </div>
        </div>
    );
}
