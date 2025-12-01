'use client';

import { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Lock, Ship, Plane, Loader2, ArrowUp } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedCard } from '@/components/feed/FeedCard';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';
import { getWarRoomData } from '@/lib/osint';
import { Article } from '@/types';

// export const runtime = 'edge'; // Removed to fix Vercel deployment size limit
// Prevent static generation for this page to ensure real-time data
export const dynamic = 'force-dynamic';

export default function WarRoomPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

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
    }, []);

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

    // Helper to map lat/long to CSS percentage (approximate for Mercator projection)
    // Map bounds: Lat -60 to 85, Lng -180 to 180
    const getMapPosition = (lat: number, lng: number) => {
        const x = ((lng + 180) / 360) * 100;
        const y = ((90 - lat) / 180) * 100; // Simplified; real Mercator is complex but this works for visual approximation
        return { top: `${y}%`, left: `${x}%` };
    };

    // Calculate DEFCON level based on critical incidents
    const criticalCount = incidents.filter(i => i.severity === 'critical').length;
    const defconLevel = criticalCount > 5 ? 2 : criticalCount > 2 ? 3 : 4;
    const defconColor = defconLevel === 2 ? 'text-red-600 bg-red-50 border-red-200' :
        defconLevel === 3 ? 'text-orange-600 bg-orange-50 border-orange-200' :
            'text-yellow-600 bg-yellow-50 border-yellow-200';

    return (
        <div className="space-y-6">
            {/* Top Bar: Ticker & Clock */}
            <div className="flex flex-col lg:flex-row gap-4 mb-2">
                <div className="flex-1 bg-black text-white rounded-lg overflow-hidden flex items-center shadow-md border border-gray-800">
                    <div className="bg-red-600 px-4 py-2 font-bold text-xs uppercase tracking-wider shrink-0 animate-pulse">
                        LIVE INTEL
                    </div>
                    <div className="overflow-hidden whitespace-nowrap w-full">
                        <div className="inline-block animate-marquee pl-4 text-sm font-mono text-green-400">
                            {incidents.length > 0 ? incidents.map(i => (
                                <span key={i.id} className="mr-12">
                                    <span className={i.severity === 'critical' ? 'text-red-500 font-bold' : 'text-green-400'}>
                                        [{i.type.toUpperCase()}]
                                    </span> {i.title}
                                </span>
                            )) : "INITIALIZING GLOBAL SENSORS..."}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900 text-green-500 font-mono rounded-lg px-6 py-2 flex items-center justify-center border border-gray-800 shadow-md min-w-[140px]">
                    <Clock />
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div className="flex-1">
                    <PageHeader
                        title="War Room"
                        description="THE SITUATION ROOM"
                        insight="Direct uplink to global intelligence streams from Defense.gov, State Dept, ISW, and Bellingcat. Intercepting proxy signals from CIA, Mossad, FSB, and MI6."
                        icon={<Shield className="w-8 h-8 text-red-600 animate-pulse" />}
                    />
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border mb-8 ml-4 ${defconColor}`}>
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${defconLevel === 2 ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${defconLevel === 2 ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                    </span>
                    <span className="text-sm font-bold">DEFCON {defconLevel}: {defconLevel === 2 ? 'CRITICAL' : defconLevel === 3 ? 'ELEVATED' : 'MODERATE'}</span>
                </div>
            </div>

            {/* Situation Report (SITREP) Explainer */}
            <div className="bg-black border border-gray-800 rounded-xl p-5 mb-6 shadow-2xl relative overflow-hidden group hover:border-red-900 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Activity className="h-3 w-3 text-red-500" />
                            EYES ONLY: GLOBAL THREAT MATRIX ACTIVE
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed font-mono max-w-3xl">
                            You have entered the Novai Situation Room. This is not news. This is <span className="text-white font-bold">Raw Intelligence</span>.
                            We aggregate real-time data from <span className="text-white font-bold">Official Government Feeds</span> (DoD, NATO, UK MoD), <span className="text-white font-bold">Strategic Think Tanks</span> (ISW, CSIS), and <span className="text-white font-bold">Agency Proxies</span> to map kinetic and cyber warfare as it happens.
                            <br />
                            <span className="text-red-500 font-bold">TRACKING:</span> Troop Mobilizations, Naval Strike Groups, Air Sorties, and State-Sponsored Cyber Attacks.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-green-500 bg-gray-900 px-3 py-2 rounded border border-gray-800 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            UPLINK: SECURE
                        </span>
                        <span className="w-px h-3 bg-gray-700"></span>
                        <span>ENCRYPTION: MIL-SPEC-256</span>
                    </div>
                </div>
            </div>

            {/* Global Threat Map (Visual Only) */}
            <div className="bg-gray-950 rounded-xl border border-gray-800 p-6 shadow-2xl relative overflow-hidden min-h-[600px]">
                {/* Map Background - Brightened and Contained to show full world */}
                <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain pointer-events-none invert"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start mb-12">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono tracking-tight">
                        <Globe className="h-5 w-5 text-red-500 animate-spin-slow" />
                        LIVE SATELLITE TRACKING
                    </h2>
                    <div className="flex gap-4 text-xs font-mono text-gray-400 bg-black/80 backdrop-blur-md p-2 rounded border border-gray-800">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> KINETIC
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> CYBER
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-700 pl-2 ml-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> NATO/ALLIED
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span> REDFOR
                        </div>
                    </div>
                </div>

                {/* Map Hotspots (Dynamic) */}
                <div className="relative h-96 w-full">
                    {incidents.map((incident) => {
                        const pos = getMapPosition(incident.location.lat, incident.location.lng);
                        // Color logic based on Type AND Country
                        let colorClass = 'bg-blue-500';
                        let textClass = 'text-blue-400';

                        if (incident.type === 'conflict') {
                            colorClass = 'bg-orange-600';
                            textClass = 'text-orange-500';
                        } else if (incident.type === 'naval' || incident.type === 'air') {
                            // Country-specific coloring for assets
                            if (incident.country === 'US' || incident.country === 'UK') {
                                colorClass = 'bg-blue-600';
                                textClass = 'text-blue-500';
                            } else if (incident.country === 'RU' || incident.country === 'CN' || incident.country === 'IR') {
                                colorClass = 'bg-red-600';
                                textClass = 'text-red-500';
                            } else {
                                colorClass = 'bg-gray-500';
                                textClass = 'text-gray-400';
                            }
                        } else if (incident.type === 'cyber') {
                            colorClass = 'bg-cyan-500';
                            textClass = 'text-cyan-400';
                        }

                        // Random delay for pulse animation to make it look more organic
                        const delay = Math.random() * 2 + 's';

                        return (
                            <div
                                key={incident.id}
                                className="absolute group cursor-pointer"
                                style={{ top: pos.top, left: pos.left }}
                            >
                                <span className={`absolute -inset-6 rounded-full ${colorClass} opacity-10 animate-ping`} style={{ animationDuration: '4s', animationDelay: delay }}></span>
                                <span className={`absolute -inset-3 rounded-full ${colorClass} opacity-30 animate-pulse`}></span>

                                {/* Icon for Naval/Air, Dot for others */}
                                {incident.type === 'naval' ? (
                                    <div className={`w-5 h-5 ${colorClass} rounded-sm border border-white/20 relative z-10 shadow-[0_0_15px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-45`}>
                                        <Ship size={10} className="text-white transform -rotate-45" />
                                    </div>
                                ) : incident.type === 'air' ? (
                                    <div className={`w-5 h-5 ${colorClass} rounded-full border border-white/20 relative z-10 shadow-[0_0_15px_rgba(0,0,0,1)] flex items-center justify-center`}>
                                        <Plane size={10} className="text-white" />
                                    </div>
                                ) : (
                                    <div className={`w-3 h-3 ${colorClass} rounded-full border border-white/50 relative z-10 shadow-[0_0_10px_rgba(0,0,0,1)]`}></div>
                                )}

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-black/90 backdrop-blur-xl text-white text-xs p-4 rounded-sm border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                    <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                                        <strong className={`block ${textClass} uppercase text-[10px] tracking-wider font-mono`}>
                                            {incident.type === 'naval' || incident.type === 'air' ? `${incident.country} ${incident.assetType}` : incident.type}
                                        </strong>
                                        <span className="text-gray-500 text-[9px] font-mono">{new Date(incident.timestamp).toLocaleTimeString()} UTC</span>
                                    </div>
                                    <div className="font-bold mb-2 text-sm font-mono text-white">{incident.title}</div>
                                    <div className="text-gray-400 text-[10px] leading-relaxed font-mono">{incident.description}</div>
                                    <div className="mt-2 text-[9px] text-red-500 font-mono uppercase tracking-widest flex justify-between">
                                        <span>LOC: {incident.location.region.toUpperCase()}</span>
                                        <span>SRC: {incident.source.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Incident Log & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Active Incidents (Real-Time Feed) */}
                <div className="lg:col-span-2 bg-gray-950 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                            <Activity className="h-5 w-5 text-green-500" />
                            RAW INTEL STREAM
                        </h2>
                        <span className="text-xs font-bold text-green-500 uppercase animate-pulse">● LIVE UPLINK ACTIVE</span>
                    </div>

                    <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar bg-black/20">
                        {loading ? (
                            <ResourceLoader message="Decrypting global intelligence streams..." />
                        ) : articles.length > 0 ? (
                            <>
                                {articles.map(article => (
                                    <FeedCard key={article.id} article={article} />
                                ))}

                                {/* Load More Trigger */}
                                <div className="pt-4 flex justify-center">
                                    {hasMore ? (
                                        <button
                                            onClick={loadMore}
                                            disabled={loadingMore}
                                            className="px-6 py-2 bg-gray-900 border border-gray-700 text-green-500 font-mono text-xs hover:bg-gray-800 transition-colors rounded flex items-center gap-2"
                                        >
                                            {loadingMore ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUp className="h-3 w-3 rotate-180" />}
                                            {loadingMore ? 'DECRYPTING MORE...' : 'LOAD OLDER INTEL'}
                                        </button>
                                    ) : (
                                        <span className="text-gray-600 font-mono text-xs">END OF STREAM</span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-600 font-mono">
                                Awaiting incoming signals...
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Status */}
                <div className="bg-gray-950 rounded-xl border border-gray-800 p-6 shadow-2xl h-fit sticky top-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
                        <Lock className="h-5 w-5 text-gray-400" />
                        SYSTEM STATUS
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-mono">
                                <span className="text-gray-400">GLOBAL STABILITY</span>
                                <span className={`font-bold ${defconLevel === 2 ? 'text-red-500' : 'text-amber-500'}`}>
                                    {defconLevel === 2 ? 'CRITICAL' : 'UNSTABLE'}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                                <div className={`h-full w-[${defconLevel === 2 ? '85%' : '65%'}] ${defconLevel === 2 ? 'bg-red-600' : 'bg-amber-600'} animate-pulse`}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2 font-mono">
                                <span className="text-gray-400">CYBER THREAT LEVEL</span>
                                <span className="font-bold text-orange-500">HIGH</span>
                            </div>
                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                                <div className="h-full bg-orange-600 w-[75%]"></div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 font-mono">ACTIVE MONITORING</h3>
                            <ul className="space-y-3 font-mono">
                                <li className="flex gap-2 text-xs text-gray-400">
                                    <span className="text-red-500 animate-pulse">●</span>
                                    <span>CIA / NSA / FIVE EYES</span>
                                </li>
                                <li className="flex gap-2 text-xs text-gray-400">
                                    <span className="text-blue-500 animate-pulse">●</span>
                                    <span>MOSSAD / IDF / SHIN BET</span>
                                </li>
                                <li className="flex gap-2 text-xs text-gray-400">
                                    <span className="text-orange-500 animate-pulse">●</span>
                                    <span>FSB / SVR / GRU</span>
                                </li>
                                <li className="flex gap-2 text-xs text-gray-400">
                                    <span className="text-green-500 animate-pulse">●</span>
                                    <span>MI6 / GCHQ / DGSE / BND</span>
                                </li>
                                <li className="flex gap-2 text-xs text-gray-400">
                                    <span className="text-yellow-500 animate-pulse">●</span>
                                    <span>MSS / RGB / MOIS</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 30-Day Brief */}
            <div className="mt-12 pt-8 border-t border-gray-800">
                <MonthlyIntelBrief articles={articles} fullView={true} category="conflict" />
            </div>
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
