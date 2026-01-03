'use client';

import { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Lock, Loader2, ArrowUp, AlertOctagon, Radio, ExternalLink, Map as MapIcon, ShieldAlert, Target, Zap, Anchor, Ship } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedCard } from '@/components/feed/FeedCard';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { InteractiveMap } from '@/components/ui/InteractiveMap';
import { Article } from '@/types';
import { NAVAL_FACILITIES } from '@/lib/naval-data';
import { WarRoomIncident } from '@/lib/osint';
import { useAISStream } from '@/hooks/useAISStream';
import { COUNTRY_INFO, VESSEL_TYPE_INFO } from '@/lib/naval-vessels';
import type { LiveVessel } from '@/lib/ais-stream';

// Prevent static generation for this page to ensure real-time data
export const dynamic = 'force-dynamic';

export default function WarRoomPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [incidents, setIncidents] = useState<WarRoomIncident[]>([]);
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
    const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'NAVAL' | 'CONFLICT' | 'CYBER'>('ALL');
    const [navalFilter, setNavalFilter] = useState<'ALL' | 'western' | 'eastern' | 'russia' | 'neutral' | 'hostile'>('ALL');
    const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Live AIS Vessel Tracking
    const {
        vessels: liveVessels,
        isConnected: aisConnected,
        vesselCount: liveVesselCount,
        lastUpdate: aisLastUpdate
    } = useAISStream({ enabled: activeTab === 'NAVAL_TRACKER' });

    // Convert live vessels to incidents for map display
    const liveVesselIncidents: WarRoomIncident[] = liveVessels.map((v: LiveVessel) => ({
        id: `ais-${v.mmsi}`,
        title: `${v.name} (${v.type.toUpperCase()})`,
        type: 'naval' as const,
        severity: 'info' as const,
        description: `${v.class || 'Unknown class'} - Speed: ${v.speed.toFixed(1)} kts, Heading: ${v.heading}°`,
        location: {
            lat: v.lat,
            lng: v.lng,
            region: v.destination || 'At Sea'
        },
        country: v.country,
        assetType: v.type,
        timestamp: v.timestamp,
        source: 'AIS Live',
        url: '#'
    }));

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

    // Infinite Scroll Handlers
    const [pageNv, setPageNv] = useState(1);
    const [pageGaza, setPageGaza] = useState(1);
    const [pageUkr, setPageUkr] = useState(1);

    const loadMoreNv = async () => {
        if (loadingNv) return;
        setLoadingNv(true);
        try {
            const nextPage = pageNv + 1;
            const res = await fetch(`/api/feed/war-room?category=naval&limit=20&page=${nextPage}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                setNavalArticles(prev => [...prev, ...data.items]);
                setPageNv(nextPage);
            }
        } catch (error) {
            console.error('Failed to load more naval:', error);
        } finally {
            setLoadingNv(false);
        }
    };

    const loadMoreGaza = async () => {
        const nextPage = pageGaza + 1;
        try {
            const res = await fetch(`/api/feed/war-room?category=israel-gaza&limit=10&page=${nextPage}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.items?.length) {
                setIsraelGazaArticles(prev => [...prev, ...data.items]);
                setPageGaza(nextPage);
            }
        } catch (e) { console.error(e); }
    };

    const loadMoreUkraine = async () => {
        const nextPage = pageUkr + 1;
        try {
            const res = await fetch(`/api/feed/war-room?category=russia-ukraine&limit=10&page=${nextPage}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.items?.length) {
                setRussiaUkraineArticles(prev => [...prev, ...data.items]);
                setPageUkr(nextPage);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (nvInView && !loadingNv && navalArticles.length > 0) loadMoreNv();
    }, [nvInView]);

    // Show loading state
    if (loading) {
        return <ResourceLoader />;
    }

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

            {/* Global Intel View */}
            {activeTab === 'GLOBAL_INTEL' && (
                <>
                    {/* Map Container with OSINT Overlay */}
                    <div className="mb-8 relative">
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
                                            setSelectedFilter(filter.id as 'ALL' | 'NAVAL' | 'CONFLICT' | 'CYBER');
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

                        {/* Map + OSINT Overlay Container */}
                        <div className="relative">
                            {/* Full Width Map */}
                            <InteractiveMap
                                incidents={filteredIncidents}
                            />

                            {/* OSINT Log Overlay - Positioned on Right Side of Map */}
                            <div className="absolute top-4 right-4 w-80 max-h-[560px] bg-slate-950/95 backdrop-blur-sm rounded-xl p-4 border border-slate-800 shadow-2xl overflow-hidden z-20">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.15em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                                        OSINT LIVE
                                    </h3>
                                    <div className="px-2 py-0.5 bg-blue-900/40 border border-blue-800 rounded text-[8px] font-mono text-blue-300">
                                        {filteredIncidents.length} VECTORS
                                    </div>
                                </div>

                                <div className="overflow-y-auto max-h-[480px] space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                    {filteredIncidents.slice(0, 15).map((inc: WarRoomIncident) => (
                                        <a
                                            key={inc.id}
                                            href={inc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-slate-900/80 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 rounded-lg transition-all duration-200 group"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${inc.type === 'conflict' ? 'text-red-500' : inc.type === 'cyber' ? 'text-cyan-400' : inc.type === 'naval' ? 'text-blue-400' : 'text-orange-400'}`}>
                                                    {inc.type} / {inc.country || 'GLOBAL'}
                                                </span>
                                                <span className="text-[7px] font-mono text-slate-500">
                                                    {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="text-[11px] font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-tight">
                                                {inc.title}
                                            </h4>
                                            <div className="flex items-center justify-between mt-1.5">
                                                <span className="text-[8px] text-slate-500 font-mono uppercase truncate max-w-[120px]">
                                                    {inc.source}
                                                </span>
                                                <span className="text-[8px] text-blue-400 group-hover:text-blue-300 flex items-center gap-0.5">
                                                    <ExternalLink size={8} />
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Intelligence Feed - Below Map */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-mono">
                                <Radio className="h-4 w-4 text-orange-500 animate-pulse" />
                                LIVE INTELLIGENCE FEED
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                    Processing Real-Time Streams
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {articles.map((article: Article) => (
                                    <FeedCard key={article.id} article={article} />
                                ))}
                            </div>
                            <div ref={globalRef} className="pt-8 flex justify-center w-full min-h-[50px]">
                                {loadingMore && <Loader2 size={24} className="animate-spin text-orange-400" />}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Naval Tracker View */}
            {activeTab === 'NAVAL_TRACKER' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
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

                                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold text-slate-600 items-center mt-2 sm:mt-0">
                                    <span className="uppercase tracking-wider opacity-60 mr-2">Fleet Filter:</span>
                                    <button onClick={() => setNavalFilter('ALL')} className={`flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm transition-all ${navalFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        ALL
                                    </button>
                                    <button onClick={() => setNavalFilter('western')} className={`flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm transition-all ${navalFilter === 'western' ? 'bg-blue-900 text-white border-blue-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <span className="w-2 h-2 rounded-full bg-blue-600"></span> US / NATO
                                    </button>
                                    <button onClick={() => setNavalFilter('eastern')} className={`flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm transition-all ${navalFilter === 'eastern' ? 'bg-red-900 text-white border-red-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <span className="w-2 h-2 rounded-full bg-red-600"></span> CHINA
                                    </button>
                                    <button onClick={() => setNavalFilter('russia')} className={`flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm transition-all ${navalFilter === 'russia' ? 'bg-orange-900 text-white border-orange-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <span className="w-2 h-2 rounded-full bg-orange-600"></span> RUSSIA
                                    </button>
                                    <button onClick={() => setNavalFilter('neutral')} className={`flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm transition-all ${navalFilter === 'neutral' ? 'bg-yellow-900 text-white border-yellow-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span> INDIA
                                    </button>
                                    <button onClick={() => setNavalFilter('hostile')} className={`flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm transition-all ${navalFilter === 'hostile' ? 'bg-emerald-900 text-white border-emerald-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span> IRAN
                                    </button>
                                </div>
                            </div>

                            {/* AIS Connection Status */}
                            <div className={`mb-4 p-3 rounded-lg border flex items-center justify-between ${aisConnected ? 'bg-emerald-950/50 border-emerald-800' : 'bg-yellow-950/50 border-yellow-800'}`}>
                                <div className="flex items-center gap-3">
                                    <Anchor className={`w-5 h-5 ${aisConnected ? 'text-emerald-400' : 'text-yellow-400'}`} />
                                    <div>
                                        <div className={`text-xs font-bold ${aisConnected ? 'text-emerald-300' : 'text-yellow-300'}`}>
                                            {aisConnected ? 'AIS STREAM CONNECTED' : 'CONNECTING TO AIS...'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono">
                                            {liveVesselCount} vessels tracked in real-time
                                            {aisLastUpdate && ` • Last update: ${aisLastUpdate.toLocaleTimeString()}`}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${aisConnected ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400 animate-bounce'}`}></div>
                            </div>

                            <InteractiveMap
                                incidents={[
                                    // Live AIS Vessels (priority)
                                    ...liveVesselIncidents,
                                    // OSINT Naval Incidents
                                    ...incidents.filter((i: WarRoomIncident) => i.type === 'naval'),
                                    // Known Naval Bases
                                    ...NAVAL_FACILITIES.map(f => ({
                                        id: f.id,
                                        type: 'naval' as const,
                                        title: `${f.name} (${f.country})`,
                                        description: f.description,
                                        severity: 'info' as const,
                                        location: f.location,
                                        country: f.country,
                                        timestamp: new Date().toISOString(),
                                        source: 'Known Base',
                                        url: '#'
                                    }))
                                ].filter((incident: WarRoomIncident) => {
                                    if (navalFilter === 'ALL') return true;
                                    const c = (incident.country || '').toUpperCase();
                                    if (navalFilter === 'western') return ['US', 'UK', 'FR', 'DE', 'JP', 'NATO', 'KR', 'AU', 'IT'].includes(c);
                                    if (navalFilter === 'eastern') return ['CN', 'KP'].includes(c);
                                    if (navalFilter === 'russia') return ['RU'].includes(c);
                                    if (navalFilter === 'neutral') return ['IN', 'BR', 'ZA'].includes(c);
                                    if (navalFilter === 'hostile') return ['IR', 'SY'].includes(c);
                                    return true;
                                })}
                                hasNavalContext={true}
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-xl p-5 shadow-xl border border-slate-800">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Live Intel Metrics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Alerts</span>
                                        <span className="text-lg font-mono text-white font-bold">{incidents.filter((i: WarRoomIncident) => i.type === 'naval').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Critical Priority</span>
                                        <span className="text-lg font-mono text-red-500 font-bold">{incidents.filter((i: WarRoomIncident) => i.type === 'naval' && i.severity === 'critical').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sources Monitored</span>
                                        <span className="text-lg font-mono text-blue-400 font-bold">LIVE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Shield className="h-3 w-3" />
                                        STRATEGIC FLEET ADVISORY
                                    </h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    {incidents.filter((i: WarRoomIncident) => i.type === 'naval').slice(0, 5).map((inc: WarRoomIncident) => (
                                        <div key={inc.id} className="group relative">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${inc.country === 'US' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                    {inc.country}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">LIVE</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase">
                                                {inc.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 font-medium">{inc.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 font-mono">
                                    MARITIME INTEL STREAM
                                </h3>
                                <div className="space-y-4">
                                    {navalArticles.map((article: Article) => (
                                        <FeedCard key={article.id} article={article} />
                                    ))}
                                    <div ref={nvRef} className="pt-4 flex justify-center">
                                        {loadingNv && <Loader2 size={16} className="animate-spin text-blue-500" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Width Naval Articles Feed */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-6">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-mono">
                                <Radio className="h-4 w-4 text-blue-500 animate-pulse" />
                                GLOBAL MARITIME INTELLIGENCE STREAM
                            </h2>
                        </div>
                        <div className="p-6">
                            {navalArticles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {navalArticles.map((article: Article) => (
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

            {/* Current Wars View */}
            {activeTab === 'CURRENT_WARS' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Israel / Gaza */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 text-slate-900 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                    ISRAEL / GAZA / LEBANON
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {israelGazaArticles.map((article: Article) => (
                                    <FeedCard key={article.id} article={article} />
                                ))}
                                {israelGazaArticles.length === 0 && <div className="text-center py-10 text-slate-400 font-mono">Loading Intelligence...</div>}
                                {israelGazaArticles.length > 0 && (
                                    <button onClick={loadMoreGaza} className="w-full mt-4 text-[10px] font-bold text-slate-500 hover:text-orange-500 py-2 border-t border-slate-100 uppercase tracking-[0.2em] font-mono">
                                        Load More Intel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Russia / Ukraine */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2 text-slate-900 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    RUSSIA / UKRAINE
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {russiaUkraineArticles.map((article: Article) => (
                                    <FeedCard key={article.id} article={article} />
                                ))}
                                {russiaUkraineArticles.length === 0 && <div className="text-center py-10 text-slate-400 font-mono">Loading Intelligence...</div>}
                                {russiaUkraineArticles.length > 0 && (
                                    <button onClick={loadMoreUkraine} className="w-full mt-4 text-[10px] font-bold text-slate-500 hover:text-red-500 py-2 border-t border-slate-100 uppercase tracking-[0.2em] font-mono">
                                        Load More Intel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


