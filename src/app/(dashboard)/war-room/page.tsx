'use client';

import { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Lock, Loader2, ArrowUp, AlertOctagon, Radio, ExternalLink, Map as MapIcon, ShieldAlert, Target, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedCard } from '@/components/feed/FeedCard';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { InteractiveMap } from '@/components/ui/InteractiveMap';
import { Article } from '@/types';
import { NAVAL_FACILITIES } from '@/lib/naval-data';

// Prevent static generation for this page to ensure real-time data
export const dynamic = 'force-dynamic';

export default function WarRoomPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeTab, setActiveTab] = useState<'GLOBAL_INTEL' | 'NAVAL_TRACKER' | 'CURRENT_WARS'>('GLOBAL_INTEL');
    const [israelGazaArticles, setIsraelGazaArticles] = useState<Article[]>([]);
    const [russiaUkraineArticles, setRussiaUkraineArticles] = useState<Article[]>([]);
    const [navalArticles, setNavalArticles] = useState<Article[]>([]);
    const [warFeedsLoading, setWarFeedsLoading] = useState(false);

    // Pagination for War/Naval Feeds
    const [igPage, setIgPage] = useState(1);
    const [ruPage, setRuPage] = useState(1);
    const [nvPage, setNvPage] = useState(1);
    const [hasMoreIg, setHasMoreIg] = useState(true);
    const [hasMoreRu, setHasMoreRu] = useState(true);
    const [hasMoreNv, setHasMoreNv] = useState(true);
    const [loadingIg, setLoadingIg] = useState(false);
    const [loadingRu, setLoadingRu] = useState(false);
    const [loadingNv, setLoadingNv] = useState(false);

    // Intersection Observers for Infinite Scroll
    const { ref: globalRef, inView: globalInView } = useInView();
    const { ref: igRef, inView: igInView } = useInView();
    const { ref: ruRef, inView: ruInView } = useInView();
    const { ref: nvRef, inView: nvInView } = useInView();

    // Local Filter State
    const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CONFLICT' | 'CYBER' | 'NAVAL'>('ALL');
    const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);

    const handleManualFocus = (loc: { lat: number; lng: number } | null) => {
        setFocusedLocation(loc);
    };

    // Filter Incidents Logic
    const filteredIncidents = incidents.filter(inc => {
        if (selectedFilter === 'ALL') return true;
        if (selectedFilter === 'NAVAL') return inc.type === 'naval';
        if (selectedFilter === 'CYBER') return inc.type === 'cyber';
        if (selectedFilter === 'CONFLICT') return inc.type === 'conflict' || inc.type === 'air';
        return true;
    });

    // Initial Data Fetch (Global Intel)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/feed/war-room?limit=100', { cache: 'no-store' });
                const data = await res.json();
                if (data.incidents) {
                    setIncidents(data.incidents);
                    // Also populate initial articles for the feed if separate
                    setArticles(data.incidents);
                }
            } catch (error) {
                console.error('Failed to fetch global intel:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch Naval/Wars Data when tab is active
    useEffect(() => {
        if (activeTab === 'NAVAL_TRACKER' && navalArticles.length === 0) {
            const fetchNavalFeeds = async () => {
                setWarFeedsLoading(true);
                try {
                    const res = await fetch('/api/feed/war-room?category=naval&limit=20', { cache: 'no-store' });
                    const data = await res.json();
                    if (data.items) setNavalArticles(data.items);
                } catch (error) {
                    console.error('Failed to fetch naval feeds:', error);
                } finally {
                    setWarFeedsLoading(false);
                }
            };
            fetchNavalFeeds();
        }

        if (activeTab === 'CURRENT_WARS' && israelGazaArticles.length === 0) {
            const fetchWarFeeds = async () => {
                setWarFeedsLoading(true);
                try {
                    const [resGaza, resUkraine] = await Promise.all([
                        fetch('/api/feed/war-room?category=israel-gaza&limit=10', { cache: 'no-store' }),
                        fetch('/api/feed/war-room?category=russia-ukraine&limit=10', { cache: 'no-store' })
                    ]);
                    const dataGaza = await resGaza.json();
                    const dataUkraine = await resUkraine.json();
                    if (dataGaza.items) setIsraelGazaArticles(dataGaza.items);
                    if (dataUkraine.items) setRussiaUkraineArticles(dataUkraine.items);
                } catch (error) {
                    console.error('Failed to fetch war feeds:', error);
                } finally {
                    setWarFeedsLoading(false);
                }
            };
            fetchWarFeeds();
        }
    }, [activeTab, israelGazaArticles.length, navalArticles.length]);

    // ... (loadMoreNv handler needed)

    // View Selection Tabs
    return (
        <div className="space-y-6">
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('GLOBAL_INTEL')}
                    className={`px-6 py-3 font-mono text-xs md:text-sm font-bold border-b-2 transition-colors ${activeTab === 'GLOBAL_INTEL'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    GLOBAL INTEL
                </button>
                <button
                    onClick={() => setActiveTab('NAVAL_TRACKER')}
                    className={`px-6 py-3 font-mono text-xs md:text-sm font-bold border-b-2 transition-colors ${activeTab === 'NAVAL_TRACKER'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    NAVAL TRACKER
                </button>
                <button
                    onClick={() => setActiveTab('CURRENT_WARS')}
                    className={`px-6 py-3 font-mono text-xs md:text-sm font-bold border-b-2 transition-colors ${activeTab === 'CURRENT_WARS'
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
                    {/* Main Map Display */}
                    <div className="lg:col-span-3">
                        {/* Interactive Legend / Filter Bar */}
                        <div className="flex flex-wrap gap-2 mb-4 justify-between items-center">
                            {/* LEFT: Standard Filters */}
                            <div className="flex gap-2">
                                {[
                                    { id: 'ALL', label: 'ALL SECTORS', color: 'bg-orange-500' },
                                    { id: 'CONFLICT', label: 'KINETIC', color: 'bg-red-500' },
                                    { id: 'CYBER', label: 'CYBER', color: 'bg-cyan-400' }
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => {
                                            setSelectedFilter(filter.id as any);
                                            // auto-switch out of naval specific mode if clicking general filters
                                            if (selectedFilter === 'NAVAL') setSelectedFilter('ALL');
                                        }}
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

                            {/* RIGHT: Dedicated Naval Toggle */}
                            <button
                                onClick={() => setSelectedFilter(selectedFilter === 'NAVAL' ? 'ALL' : 'NAVAL')}
                                className={`px-4 py-1.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider border transition-all flex items-center gap-2 ${selectedFilter === 'NAVAL'
                                    ? 'bg-blue-900 text-blue-100 border-blue-700 shadow-[0_0_15px_rgba(30,58,138,0.5)] ring-1 ring-blue-400'
                                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${selectedFilter === 'NAVAL' ? 'bg-blue-400 animate-pulse' : 'bg-slate-400'}`}></span>
                                NAVAL TRACKER
                            </button>
                        </div>

                        {/* NAVAL HUD - Only visible when Naval Tracker is active */}
                        {selectedFilter === 'NAVAL' && (
                            <div className="mb-4 p-3 bg-blue-950/90 border border-blue-800 rounded-lg text-blue-200 text-xs font-mono flex gap-6 items-center shadow-inner animate-in fade-in slide-in-from-top-2">
                                <span className="font-bold text-blue-400">TRACKING ASSETS:</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> US/ALLIED</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> CN/RU/HOSTILE</span>
                                <span className="ml-auto text-[10px] opacity-70">DATA SOURCE: OSINT/AIS ESTIMATES</span>
                            </div>
                        )}

                        {/* Flat Map Component */}
                        <InteractiveMap incidents={filteredIncidents} />
                    </div>

                    {/* Quick Select / Recent Alerts Panel */}
                    <div className="bg-black border border-gray-800 rounded-xl p-4 overflow-y-auto max-h-[700px] hidden lg:block shadow-2xl">
                        <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 font-mono flex items-center gap-2 border-b border-gray-800 pb-3">
                            <Activity className="w-4 h-4 animate-pulse" />
                            Active Vectors ({filteredIncidents.length})
                        </h3>
                        <div className="space-y-3">
                            {filteredIncidents.slice(0, 12).map((inc) => (
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

            {/* Naval Tracker View */}
            {activeTab === 'NAVAL_TRACKER' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    {/* Naval Intel Map Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <div className="mb-4 flex flex-wrap justify-between items-center bg-slate-100 p-2 rounded-lg border border-slate-200">
                                <span className="text-[10px] font-bold font-mono text-blue-900 bg-blue-100 px-2 py-1 rounded border border-blue-200 uppercase tracking-widest flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                    Live Naval Tracking
                                </span>

                                <div className="flex flex-wrap gap-4 text-[10px] font-mono font-bold text-slate-600 items-center mt-2 sm:mt-0">
                                    <span className="uppercase tracking-wider opacity-60 mr-2">Fleet Key:</span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-blue-600"></span> US / NATO / ALLIES
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-red-600"></span> CHINA (PLAN)
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-orange-600"></span> RUSSIA
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span> INDIA / NON-ALIGNED
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span> IRAN / PROXIES
                                    </span>
                                </div>
                            </div>
                            {/* The Map pre-filtered for naval + Static Facilities */}
                            <InteractiveMap
                                incidents={[
                                    ...incidents.filter(i => i.type === 'naval'),
                                    ...NAVAL_FACILITIES.map(f => ({
                                        id: f.id,
                                        type: 'naval' as const,
                                        title: `${f.name} (${f.country})`,
                                        description: f.description,
                                        severity: 'info' as const,
                                        location: f.location,
                                        country: f.country as any,
                                        timestamp: new Date().toISOString(),
                                        source: 'Known Base',
                                        url: '#',
                                        assetType: 'Naval Base'
                                    }))
                                ]}
                                hasNavalContext={true}
                            />
                        </div>

                        {/* Fleet Status Sidebar */}
                        <div className="space-y-6">
                            {/* Live Stats Computed from Incidents */}
                            <div className="bg-slate-900 rounded-xl p-5 shadow-xl border border-slate-800">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Live Intel Metrics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Alerts</span>
                                        <span className="text-lg font-mono text-white font-bold">{incidents.filter(i => i.type === 'naval').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest sh">Critical Priority</span>
                                        <span className="text-lg font-mono text-red-500 font-bold">{incidents.filter(i => i.type === 'naval' && i.severity === 'critical').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sources Monitored</span>
                                        <span className="text-lg font-mono text-blue-400 font-bold">LIVE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Naval Intelligence Small Feed */}
                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex-grow">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 font-mono">
                                    Maritime Signals
                                </h3>
                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="py-4"><Loader2 className="w-4 h-4 animate-spin mx-auto text-slate-300" /></div>
                                    ) : navalArticles.slice(0, 5).map(article => (
                                        <div key={article.id} className="group">
                                            <a href={article.url} target="_blank" className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600 line-clamp-2 leading-tight">
                                                {article.title}
                                            </a>
                                            <div className="flex justify-between mt-1 opacity-50 text-[9px] font-mono">
                                                <span>{article.source}</span>
                                                <span>1h ago</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 text-[10px] font-bold text-blue-500 hover:bg-blue-50 py-1 rounded transition-colors uppercase tracking-widest border border-blue-100">
                                    Open Full Naval Feed
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Full Width Naval OSINT Stream */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-mono">
                                <Radio className="h-4 w-4 text-blue-500 animate-pulse" />
                                GLOBAL MARITIME INTELLIGENCE STREAM
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    VETTED SOURCES
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {navalArticles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {navalArticles.map(article => (
                                        <FeedCard key={article.id} article={article} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
                                    <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                                    <p className="text-sm font-mono tracking-widest uppercase">Initializing Ocean Surveillance...</p>
                                </div>
                            )}

                            <div ref={nvRef} className="pt-8 flex justify-center w-full min-h-[50px]">
                                {loadingNv && <Loader2 size={24} className="animate-spin text-blue-400" />}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Intel View */}
            {/* Current Wars View */}
            {activeTab === 'CURRENT_WARS' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Israel / Gaza */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 text-slate-900">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                    ISRAEL / GAZA / LEBANON
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {israelGazaArticles.map(article => (
                                    <FeedCard key={article.id} article={article} />
                                ))}
                                {israelGazaArticles.length === 0 && <div className="text-center py-10 text-slate-400">Loading Intelligence...</div>}
                            </div>
                        </div>

                        {/* Russia / Ukraine */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 text-slate-900">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    RUSSIA / UKRAINE
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {russiaUkraineArticles.map(article => (
                                    <FeedCard key={article.id} article={article} />
                                ))}
                                {russiaUkraineArticles.length === 0 && <div className="text-center py-10 text-slate-400">Loading Intelligence...</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
