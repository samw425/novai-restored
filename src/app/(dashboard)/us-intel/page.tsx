'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import {
    Shield,
    Globe,
    Lock,
    AlertTriangle,
    Radio,
    Activity,
    ExternalLink,
    ArrowUpRight,
    Loader2,
    Eye,
    Terminal,
    Zap,
    FileText,
    Siren,
    BookOpen
} from 'lucide-react';
import { AGENCY_PROFILES } from '@/lib/data/us-intel-profiles';

// Define the shape of our expanded agency profile
interface AgencyProfile {
    name: string;
    acronym: string;
    founded: string;
    headquarters: string;
    director: string;
    budget: string;
    mission: string;
    mission_url?: string;
    jurisdiction: string;
    special_units: string[];
    known_associates: string[];
    active_directives: {
        title: string;
        description: string;
        link?: string;
    }[];
    budget_history?: { year: number; amount: string; }[]; // Optional field
    controversies: {
        title: string;
        description: string;
        link?: string;
    }[];
    key_personnel: {
        name: string;
        role: string;
        notes?: string;
    }[];
    classified_annex?: {
        codename: string;
        shadow_budget: string;
        unacknowledged_projects: string[];
        deep_fact: string;
        source_url?: string;
    };
}

export default function USIntelPage() {
    const [activeAgency, setActiveAgency] = useState('ALL');
    const [viewMode, setViewMode] = useState<'FEED' | 'DOSSIER'>('FEED');
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);

    // Infinite Scroll State
    const [visibleCount, setVisibleCount] = useState(20);
    const observerTarget = useRef(null);

    // Initial Fetch
    const fetchFeed = async () => {
        setIsScanning(true);
        try {
            const res = await fetch('/api/us-intel');
            const data = await res.json();
            if (data.items) {
                // Simulate "new intel" arriving by prepending if we already have items
                setFeedItems(prev => {
                    if (prev.length === 0) return data.items;
                    // Filter out duplicates based on link or title
                    const newItems = data.items.filter((newItem: any) => !prev.some(existing => existing.link === newItem.link));
                    return [...newItems, ...prev];
                });
            }
        } catch (e) {
            console.error("Failed to fetch US Intel feed", e);
        } finally {
            setLoading(false);
            setTimeout(() => setIsScanning(false), 1500); // Keep scanning animation for effect
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    // Auto-Refresh Interval (30s for "Minute by Minute" feel)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchFeed();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Infinite Scroll Observer
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting) {
            setVisibleCount(prev => prev + 20); // Load more items
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 0.1
        });
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [handleObserver]);

    const activeProfile = activeAgency !== 'ALL' ? AGENCY_PROFILES[activeAgency as keyof typeof AGENCY_PROFILES] : null;

    const filteredItems = feedItems.filter(item => {
        if (activeAgency === 'ALL') return true;
        return item.agency === activeAgency;
    });

    const visibleItems = filteredItems.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 text-slate-900 font-sans overflow-x-hidden">
            <PageHeader
                title="US INTEL"
                description="DOMESTIC & FOREIGN OPERATIONS"
                insight="Aggregating real-time AI updates, directives, and reports from 16+ US Intelligence Community agencies. Our AI vector engine isolates critical national security and emerging technology threats."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

                {/* AGENCY SELECTOR - Apple Style Segmented Control */}
                <div className="flex overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
                    <div className="flex items-center gap-1 p-1 bg-slate-100/80 backdrop-blur-md rounded-xl border border-slate-200/50 mx-auto sm:mx-0 min-w-max">
                        <button
                            onClick={() => {
                                setActiveAgency('ALL');
                                setViewMode('FEED');
                            }}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeAgency === 'ALL'
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            <Activity size={14} className={activeAgency === 'ALL' ? 'text-blue-500' : 'opacity-50'} />
                            Global Wire
                        </button>

                        <div className="w-px h-4 bg-slate-200 mx-1" />

                        {Object.entries(AGENCY_PROFILES).map(([key, profile]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    setActiveAgency(key);
                                    setViewMode('FEED');
                                }}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${activeAgency === key
                                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                    }`}
                            >
                                {profile.acronym}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* LEFT COLUMN: MAIN CONTENT (Feed or Dossier) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-100 shrink-0 sticky top-0 bg-white z-20">
                                <button
                                    onClick={() => setViewMode('FEED')}
                                    className={`flex-1 py-4 px-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${viewMode === 'FEED'
                                        ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                                        : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Radio size={14} className={viewMode === 'FEED' ? 'animate-pulse text-red-600' : ''} />
                                        <span className="hidden sm:inline">{activeAgency === 'ALL' ? 'Global Wire' : `${activeAgency} Live Feed`}</span>
                                        <span className="sm:hidden">Feed</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setViewMode('DOSSIER')}
                                    className={`flex-1 py-4 px-2 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${viewMode === 'DOSSIER'
                                        ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                                        : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <BookOpen size={14} />
                                        <span className="hidden sm:inline">{activeAgency === 'ALL' ? 'Agency Dossiers' : `${activeAgency} Education`}</span>
                                        <span className="sm:hidden">Dossier</span>
                                    </div>
                                </button>
                            </div>

                            {/* CONTENT AREA */}
                            <div>
                                {viewMode === 'FEED' ? (
                                    <div>
                                        {/* Header for Feed */}
                                        <div className="p-4 bg-slate-50/80 flex justify-between items-center border-b border-slate-100 sticky top-12 z-10 backdrop-blur-md">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                                                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
                                                    {isScanning ? 'SCANNING NETWORKS...' : 'FEED ACTIVE'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-100 rounded">
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">LIVE</span>
                                                </div>
                                            </div>
                                        </div>

                                        {loading && feedItems.length === 0 ? (
                                            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                                <Loader2 size={48} className="animate-spin mb-6 text-blue-500" />
                                                <span className="text-sm font-mono uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</span>
                                            </div>
                                        ) : (
                                            <div className="p-0">
                                                {visibleItems.length > 0 ? visibleItems.map((item, index) => {
                                                    const isLive = (new Date().getTime() - new Date(item.pubDate).getTime()) < 2 * 60 * 60 * 1000;
                                                    return (
                                                        <div key={`${item.link}-${index}`} className="p-4 sm:p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors group relative">
                                                            <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
                                                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${item.agency === 'FBI' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                        item.agency === 'CIA' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                                                            item.agency === 'NSA' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                                'bg-orange-50 text-orange-700 border-orange-100'
                                                                        }`}>
                                                                        {item.agency}
                                                                    </span>
                                                                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                                                                        {(() => {
                                                                            try {
                                                                                const date = new Date(item.pubDate);
                                                                                if (isNaN(date.getTime())) return 'Unknown Date';
                                                                                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                                                            } catch (e) {
                                                                                return 'Unknown Date';
                                                                            }
                                                                        })()}
                                                                    </span>
                                                                    {isLive && (
                                                                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase tracking-wider animate-pulse border border-red-100">
                                                                            LIVE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <ExternalLink size={14} className="text-slate-400 hover:text-blue-600" />
                                                                </a>
                                                            </div>

                                                            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors break-words">
                                                                {item.title}
                                                            </h3>

                                                            {item.novai_analysis && (
                                                                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
                                                                    <div className="flex items-center gap-1.5 mb-1">
                                                                        <Activity size={12} className="text-blue-600" />
                                                                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Novai Analysis</span>
                                                                    </div>
                                                                    <p className="text-xs text-blue-900/80 font-medium leading-relaxed break-words">
                                                                        {item.novai_analysis}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                                                        <div className="text-sm font-bold mb-1">No Recent Intel for {activeAgency}</div>
                                                        <div className="text-xs">Scanning frequencies...</div>
                                                    </div>
                                                )}
                                                <div ref={observerTarget} className="h-20 w-full flex items-center justify-center text-slate-400 text-xs font-mono uppercase tracking-widest">
                                                    {loading ? 'Loading Archives...' : 'Awaiting Further Intel...'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 sm:p-8">
                                        {/* DOSSIER CONTENT */}
                                        {activeProfile ? (
                                            <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                {/* Header */}
                                                <div className="flex flex-col gap-6 border-b border-slate-100 pb-8">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase">
                                                                US Intelligence Community
                                                            </span>
                                                            {activeProfile.acronym && (
                                                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                                                                    {activeProfile.acronym}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-2 break-words hyphens-auto">
                                                            {activeProfile.name}
                                                        </h2>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                            <span>Est. {activeProfile.founded}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                                            <span>{activeProfile.headquarters}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                            <span className="font-mono text-emerald-700">{activeProfile.budget}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mission Statement - Clean Apple Style */}
                                                <div className="py-2">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                            <Globe size={16} className="text-blue-600" />
                                                            Mission Profile
                                                        </h3>
                                                        <a
                                                            href={activeProfile.mission_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                                        >
                                                            Official Source
                                                            <ArrowUpRight size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                                        </a>
                                                    </div>

                                                    <div className="relative mb-8">
                                                        <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-800 leading-tight tracking-tight">
                                                            "{activeProfile.mission}"
                                                        </p>
                                                    </div>

                                                    {/* AI STANCE - New Section */}
                                                    {(activeProfile as any).ai_stance && (
                                                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100/50">
                                                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                <Activity size={14} />
                                                                AI & Tech Doctrine
                                                            </h3>
                                                            <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed">
                                                                {(activeProfile as any).ai_stance}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Active Directives */}
                                                <div className="pt-8 border-t border-slate-100">
                                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                                        <Zap size={16} className="text-amber-500" />
                                                        Key Directives
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {activeProfile.active_directives.map((directive, i) => (
                                                            <a
                                                                key={i}
                                                                href={directive.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group block p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100"
                                                            >
                                                                <div className="flex items-start justify-between mb-4">
                                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors">
                                                                        <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600">{i + 1}</span>
                                                                    </div>
                                                                    <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                                                </div>
                                                                <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors pr-4">
                                                                    {directive.title}
                                                                </h4>
                                                                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600">
                                                                    {directive.description}
                                                                </p>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Classified Annex */}
                                                <div className="mt-12 pt-8 border-t border-slate-200">
                                                    <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
                                                        {/* Header - Digital Terminal Style */}
                                                        <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <Lock size={14} className="text-red-500 animate-pulse" />
                                                                <span className="text-[10px] font-mono font-bold text-red-500 tracking-widest uppercase">
                                                                    RESTRICTED ACCESS // LEVEL 5
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] font-mono text-slate-500">
                                                                ID: {activeProfile.classified_annex.codename}
                                                            </div>
                                                        </div>

                                                        <div className="p-6 sm:p-8 relative z-20">
                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                                                                {/* Left Column: Financials & Projects */}
                                                                <div className="space-y-8">
                                                                    <div>
                                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                                            <Activity size={14} />
                                                                            Fiscal Analysis (Classified Programs)
                                                                        </h4>

                                                                        {/* Budget Visualization */}
                                                                        <div className="space-y-4">
                                                                            <div>
                                                                                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                                                                                    <span>Official Funding</span>
                                                                                    <span className="text-emerald-500">{activeProfile.budget}</span>
                                                                                </div>
                                                                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                                                                    <div className="h-full bg-emerald-600 w-3/4 rounded-full opacity-80" />
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                                                                                    <span>Est. Classified Funding</span>
                                                                                    <span className="text-red-500">{activeProfile.classified_annex.shadow_budget}</span>
                                                                                </div>
                                                                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                                                                    <div className="h-full bg-red-600 w-1/2 rounded-full opacity-60 pattern-diagonal-lines" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                            <Terminal size={14} />
                                                                            Notable Classified Operations
                                                                        </h4>
                                                                        <ul className="space-y-3">
                                                                            {activeProfile.classified_annex.unacknowledged_projects.map((proj: string, i: number) => (
                                                                                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-mono group cursor-help">
                                                                                    <span className="text-red-900 mt-1 group-hover:text-red-500 transition-colors shrink-0">►</span>
                                                                                    <span className="border-b border-transparent group-hover:border-red-900/50 transition-colors break-words">{proj}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                                {/* Right Column: Deep Analysis */}
                                                                <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6 relative">
                                                                    <div className="absolute top-0 right-0 p-2">
                                                                        <Eye size={16} className="text-slate-700" />
                                                                    </div>
                                                                    <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-4">
                                                                        Strategic Context
                                                                    </div>
                                                                    <p className="text-sm text-slate-300 leading-loose font-medium font-serif italic opacity-90 break-words">
                                                                        "{activeProfile.classified_annex.deep_fact}"
                                                                    </p>
                                                                    <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center gap-2">
                                                                        <a href={activeProfile.classified_annex.source_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-red-400 font-mono uppercase transition-colors flex items-center gap-2">
                                                                            Source: Declassified <ExternalLink size={10} />
                                                                        </a>
                                                                        <span className="text-[10px] text-slate-600 font-mono uppercase">Verified: {new Date().getFullYear()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-[600px] text-slate-400 p-8 text-center">
                                                <div className="relative">
                                                    <Shield size={64} className="mb-6 opacity-20" />
                                                </div>
                                                <div className="text-2xl font-black tracking-tight text-slate-300">SELECT AN AGENCY</div>
                                                <p className="text-sm mt-3 font-mono uppercase tracking-widest text-slate-400">Access Educational Dossiers & Live Feeds</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PRIORITY ALERTS (Real-Time) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Critical Threats Module */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                <Siren size={18} className="text-red-600 animate-pulse" />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Priority Alerts</h3>
                            </div>

                            <div className="space-y-4">
                                {feedItems.filter(i =>
                                    (i.novai_analysis?.includes('CRITICAL') || i.title.includes('Urgent') || i.title.includes('Warning'))
                                ).length > 0 ? (
                                    feedItems.filter(i =>
                                        (i.novai_analysis?.includes('CRITICAL') || i.title.includes('Urgent') || i.title.includes('Warning'))
                                    ).slice(0, 3).map((alert, i) => (
                                        <div key={i} className="p-4 rounded-lg bg-red-50 border border-red-100 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <AlertTriangle size={14} className="text-red-500" />
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                                                <span className="text-[10px] font-black text-red-700 uppercase tracking-wider">Critical Threat</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 leading-snug mb-3 break-words">
                                                {alert.title}
                                            </p>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-red-200 gap-2">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">Source: {alert.agency}</span>
                                                <a href={alert.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-red-600 font-bold hover:text-red-800 flex items-center gap-1 whitespace-nowrap">
                                                    VIEW INTEL <ArrowUpRight size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
                                        <span className="text-xs font-bold text-slate-400">No Active Critical Threats Detected</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Most Wanted / High Value Targets */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                <Eye size={18} className="text-blue-600" />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Most Wanted / HVT</h3>
                            </div>

                            <div className="space-y-4">
                                {feedItems.filter(i => i.title.includes('Wanted') || i.title.includes('Fugitive')).length > 0 ? (
                                    feedItems.filter(i => i.title.includes('Wanted') || i.title.includes('Fugitive')).slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 group">
                                            <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-blue-400 transition-colors">
                                                <Globe size={16} className="text-slate-400 group-hover:text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors break-words">{item.title}</div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-[10px] font-mono text-red-600 uppercase">Status: Active Pursuit</div>
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-blue-600">
                                                        <ExternalLink size={10} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Loader2 size={24} className="animate-spin mx-auto mb-2 text-slate-400" />
                                        <div className="text-xs text-slate-400 italic">Scanning Global Databases...</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
