'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Article } from '@/types';
import { fetchArticles, checkNewArticles } from '@/lib/api';
import { FeedCard } from './FeedCard';
import { FeedHeader } from './FeedHeader';
import { Loader2, ArrowUp, Shield } from 'lucide-react';

import { LiveTicker } from '@/components/dashboard/LiveTicker';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';
import { SignUpModal } from '@/components/auth/SignUpModal';

export function FeedContainer() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [category, setCategory] = useState('all');
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [newCount, setNewCount] = useState(0);

    const { ref, inView } = useInView();

    const loadArticles = useCallback(async (reset = false) => {
        // Prevent duplicate loads, but allow reset even if loading was true (to force refresh)
        // Actually, better to just block if loading to avoid race conditions
        if (loading) return;

        setLoading(true);

        try {
            const newArticles = await fetchArticles(10);
            setArticles(prev => reset ? newArticles : [...prev, ...newArticles]);
            // No cursor in Golden Master, just keep appending
        } catch (error) {
            console.error("Failed to load articles", error);
        } finally {
            setLoading(false);
        }
    }, [cursor, category, loading]); // Removed hasMore from deps to avoid stale closure issues, handled in logic

    // Initial load & Category change
    useEffect(() => {
        setCursor(undefined);
        setHasMore(true);
        setArticles([]); // Clear list immediately on category change

        // We need to call loadArticles with reset=true. 
        // Since loadArticles depends on state that might not be updated yet if we just called setCursor,
        // we should define a separate init function or just rely on the effect.
        // But loadArticles is async.

        // Simplified approach:
        const init = async () => {
            setLoading(true);
            try {
                // Call the live API with category filter
                const apiCategory = category === 'all' ? 'All' : category;
                const response = await fetch(`/api/feed/live?category=${apiCategory}&limit=30`, {
                    cache: 'no-store'
                });
                const data = await response.json();
                setArticles(data.articles || []);
                setHasMore(true); // Mock infinite scroll always true for now
            } finally {
                setLoading(false);
            }
        };
        init();

    }, [category]);

    // Infinite scroll trigger
    useEffect(() => {
        if (inView && hasMore && !loading && articles.length > 0) {
            loadArticles(false);
        }
    }, [inView, hasMore, loading, articles.length, loadArticles]);

    // Polling for new items
    useEffect(() => {
        const interval = setInterval(async () => {
            if (articles.length > 0) {
                const count = await checkNewArticles(articles[0].id);
                if (count > 0) setNewCount(prev => prev + count);
            }
        }, 15000); // 15s check
        return () => clearInterval(interval);
    }, [articles]);

    const handleRefresh = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setNewCount(0);
        // Trigger a reset load
        const refresh = async () => {
            setLoading(true);
            try {
                const articles = await fetchArticles(10);
                setArticles(articles);
                setHasMore(true);
            } finally {
                setLoading(false);
            }
        };
        refresh();
    };

    const [activeTab, setActiveTab] = useState<'live' | 'brief'>('live');
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    return (
        <div className="relative min-h-screen pb-20 bg-gray-50/50">
            <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />

            {/* System Header Components */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="flex items-center justify-between pr-4">
                    <div className="flex-1">
                        <LiveTicker />
                    </div>
                </div>
                <SystemStatus />

                {/* Tab Navigation */}
                <div className="flex items-center justify-center border-b border-gray-200 bg-gray-50/50">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'live'
                            ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Live Wire
                    </button>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <button
                        onClick={() => setActiveTab('brief')}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'brief'
                            ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        30-Day Brief
                    </button>
                </div>

                {activeTab === 'live' && (
                    <FeedHeader activeCategory={category} onCategoryChange={setCategory} />
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* LIVE TAB CONTENT */}
                {activeTab === 'live' && (
                    <>
                        {newCount > 0 && (
                            <div
                                onClick={handleRefresh}
                                className="sticky top-32 z-30 mx-auto w-fit mb-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-bold animate-in slide-in-from-top-2"
                            >
                                <ArrowUp className="h-4 w-4" />
                                {newCount} New Updates
                            </div>
                        )}

                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px flex-1 bg-gray-200"></div>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Incoming Transmissions</span>
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
                                <p className="text-gray-400 text-sm font-medium">End of Stream.</p>
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
