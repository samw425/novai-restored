'use client';

import { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Lock, Loader2, ArrowUp, AlertOctagon, Radio, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedCard } from '@/components/feed/FeedCard';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
// MonthlyIntelBrief import removed
import { InteractiveMap } from '@/components/ui/InteractiveMap';
import { Article } from '@/types';

// Prevent static generation for this page to ensure real-time data
export const dynamic = 'force-dynamic';

export default function WarRoomPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeTab, setActiveTab] = useState<'GLOBAL_INTEL' | 'CURRENT_WARS'>('GLOBAL_INTEL');
    const [israelGazaArticles, setIsraelGazaArticles] = useState<Article[]>([]);
    const [russiaUkraineArticles, setRussiaUkraineArticles] = useState<Article[]>([]);
    const [warFeedsLoading, setWarFeedsLoading] = useState(false);

    // Pagination for War Feeds
    const [igPage, setIgPage] = useState(1);
    const [ruPage, setRuPage] = useState(1);
    const [hasMoreIg, setHasMoreIg] = useState(true);
    const [hasMoreRu, setHasMoreRu] = useState(true);
    const [loadingIg, setLoadingIg] = useState(false);
    const [loadingRu, setLoadingRu] = useState(false);

    // Initial Load
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ONLY strict War Room OSINT data
                const mapRes = await fetch('/api/feed/war-room?page=1&limit=20', { cache: 'no-store' });
                const mapData = await mapRes.json();

                if (mapData.incidents) {
                    setIncidents(mapData.incidents);
                    // Use the same strict OSINT data for the list view
                    // Convert WarRoomIncident[] to Article[] shape for the FeedCard component
                    const strictArticles = mapData.incidents.map((inc: any) => ({
                        id: inc.id,
                        title: inc.title,
                        description: inc.description,
                        url: inc.url,
                        source: inc.source,
                        publishedAt: inc.timestamp,
                        category: inc.type, // 'conflict', 'cyber'
                        image_url: null, // Incidents usually don't have images, we can use icons
                        score: inc.severity === 'critical' ? 10 : 5
                    }));
                    setArticles(strictArticles);
                    setHasMore(strictArticles.length >= 20);
                }

            } catch (error) {
                console.error('Failed to fetch War Room data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchData();
    }, []);

    // Fetch Current Wars Data when tab is active
    useEffect(() => {
        if (activeTab === 'CURRENT_WARS' && israelGazaArticles.length === 0) {
            const fetchWarFeeds = async () => {
                setWarFeedsLoading(true);
                try {
                    const [igRes, ruRes] = await Promise.all([
                        fetch('/api/feed/war-room?category=israel-gaza&limit=15'),
                        fetch('/api/feed/war-room?category=russia-ukraine&limit=15')
                    ]);
                    const igData = await igRes.json();
                    const ruData = await ruRes.json();

                    if (igData.items) setIsraelGazaArticles(igData.items);
                    if (ruData.items) setRussiaUkraineArticles(ruData.items);
                } catch (error) {
                    console.error('Failed to fetch war feeds:', error);
                } finally {
                    setWarFeedsLoading(false);
                }
            };
            fetchWarFeeds();
        }
    }, [activeTab]);

    // Load More Handlers for War Feeds
    const loadMoreIg = async () => {
        if (loadingIg || !hasMoreIg) return;
        setLoadingIg(true);
        try {
            const nextPage = igPage + 1;
            const res = await fetch(`/api/feed/war-room?category=israel-gaza&limit=15&page=${nextPage}`);
            const data = await res.json();

            if (data.items && data.items.length > 0) {
                setIsraelGazaArticles(prev => [...prev, ...data.items]);
                setIgPage(nextPage);
                setHasMoreIg(data.items.length >= 15);
            } else {
                setHasMoreIg(false);
            }
        } catch (e) {
            console.error('Failed to load more IG:', e);
        } finally {
            setLoadingIg(false);
        }
    };

    const loadMoreRu = async () => {
        if (loadingRu || !hasMoreRu) return;
        setLoadingRu(true);
        try {
            const nextPage = ruPage + 1;
            const res = await fetch(`/api/feed/war-room?category=russia-ukraine&limit=15&page=${nextPage}`);
            const data = await res.json();

            if (data.items && data.items.length > 0) {
                setRussiaUkraineArticles(prev => [...prev, ...data.items]);
                setRuPage(nextPage);
                setHasMoreRu(data.items.length >= 15);
            } else {
                setHasMoreRu(false);
            }
        } catch (e) {
            console.error('Failed to load more RU:', e);
        } finally {
            setLoadingRu(false);
        }
    };

    // Infinite Scroll Load
    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);

        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/feed/war-room?page=${nextPage}&limit=20`, { cache: 'no-store' });
            const data = await res.json();

            if (data.incidents && data.incidents.length > 0) {
                const newArticles = data.incidents.map((inc: any) => ({
                    id: inc.id,
                    title: inc.title,
                    description: inc.description,
                    url: inc.url,
                    source: inc.source,
                    publishedAt: inc.timestamp,
                    category: inc.type,
                    image_url: null,
                    score: inc.severity === 'critical' ? 10 : 5
                }));

                setArticles(prev => [...prev, ...newArticles]);
                setPage(nextPage);
                setHasMore(newArticles.length >= 20);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more War Room data:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CONFLICT' | 'CYBER' | 'NAVAL'>('ALL');
    const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isAutoPatrol, setIsAutoPatrol] = useState(false);

    // Calculate DEFCON level based on critical incidents
    const criticalCount = incidents.filter(i => i.severity === 'critical').length;
    const defconLevel = criticalCount > 5 ? 2 : criticalCount > 2 ? 3 : 4;
    const defconColor = defconLevel === 2 ? 'text-red-600 bg-red-50 border-red-200' :
        defconLevel === 3 ? 'text-orange-600 bg-orange-50 border-orange-200' :
            'text-yellow-600 bg-yellow-50 border-yellow-200';

    // Filter incidents based on selection - USE incidents (raw data) not articles (mapped)
    const filteredIncidents = incidents.filter(inc => {
        if (selectedFilter === 'ALL') return true;
        if (selectedFilter === 'CONFLICT') return inc.type === 'conflict' || inc.type === 'air' || inc.type === 'earthquake'; // Using 'type' from raw data
        if (selectedFilter === 'CYBER') return inc.type === 'cyber';
        if (selectedFilter === 'NAVAL') return inc.type === 'naval';
        return true;
    });

    // Auto-Patrol Logic Removed


    // Manual Interaction Handler
    const handleManualFocus = (loc: { lat: number; lng: number } | null) => {
        setIsAutoPatrol(false); // Stop patrol on user interaction
        setFocusedLocation(loc);
    };

    // Determine Globe Color based on filter
    const getGlobeColor = (): [number, number, number] => {
        switch (selectedFilter) {
            case 'CYBER': return [0.1, 0.8, 0.8]; // Cyan
            case 'NAVAL': return [0.1, 0.3, 1]; // Blue
            case 'CONFLICT': return [1, 0.2, 0.2]; // Red
            default: return [1, 0.5, 0]; // Orange/Gold for All
        }
    };

    // Find the currently focused incident details
    const focusedIncident = incidents.find(inc =>
        focusedLocation &&
        inc.location &&
        Math.abs(inc.location.lat - focusedLocation.lat) < 0.001 &&
        Math.abs(inc.location.lng - focusedLocation.lng) < 0.001
    );

    return (
        <div className="space-y-6">
            {/* Top Bar: Ticker & Clock */}
            <div className="flex flex-col lg:flex-row gap-4 mb-2">
                <div className="flex-1 bg-black text-white rounded-lg overflow-hidden flex items-center shadow-md border border-gray-800">
                    <div className="bg-red-600 px-4 py-3 font-bold text-xs uppercase tracking-wider shrink-0 animate-pulse flex items-center gap-2">
                        <Radio size={14} />
                        LIVE INTEL
                    </div>
                    {/* ... ticker content ... */}
                    <div className="overflow-hidden whitespace-nowrap w-full relative">
                        {/* Slowed down ticker for readability */}
                        <div className="inline-block animate-marquee pl-4 text-sm font-mono text-green-400 py-2" style={{ animationDuration: '120s' }}>
                            {incidents.length > 0 ? incidents.map(i => (
                                <span key={i.id} className="mr-16 inline-flex items-center gap-2">
                                    <span className={i.severity === 'critical' ? 'text-red-500 font-bold' : 'text-green-500'}>
                                        [{i.type.toUpperCase()}]
                                    </span>
                                    <span className="text-gray-300">{i.title}</span>
                                    <span className="text-gray-600 text-xs">//{i.source}</span>
                                </span>
                            )) : "INITIALIZING GLOBAL SENSORS..."}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900 text-green-500 font-mono rounded-lg px-6 py-2 flex items-center justify-center border border-gray-800 shadow-md min-w-[140px]">
                    <Clock />
                </div>
            </div>

            {/* View Selection Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('GLOBAL_INTEL')}
                    className={`px-6 py-3 font-mono text-sm font-bold border-b-2 transition-colors ${activeTab === 'GLOBAL_INTEL'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    GLOBAL INTEL
                </button>
                <button
                    onClick={() => setActiveTab('CURRENT_WARS')}
                    className={`px-6 py-3 font-mono text-sm font-bold border-b-2 transition-colors ${activeTab === 'CURRENT_WARS'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    CURRENT WARS
                </button>
            </div>

            {/* Interactive Global Threat Map (Only in Global Intel Tab) */}
            {activeTab === 'GLOBAL_INTEL' && (
                <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Globe Display */}
                    {/* Main Map Display */}
                    <div className="lg:col-span-3">
                        {/* Interactive Legend / Filter Bar - Moved outside for Flat Map clarity */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {[
                                { id: 'ALL', label: 'ALL SECTORS', color: 'bg-orange-500' },
                                { id: 'CONFLICT', label: 'KINETIC / AIR', color: 'bg-red-500' },
                                { id: 'NAVAL', label: 'NAVAL / MARITIME', color: 'bg-blue-600' },
                                { id: 'CYBER', label: 'CYBER / INFRA', color: 'bg-cyan-400' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id as any)}
                                    className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider border transition-all ${selectedFilter === filter.id
                                        ? `${filter.color} text-white border-transparent shadow-lg scale-105`
                                        : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${filter.color}`}></span>
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Flat Map Component */}
                        <InteractiveMap incidents={filteredIncidents} />
                    </div>

                    {/* Quick Select / Recent Alerts Panel */}
                    <div className="bg-black border border-gray-800 rounded-xl p-4 overflow-y-auto max-h-[500px] hidden lg:block shadow-2xl">
                        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 font-mono flex items-center gap-2 border-b border-gray-800 pb-2">
                            <Activity className="w-3 h-3 animate-pulse" />
                            Active Vectors
                        </h3>
                        <div className="space-y-2">
                            {filteredIncidents.slice(0, 8).map((inc) => (
                                <div key={inc.id} className="w-full flex items-center gap-2 group">
                                    <button
                                        onClick={() => handleManualFocus(inc.location ? { lat: inc.location.lat, lng: inc.location.lng } : null)}
                                        className={`flex-1 text-left p-3 rounded border transition-all duration-200 ${focusedLocation?.lat === inc.location?.lat
                                            ? 'bg-gray-800 border-red-500 ring-1 ring-red-500/50'
                                            : 'bg-gray-900/50 hover:bg-gray-900 border-gray-800 hover:border-blue-500'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${inc.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-blue-950 text-blue-400 border border-blue-900'
                                                }`}>
                                                {inc.type?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-mono">
                                                {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="text-xs font-medium text-gray-300 group-hover:text-white group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all line-clamp-2 leading-snug font-mono mt-1">
                                            {inc.title}
                                        </div>
                                    </button>
                                    <a
                                        href={inc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 h-full flex items-center justify-center bg-gray-900 border border-gray-800 hover:bg-blue-600 hover:border-blue-500 text-gray-500 hover:text-white rounded transition-all duration-200 shadow-sm"
                                        title="Open Intel Source"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Current Wars View */}
            {activeTab === 'CURRENT_WARS' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4">
                    {/* Israel / Gaza Column */}
                    <div className="bg-white rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <h3 className="font-bold font-mono flex items-center gap-2 text-lg">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                ISRAEL / GAZA
                            </h3>
                            <span className="text-xs text-slate-400 font-mono">LIVE FEED</span>
                        </div>
                        <div className="p-6 flex-1 bg-white">
                            {warFeedsLoading ? (
                                <div className="p-12"><ResourceLoader message="Establishing uplink..." /></div>
                            ) : (
                                <div>
                                    {israelGazaArticles.map(article => (
                                        <FeedCard key={`${article.id}-${Math.random()}`} article={article} />
                                    ))}

                                    <div className="pt-6 flex justify-center">
                                        {hasMoreIg ? (
                                            <button
                                                onClick={loadMoreIg}
                                                disabled={loadingIg}
                                                className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2"
                                            >
                                                {loadingIg ? <Loader2 size={12} className="animate-spin" /> : <ArrowUp size={12} className="rotate-180" />}
                                                LOAD MORE INTEL
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-300 font-mono">END OF STREAM</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Russia / Ukraine Column */}
                    <div className="bg-white rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <h3 className="font-bold font-mono flex items-center gap-2 text-lg">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                RUSSIA / UKRAINE
                            </h3>
                            <span className="text-xs text-slate-400 font-mono">LIVE FEED</span>
                        </div>
                        <div className="p-6 flex-1 bg-white">
                            {warFeedsLoading ? (
                                <div className="p-12"><ResourceLoader message="Establishing uplink..." /></div>
                            ) : (
                                <div>
                                    {russiaUkraineArticles.map(article => (
                                        <FeedCard key={`${article.id}-${Math.random()}`} article={article} />
                                    ))}

                                    <div className="pt-6 flex justify-center">
                                        {hasMoreRu ? (
                                            <button
                                                onClick={loadMoreRu}
                                                disabled={loadingRu}
                                                className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2"
                                            >
                                                {loadingRu ? <Loader2 size={12} className="animate-spin" /> : <ArrowUp size={12} className="rotate-180" />}
                                                LOAD MORE INTEL
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-300 font-mono">END OF STREAM</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Incident Log & Metrics (Only in Global Intel Tab) */}
            {activeTab === 'GLOBAL_INTEL' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Active Incidents (Real-Time Feed) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-mono">
                                <Activity className="h-5 w-5 text-blue-500" />
                                RAW INTEL STREAM
                            </h2>
                            <span className="text-xs font-bold text-green-600 uppercase animate-pulse flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                LIVE UPLINK ACTIVE
                            </span>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="p-8">
                                    <ResourceLoader message="Decrypting global intelligence streams..." />
                                </div>
                            ) : articles.length > 0 ? (
                                <div>
                                    {articles.map(article => (
                                        <FeedCard key={article.id} article={article} />
                                    ))}

                                    {/* Load More Trigger */}
                                    <div className="p-6 flex justify-center bg-gray-50/30">
                                        {hasMore ? (
                                            <button
                                                onClick={loadMore}
                                                disabled={loadingMore}
                                                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 font-mono text-xs hover:bg-gray-50 hover:text-blue-600 transition-colors rounded-full flex items-center gap-2 shadow-sm"
                                            >
                                                {loadingMore ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUp className="h-3 w-3 rotate-180" />}
                                                {loadingMore ? 'DECRYPTING MORE...' : 'LOAD OLDER INTEL'}
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 font-mono text-xs">END OF STREAM</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400 font-mono">
                                    Awaiting incoming signals...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Security Status */}
                    <div className="bg-gray-900 text-white rounded-xl p-8 shadow-2xl h-fit sticky top-6">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
                            <Lock className="h-5 w-5 text-gray-400" />
                            SYSTEM STATUS
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-sm mb-2 font-mono">
                                    <span className="text-gray-400">GLOBAL STABILITY</span>
                                    <span className={`font-bold ${defconLevel === 2 ? 'text-red-500' : 'text-amber-500'}`}>
                                        {defconLevel === 2 ? 'CRITICAL' : 'UNSTABLE'}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                    <div className={`h-full w-[${defconLevel === 2 ? '85%' : '65%'}] ${defconLevel === 2 ? 'bg-red-600' : 'bg-amber-600'} animate-pulse`}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2 font-mono">
                                    <span className="text-gray-400">CYBER THREAT LEVEL</span>
                                    <span className="font-bold text-orange-500">HIGH</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                    <div className="h-full bg-orange-600 w-[75%]"></div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-800">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 font-mono">ACTIVE MONITORING</h3>
                                <ul className="space-y-4 font-mono">
                                    <li className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                            CIA / NSA / FIVE EYES
                                        </span>
                                        <span className="text-green-500">ONLINE</span>
                                    </li>
                                    <li className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                            MOSSAD / IDF
                                        </span>
                                        <span className="text-green-500">ONLINE</span>
                                    </li>
                                    <li className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                            FSB / SVR / GRU
                                        </span>
                                        <span className="text-amber-500">INTERCEPTING</span>
                                    </li>
                                    <li className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                            MSS / PLA
                                        </span>
                                        <span className="text-amber-500">INTERCEPTING</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* 30-Day Brief Removed per Hotfix Exception */}
        </div>
    );
}

function Clock() {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        // Client-side only to avoid hydration mismatch
        const updateTime = () => {
            const now = new Date();
            setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span>{time}</span>;
}
