'use client';

import { useState, useEffect } from 'react';
import { Shield, Globe, Activity, Lock, Eye, AlertOctagon, Loader2, Ship, Plane } from 'lucide-react';
import { Article } from '@/types';
import { FeedCard } from '@/components/feed/FeedCard';
import { ResourceLoader } from '@/components/ui/ResourceLoader';

export default function WarRoomPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ONLY strict War Room OSINT data
                // We no longer fetch generic 'policy' news to ensure 100% relevance
                const mapRes = await fetch('/api/feed/war-room', { cache: 'no-store' });
                const mapData = await mapRes.json();

                if (mapData.incidents) {
                    setIncidents(mapData.incidents);
                    // Use the same strict OSINT data for the list view
                    // Convert WarRoomIncident[] to Article[] shape for the FeedCard component
                    // or better, create a specialized IncidentCard. For now, we map to Article.
                    const strictArticles = mapData.incidents.map((inc: any) => ({
                        id: inc.id,
                        title: inc.title,
                        description: inc.description,
                        url: inc.url,
                        source: inc.source,
                        publishedAt: inc.timestamp,
                        category: inc.type, // 'conflict', 'cyber', 'earthquake'
                        image_url: null, // Incidents usually don't have images, we can use icons
                        score: inc.severity === 'critical' ? 10 : 5
                    }));
                    setArticles(strictArticles);
                }

            } catch (error) {
                console.error('Failed to fetch War Room data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <div className="border-b border-gray-200 pb-6 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Risk & Security Monitor</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">War Room</h1>
                    <p className="text-gray-500 mt-2 text-lg">Global incident tracking and threat assessment.</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${defconColor}`}>
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${defconLevel === 2 ? 'bg-red-400' : 'bg-orange-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${defconLevel === 2 ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                    </span>
                    <span className="text-sm font-bold">DEFCON {defconLevel}: {defconLevel === 2 ? 'CRITICAL' : defconLevel === 3 ? 'ELEVATED' : 'MODERATE'}</span>
                </div>
            </div>

            {/* Situation Report (SITREP) Explainer */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <Activity className="h-3 w-3 text-blue-500" />
                            INTELLIGENCE BRIEFING
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium max-w-3xl">
                            Aggregating multi-vector telemetry from classified proxies and open-source signals.
                            Monitoring active <span className="text-gray-900 font-bold">kinetic conflicts</span>, <span className="text-gray-900 font-bold">cyber warfare signatures</span>, and <span className="text-gray-900 font-bold">high-priority security events</span> in real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 bg-gray-50 px-3 py-2 rounded border border-gray-100 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            SIGNAL: STRONG
                        </span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>ENCRYPTION: AES-256</span>
                    </div>
                </div>
            </div>

            {/* Global Threat Map (Visual Only) */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg relative overflow-hidden min-h-[500px]">
                <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-cover pointer-events-none"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <div className="relative z-10 flex justify-between items-start mb-12">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-400" />
                        Global Incident Map (Live OSINT)
                    </h2>
                    <div className="flex gap-4 text-xs font-mono text-gray-400 bg-black/50 p-2 rounded border border-gray-800">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> Conflict
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> Cyber
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-700 pl-2 ml-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> US/NATO
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

                        if (incident.type === 'earthquake') {
                            colorClass = 'bg-red-500';
                            textClass = 'text-red-400';
                        } else if (incident.type === 'conflict') {
                            colorClass = 'bg-orange-500';
                            textClass = 'text-orange-400';
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
                                <span className={`absolute -inset-4 rounded-full ${colorClass} opacity-20 animate-ping`} style={{ animationDuration: '3s', animationDelay: delay }}></span>
                                <span className={`absolute -inset-2 rounded-full ${colorClass} opacity-40 animate-pulse`}></span>

                                {/* Icon for Naval/Air, Dot for others */}
                                {incident.type === 'naval' ? (
                                    <div className={`w-4 h-4 ${colorClass} rounded-full border-2 border-gray-900 relative z-10 shadow-[0_0_10px_rgba(0,0,0,0.8)] flex items-center justify-center`}>
                                        <Ship size={8} className="text-white" />
                                    </div>
                                ) : incident.type === 'air' ? (
                                    <div className={`w-4 h-4 ${colorClass} rounded-full border-2 border-gray-900 relative z-10 shadow-[0_0_10px_rgba(0,0,0,0.8)] flex items-center justify-center`}>
                                        <Plane size={8} className="text-white" />
                                    </div>
                                ) : (
                                    <div className={`w-3 h-3 ${colorClass} rounded-full border-2 border-gray-900 relative z-10 shadow-[0_0_10px_rgba(0,0,0,0.8)]`}></div>
                                )}

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-gray-900/95 backdrop-blur-sm text-white text-xs p-4 rounded border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                    <div className="flex justify-between items-start mb-2 border-b border-gray-700 pb-2">
                                        <strong className={`block ${textClass} uppercase text-[10px] tracking-wider`}>
                                            {incident.type === 'naval' || incident.type === 'air' ? `${incident.country} ${incident.assetType}` : incident.type}
                                        </strong>
                                        <span className="text-gray-500 text-[9px]">{new Date(incident.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="font-bold mb-2 text-sm">{incident.title}</div>
                                    <div className="text-gray-400 text-[10px] leading-relaxed">{incident.description}</div>
                                    <div className="mt-2 text-[9px] text-gray-600 font-mono">{incident.location.region.toUpperCase()}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Incident Log & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Active Incidents (Real-Time Feed) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-gray-700" />
                            Active Incidents & Intel Stream
                        </h2>
                        <span className="text-xs font-bold text-gray-400 uppercase">Real-Time</span>
                    </div>

                    <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <ResourceLoader message="Initializing War Room feeds..." />
                        ) : articles.length > 0 ? (
                            articles.map(article => (
                                <FeedCard key={article.id} article={article} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No active incidents reported.
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Status */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit sticky top-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-gray-700" />
                        System Status
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Global Stability Index</span>
                                <span className={`font-bold ${defconLevel === 2 ? 'text-red-600' : 'text-amber-600'}`}>
                                    {defconLevel === 2 ? 'CRITICAL' : 'UNSTABLE'}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full w-[${defconLevel === 2 ? '85%' : '65%'}] ${defconLevel === 2 ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Cyber Threat Level</span>
                                <span className="font-bold text-orange-600">High</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[75%]"></div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Recent Actions</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-2 text-xs text-gray-600">
                                    <span className="text-emerald-500">●</span>
                                    <span>Monitoring Eastern Europe conflict zones</span>
                                </li>
                                <li className="flex gap-2 text-xs text-gray-600">
                                    <span className="text-blue-500">●</span>
                                    <span>Tracking Pacific naval movements</span>
                                </li>
                                <li className="flex gap-2 text-xs text-gray-600">
                                    <span className="text-red-500">●</span>
                                    <span>Analyzing seismic activity in Ring of Fire</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
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
