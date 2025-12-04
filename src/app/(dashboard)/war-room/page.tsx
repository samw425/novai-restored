'use client';

import { useState, useEffect } from 'react';
import { Shield, Activity, Globe, Lock, Loader2, ArrowUp, AlertOctagon, Radio } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedCard } from '@/components/feed/FeedCard';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';
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
                    <div className="bg-red-600 px-4 py-3 font-bold text-xs uppercase tracking-wider shrink-0 animate-pulse flex items-center gap-2">
                        <Radio size={14} />
                        LIVE INTEL
                    </div>
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

            {/* Tab Navigation (Segmented Control) */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-900 p-1 rounded-lg inline-flex border border-slate-800 shadow-sm">
                    <button
                        onClick={() => setActiveTab('GLOBAL_INTEL')}
                        className={`px-6 py-2 rounded-md text-sm font-mono transition-all duration-200 flex items-center gap-2 ${activeTab === 'GLOBAL_INTEL' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Globe size={14} />
                        GLOBAL INTEL
                    </button>
                    <button
                        onClick={() => setActiveTab('CURRENT_WARS')}
                        className={`px-6 py-2 rounded-md text-sm font-mono transition-all duration-200 flex items-center gap-2 ${activeTab === 'CURRENT_WARS' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <AlertOctagon size={14} />
                        CURRENT WARS
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div className="flex-1">
                    <PageHeader
                        title="War Room"
                        description="GLOBAL SITUATION ROOM // LIVE"
                        insight="Direct uplink to global intelligence streams. Tracking kinetic warfare, naval maneuvers, and cyber threats in real-time. Data is aggregated from classified and open sources."
                        icon={<Shield className="w-8 h-8 text-red-600 animate-pulse" />}
                    />
                    <div className="mt-2 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            UPDATED BY THE MINUTE
                        </span>
                    </div>
                </div>
                <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border shadow-lg ${defconColor}`}>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Threat Level</span>
                        <span className="text-2xl font-black tracking-tighter">DEFCON {defconLevel}</span>
                    </div>
                    <div className="h-10 w-px bg-current opacity-20 mx-2"></div>
                    <span className="relative flex h-4 w-4">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${defconLevel === 2 ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-4 w-4 ${defconLevel === 2 ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                    </span>
                </div>
            </div>

            {/* Active Military Alarms Banner */}
            {criticalCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm">
                    <AlertOctagon className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-red-700 font-bold text-sm uppercase tracking-widest mb-1">Active Military Alarms</h3>
                        <p className="text-red-900 text-sm font-mono font-medium">
                            {criticalCount} critical incidents detected requiring immediate attention. Global force posture elevated.
                        </p>
                    </div>
                </div>
            )}

            {/* Interactive Global Threat Map (Only in Global Intel Tab) */}
            {activeTab === 'GLOBAL_INTEL' && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-mono tracking-tight">
                            <Globe className="h-5 w-5 text-blue-600" />
                            LIVE SATELLITE TRACKING
                        </h2>
                        <div className="text-xs font-mono text-gray-500">
                            ASSETS TRACKED: {incidents.length} // UPDATED: {new Date().toLocaleTimeString()}
                        </div>
                    </div>

                    <InteractiveMap incidents={incidents} />
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
                        <div className="p-0 flex-1 bg-slate-50/50">
                            {warFeedsLoading ? (
                                <div className="p-12"><ResourceLoader message="Establishing uplink..." /></div>
                            ) : (
                                <div className="space-y-4">
                                    {israelGazaArticles.map(article => (
                                        <FeedCard key={article.id} article={article} />
                                    ))}
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
                        <div className="p-0 flex-1 bg-slate-50/50">
                            {warFeedsLoading ? (
                                <div className="p-12"><ResourceLoader message="Establishing uplink..." /></div>
                            ) : (
                                <div className="space-y-4">
                                    {russiaUkraineArticles.map(article => (
                                        <FeedCard key={article.id} article={article} />
                                    ))}
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
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-mono">
                                <Activity className="h-5 w-5 text-blue-500" />
                                RAW INTEL STREAM
                            </h2>
                            <span className="text-xs font-bold text-green-600 uppercase animate-pulse flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                LIVE UPLINK ACTIVE
                            </span>
                        </div>

                        <div className="p-0">
                            {loading ? (
                                <div className="p-8">
                                    <ResourceLoader message="Decrypting global intelligence streams..." />
                                </div>
                            ) : articles.length > 0 ? (
                                <div className="space-y-4">
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
            {/* 30-Day Brief */}
            <div className="mt-12 pt-8 border-t border-gray-200">
                <MonthlyIntelBrief />
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
