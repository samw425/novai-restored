'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
    Terminal,
    TrendingDown,
    AlertTriangle,
    BookOpen,
    Cpu,
    Users,
    Briefcase,
    ExternalLink,
    Loader2,
    FileText,
    School
} from 'lucide-react';

export default function FutureOfCodePage() {
    const [activeTab, setActiveTab] = useState<'LIVE' | 'RESEARCH' | 'CASES'>('LIVE');
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const observerTarget = useRef(null);

    const fetchFeed = async (pageNum: number, isInitial: boolean) => {
        try {
            // Pass the activeTab as the 'type' parameter to the API
            const res = await fetch(`/api/feed/future-of-code?page=${pageNum}&limit=20&type=${activeTab}`);
            const data = await res.json();

            if (data.items) {
                setFeedItems(prev => isInitial ? data.items : [...prev, ...data.items]);
                setHasMore(data.hasMore);
            }
        } catch (e) {
            console.error("Failed to fetch feed", e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Reset and fetch when tab changes
    useEffect(() => {
        setPage(1);
        setFeedItems([]);
        setLoading(true);
        setHasMore(true);
        fetchFeed(1, true);
    }, [activeTab]);

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFeed(nextPage, false);
        }
    };

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && hasMore && !loading && !loadingMore) {
            loadMore();
        }
    }, [hasMore, loading, loadingMore, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "200px",
            threshold: 0.1
        });
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [handleObserver, activeTab]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 text-slate-900 font-sans">
            <PageHeader
                title="FUTURE OF CODE"
                description="THE END OF SYNTAX"
                insight="Tracking the rapid obsolescence of traditional software engineering roles in the age of autonomous agents."
                icon={<Terminal className="w-8 h-8 text-red-600" />}
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('LIVE')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'LIVE'
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <TrendingDown size={16} className={activeTab === 'LIVE' ? 'text-red-400' : ''} />
                            The Collapse (Live)
                        </button>
                        <button
                            onClick={() => setActiveTab('RESEARCH')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'RESEARCH'
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <BookOpen size={16} className={activeTab === 'RESEARCH' ? 'text-blue-400' : ''} />
                            The Research
                        </button>
                        <button
                            onClick={() => setActiveTab('CASES')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'CASES'
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <AlertTriangle size={16} className={activeTab === 'CASES' ? 'text-red-500' : ''} />
                            The Fall
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[600px] overflow-hidden">

                    {/* Header based on Tab */}
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {activeTab === 'LIVE' && (
                                <>
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Real-Time Market Signals</h3>
                                </>
                            )}
                            {activeTab === 'RESEARCH' && (
                                <>
                                    <School size={14} className="text-blue-500" />
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Latest Academic Papers & Preprints</h3>
                                </>
                            )}
                            {activeTab === 'CASES' && (
                                <>
                                    <AlertTriangle size={14} className="text-red-500" />
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Documented Displacement Events</h3>
                                </>
                            )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                            {activeTab === 'LIVE' && "MONITORING: LAYOFFS, AUTOMATION, AI AGENTS"}
                            {activeTab === 'RESEARCH' && "SOURCE: ARXIV, NATURE, IEEE, ACM"}
                            {activeTab === 'CASES' && "TRACKING: CORPORATE RESTRUCTURING"}
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {loading && feedItems.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                <Loader2 size={32} className="animate-spin mb-4 text-red-500" />
                                <span className="text-xs font-mono uppercase tracking-widest">
                                    {activeTab === 'LIVE' && "Analyzing Market Data..."}
                                    {activeTab === 'RESEARCH' && "Fetching Latest Papers..."}
                                    {activeTab === 'CASES' && "Compiling Incident Reports..."}
                                </span>
                            </div>
                        ) : (
                            <>
                                {feedItems.map((item, i) => (
                                    <div key={`${item.link}-${i}`} className="p-6 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded text-slate-600 ${activeTab === 'RESEARCH' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                    activeTab === 'CASES' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                        'bg-slate-100'
                                                }`}>
                                                {item.source}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400">
                                                {new Date(item.pubDate).toLocaleDateString()}
                                            </span>
                                            {activeTab === 'CASES' && (
                                                <span className="text-[9px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                                    CONFIRMED EVENT
                                                </span>
                                            )}
                                        </div>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                                            <h3 className={`text-lg font-bold text-slate-900 mb-2 transition-colors leading-tight ${activeTab === 'RESEARCH' ? 'group-hover:text-blue-600' : 'group-hover:text-red-600'
                                                }`}>
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                {item.contentSnippet}
                                            </p>
                                        </a>
                                    </div>
                                ))}

                                {/* Infinite Scroll Loader */}
                                <div ref={observerTarget} className="h-20 flex items-center justify-center p-4">
                                    {loadingMore ? (
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                                            <Loader2 className="animate-spin h-3 w-3" />
                                            FETCHING HISTORICAL DATA...
                                        </div>
                                    ) : hasMore ? (
                                        <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                                    ) : (
                                        <span className="text-slate-300 text-[10px] uppercase tracking-widest">End of Stream</span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
