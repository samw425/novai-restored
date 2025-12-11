'use client';
// Force Re-deploy: 2025-12-04 00:08

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Article } from '@/types';
import { fetchArticles, checkNewArticles } from '@/lib/api';
import { FeedCard } from './FeedCard';
import { FeedHeader } from './FeedHeader';
import { Loader2, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LiveTicker } from '@/components/dashboard/LiveTicker';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';
import { SignUpModal } from '@/components/auth/SignUpModal';
import { AIBrief } from '@/components/feed/AIBrief';

interface FeedContainerProps {
    initialCategory?: string;
    forcedCategory?: string; // If set, hides category selector
    showTicker?: boolean;
}

export function FeedContainer({ initialCategory = 'all', forcedCategory, showTicker = true }: FeedContainerProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [category, setCategory] = useState(forcedCategory || initialCategory);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [newCount, setNewCount] = useState(0);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const [viewMode, setViewMode] = useState<'live' | '30-day'>('live');

    const { ref, inView } = useInView();

    const [page, setPage] = useState(1);

    const loadArticles = useCallback(async (reset = false) => {
        if (loading) return;

        setLoading(true);

        try {
            let newArticles: Article[] = [];
            const targetPage = reset ? 1 : page + 1;

            if (viewMode === 'live') {
                newArticles = await fetchArticles(10, category, undefined, targetPage);
            } else {
                // Fetch 30-day top stories
                const response = await fetch(`/api/feed/top-30d?category=${category}`);
                const data = await response.json();
                newArticles = data.articles || [];
            }

            // Check if we hit end of stream
            if (viewMode === 'live' && newArticles.length < 10) {
                setHasMore(false);
            }

            setArticles(prev => {
                if (reset) return newArticles;
                // Filter out duplicates based on ID
                const uniqueNew = newArticles.filter(n => !prev.some(p => p.id === n.id));
                return [...prev, ...uniqueNew];
            });

            if (viewMode === 'live') {
                setPage(targetPage);
            }

            // If in 30-day mode, we loaded everything at once
            if (viewMode === '30-day') {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Failed to load articles", error);
        } finally {
            setLoading(false);
        }
    }, [category, loading, viewMode, page]);

    // Initial load & Category/ViewMode change
    useEffect(() => {
        setCursor(undefined);
        setHasMore(true);
        setArticles([]);
        setPage(1);

        const init = async () => {
            setLoading(true);
            try {
                // Use forcedCategory if present, otherwise current state category
                const targetCategory = forcedCategory || category;
                // ... rest of init logic remains logically similar but using fetchArticles
                const articles = await fetchArticles(10, targetCategory, undefined, 1); // Page 1
                setArticles(articles || []);

                if (viewMode === 'live') {
                    setPage(1);
                    setHasMore(true);
                } else if (viewMode === '30-day') {
                    const res = await fetch(`/api/feed/top-30d?category=${targetCategory}`);
                    const data = await res.json();
                    setArticles(data.articles || []);
                    setHasMore(false);
                }
            } finally {
                setLoading(false);
            }
        };
        init();

    }, [category, forcedCategory, viewMode]);

    // Infinite scroll trigger
    useEffect(() => {
        if (inView && hasMore && !loading && viewMode === 'live') {
            loadArticles();
        }
    }, [inView, hasMore, loading, loadArticles, viewMode]);

    // Poll for new articles every 15s (Only in Live Mode)
    useEffect(() => {
        if (viewMode !== 'live') return;

        const interval = setInterval(async () => {
            if (articles.length > 0) {
                const count = await checkNewArticles(articles[0].id);
                if (count > 0) setNewCount(prev => prev + count);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [articles, viewMode]);

    const handleRefresh = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setNewCount(0);
        setPage(1);
        setHasMore(true);

        const refresh = async () => {
            setLoading(true);
            try {
                const articles = await fetchArticles(10, category, undefined, 1);
                setArticles(articles);
            } finally {
                setLoading(false);
            }
        };
        refresh();
    };

    return (
        <div className="relative min-h-screen pb-20 bg-gray-50/50">
            <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />

            {/* System Header Components */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 overflow-hidden rounded-b-xl max-w-full shadow-sm">
                {showTicker && (
                    <>
                        <div className="flex items-center justify-between pr-4">
                            <div className="flex-1">
                                <LiveTicker />
                            </div>
                        </div>
                        <SystemStatus />
                    </>
                )}

                {/* Category Selector (Only if not forced) */}
                {!forcedCategory && (
                    <FeedHeader activeCategory={category} onCategoryChange={setCategory} />
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* 30-DAY BRIEF TOGGLE */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-100 p-1 rounded-lg inline-flex items-center">
                        <button
                            onClick={() => setViewMode('live')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'live'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            LIVE FEED
                        </button>
                        <button
                            onClick={() => setViewMode('30-day')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${viewMode === '30-day'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            30-DAY BRIEF
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">TOP</span>
                        </button>
                    </div>
                </div>


                {/* LIVE FEED CONTENT */}
                {newCount > 0 && viewMode === 'live' && (
                    <motion.div
                        onClick={handleRefresh}
                        className="sticky top-32 z-30 mx-auto w-fit mb-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-full shadow-lg cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 text-sm font-bold"
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            boxShadow: [
                                '0 0 0 0 rgba(59, 130, 246, 0.5)',
                                '0 0 0 8px rgba(59, 130, 246, 0)',
                                '0 0 0 0 rgba(59, 130, 246, 0)'
                            ]
                        }}
                        transition={{
                            duration: 0.4,
                            boxShadow: {
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut'
                            }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                        >
                            <ArrowUp className="h-4 w-4" />
                        </motion.div>
                        <span className="relative">
                            {newCount} New Updates
                            <motion.span
                                className="absolute -right-2 -top-1 w-2 h-2 bg-white rounded-full"
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        </span>
                    </motion.div>
                )}

                {/* Section Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50"></div>
                    <div className="flex items-center gap-2">
                        {viewMode === 'live' ? (
                            <>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-[0.2em]">NEURAL FEED // LIVE SIGNALS</span>
                            </>
                        ) : (
                            <>
                                <span className="relative flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-[0.2em]">ARCHIVE // TOP STORIES (30D)</span>
                            </>
                        )}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50"></div>
                </div>

                {/* List Layout */}
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6">
                    <div>
                        {articles.length === 0 && !loading ? (
                            <div className="text-center py-12 text-slate-400">
                                <p>No top stories found for this period.</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {articles.map((article, idx) => (
                                    <motion.div
                                        key={article.id}
                                        layout
                                        initial={{
                                            opacity: 0,
                                            y: -30,
                                            scale: 0.98,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}
                                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: idx * 0.08,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                        className="rounded-xl overflow-hidden"
                                    >
                                        <FeedCard article={article} isNew={idx < 3 && newCount > 0} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Loading / End Sentinel */}
                <div ref={ref} className="py-12 flex justify-center w-full">
                    {loading && <Loader2 className="h-8 w-8 animate-spin text-gray-400" />}
                    {!hasMore && articles.length > 0 && viewMode === 'live' && (
                        <p className="text-gray-400 text-sm font-medium">End of Stream.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
