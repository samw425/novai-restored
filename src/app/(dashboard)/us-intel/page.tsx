'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
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
    Siren,
    BookOpen,
    Search,
    ChevronRight,
    FileText,
    History
} from 'lucide-react';
import { AGENCY_PROFILES } from '@/lib/data/us-intel-profiles';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';
import { Article } from '@/types';

export default function USIntelPage() {
    const [activeAgency, setActiveAgency] = useState('ALL');
    const [viewMode, setViewMode] = useState<'FEED' | 'DOSSIER'>('FEED');
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [topStories, setTopStories] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observerTarget = useRef(null);

    // Reset state when agency changes
    useEffect(() => {
        setFeedItems([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
        fetchFeed(1, activeAgency, true);
    }, [activeAgency]);

    // Fetch Top Stories for 30-Day Brief (Once on mount)
    useEffect(() => {
        const fetchTopStories = async () => {
            try {
                const res = await fetch('/api/feed/top-stories?limit=10');
                const data = await res.json();
                if (data.articles) {
                    setTopStories(data.articles);
                }
            } catch (error) {
                console.error("Failed to fetch top stories", error);
            }
        };
        fetchTopStories();
    }, []);

    const fetchFeed = async (pageNum: number, agency: string, isInitial: boolean) => {
        try {
            const res = await fetch(`/api/us-intel?page=${pageNum}&limit=20&agency=${agency}`);
            const data = await res.json();

            if (data.items) {
                setFeedItems(prev => isInitial ? data.items : [...prev, ...data.items]);
                setHasMore(data.hasMore);
            }
        } catch (e) {
            console.error("Failed to fetch US Intel feed", e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFeed(nextPage, activeAgency, false);
        }
    };

    // Infinite Scroll Observer
    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && hasMore && !loading && !loadingMore) {
            loadMore();
        }
    }, [hasMore, loading, loadingMore, page, activeAgency]);

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
    }, [handleObserver, viewMode]); // Re-attach when viewMode changes

    const activeProfile = activeAgency !== 'ALL' ? AGENCY_PROFILES[activeAgency as keyof typeof AGENCY_PROFILES] : null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 text-slate-900 font-sans overflow-x-hidden">
            <PageHeader
                title="US INTEL"
                description="DOMESTIC & FOREIGN OPERATIONS"
                insight="Aggregating declassified directives, public hearings, and real-time press releases from the US Intelligence Community."
                icon={<Shield className="w-8 h-8 text-blue-700" />}
            />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

                {/* COMMAND CENTER LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[800px]">

                    {/* LEFT PANEL: AGENCY SELECTOR & DOSSIER NAV */}
                    <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-1 overflow-y-auto custom-scrollbar">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Agencies</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => { setActiveAgency('ALL'); setViewMode('FEED'); }}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-between group ${activeAgency === 'ALL' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Globe size={16} className={activeAgency === 'ALL' ? 'text-blue-600' : 'text-slate-400'} />
                                        <span>Global Wire</span>
                                    </div>
                                    {activeAgency === 'ALL' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                                </button>

                                <div className="h-px bg-slate-100 my-2 mx-2"></div>

                                {Object.entries(AGENCY_PROFILES).map(([key, profile]) => (
                                    <button
                                        key={key}
                                        onClick={() => { setActiveAgency(key); setViewMode('DOSSIER'); }}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-between group ${activeAgency === key ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`font-mono text-xs ${activeAgency === key ? 'text-slate-400' : 'text-slate-300'}`}>{key}</span>
                                            <span>{profile.name}</span>
                                        </div>
                                        <ChevronRight size={14} className={`transition-transform ${activeAgency === key ? 'text-white translate-x-1' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats / Status */}
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">System Status</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-500">UPLINK</span>
                                    <span className="text-emerald-500">ESTABLISHED</span>
                                </div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-500">LATENCY</span>
                                    <span className="text-emerald-500">24ms</span>
                                </div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-500">ENCRYPTION</span>
                                    <span className="text-emerald-500">AES-256</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER PANEL: MAIN CONTENT (FEED OR DOSSIER) */}
                    <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">

                        {/* Content Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                {viewMode === 'FEED' ? (
                                    <div className="flex items-center gap-2">
                                        <Radio size={18} className="text-red-600 animate-pulse" />
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                            {activeAgency === 'ALL' ? 'Live Intelligence Stream' : `${activeAgency} Wire`}
                                        </h2>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={18} className="text-blue-600" />
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                            Agency Dossier: {activeAgency}
                                        </h2>
                                    </div>
                                )}
                            </div>

                            <div className="flex bg-slate-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('FEED')}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${viewMode === 'FEED' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Feed
                                </button>
                                <button
                                    onClick={() => setViewMode('DOSSIER')}
                                    disabled={activeAgency === 'ALL'}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${viewMode === 'DOSSIER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
                                >
                                    Dossier
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 relative">
                            {viewMode === 'FEED' ? (
                                <div className="divide-y divide-slate-100">
                                    {loading && feedItems.length === 0 ? (
                                        <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                            <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
                                            <span className="text-xs font-mono uppercase tracking-widest">Decrypting Signals...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {feedItems.map((item, index) => {
                                                const isLive = (new Date().getTime() - new Date(item.pubDate).getTime()) < 2 * 60 * 60 * 1000;
                                                return (
                                                    <div key={`${item.link}-${index}`} className="p-6 hover:bg-white transition-colors group">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${item.agency === 'FBI' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                item.agency === 'CIA' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                                                    item.agency === 'NSA' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                        'bg-orange-50 text-orange-700 border-orange-100'
                                                                }`}>
                                                                {item.agency}
                                                            </span>
                                                            <span className="text-[10px] font-mono text-slate-400">
                                                                {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {isLive && <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 animate-pulse">LIVE</span>}
                                                        </div>
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group-hover:translate-x-1 transition-transform duration-300">
                                                            <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600">
                                                                {item.title}
                                                            </h3>
                                                        </a>
                                                        {item.novai_analysis && (
                                                            <div className="mt-3 pl-3 border-l-2 border-blue-200">
                                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                                                    {item.novai_analysis}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Infinite Scroll Loader */}
                                            <div ref={observerTarget} className="h-20 flex items-center justify-center p-4">
                                                {loadingMore ? (
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                                                        <Loader2 className="animate-spin h-3 w-3" />
                                                        FETCHING ARCHIVES...
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
                            ) : (
                                activeProfile ? (
                                    <div className="p-8 space-y-10">
                                        {/* Dossier Header */}
                                        <div className="border-b border-slate-200 pb-8">
                                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{activeProfile.name}</h1>
                                            <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-2"><Globe size={14} /> HQ: {activeProfile.headquarters}</span>
                                                <span className="flex items-center gap-2"><Activity size={14} /> Est: {activeProfile.founded}</span>
                                                <span className="flex items-center gap-2 text-emerald-600 font-bold"><Zap size={14} /> Budget: {activeProfile.budget}</span>
                                            </div>
                                        </div>

                                        {/* Mission */}
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Mission Profile</h3>
                                            <p className="text-xl font-serif text-slate-800 leading-relaxed italic">"{activeProfile.mission}"</p>
                                            {activeProfile.mission_url && (
                                                <a href={activeProfile.mission_url} target="_blank" className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
                                                    Official Mission Statement <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>

                                        {/* AI Stance */}
                                        {(activeProfile as any).ai_stance && (
                                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Terminal size={14} /> AI Doctrine
                                                </h3>
                                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                    {(activeProfile as any).ai_stance}
                                                </p>
                                            </div>
                                        )}

                                        {/* Active Directives (Full List) */}
                                        {activeProfile.active_directives && activeProfile.active_directives.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <FileText size={14} /> Active Directives
                                                </h3>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {activeProfile.active_directives.map((directive, i) => (
                                                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                                            <h4 className="font-bold text-slate-900 text-sm mb-1">{directive.title}</h4>
                                                            <p className="text-xs text-slate-600 leading-relaxed mb-2">{directive.description}</p>
                                                            {directive.link && (
                                                                <a href={directive.link} target="_blank" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                                                    Read Directive <ArrowUpRight size={10} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Controversies (Full List) */}
                                        {activeProfile.controversies && activeProfile.controversies.length > 0 && (
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <History size={14} /> Historical Controversies
                                                </h3>
                                                <div className="space-y-4">
                                                    {activeProfile.controversies.map((item, i) => (
                                                        <div key={i} className="pl-4 border-l-2 border-slate-200">
                                                            <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                                            <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.description}</p>
                                                            {item.link && (
                                                                <a href={item.link} target="_blank" className="text-[10px] text-slate-400 hover:text-slate-600 mt-1 block">
                                                                    Source Reference &rarr;
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Classified Annex */}
                                        {activeProfile.classified_annex && (
                                            <div className="bg-slate-950 text-slate-300 rounded-xl p-6 border border-slate-800 relative overflow-hidden mt-8">
                                                <div className="absolute top-0 right-0 p-3 opacity-20"><Lock size={48} /></div>
                                                <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Lock size={14} /> Classified Annex // Level 5
                                                </h3>
                                                <div className="space-y-4 relative z-10">
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500">Codename</span>
                                                        <div className="font-mono text-white font-bold">{activeProfile.classified_annex.codename}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500">Shadow Budget</span>
                                                        <div className="font-mono text-red-400 font-bold">{activeProfile.classified_annex.shadow_budget}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500">Unacknowledged Projects</span>
                                                        <ul className="list-disc list-inside text-xs font-mono text-slate-400 mt-1">
                                                            {activeProfile.classified_annex.unacknowledged_projects.map((proj, i) => (
                                                                <li key={i}>{proj}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase text-slate-500">Deep Fact</span>
                                                        <p className="text-sm leading-relaxed mt-1 border-l-2 border-red-900 pl-3 italic opacity-80">
                                                            "{activeProfile.classified_annex.deep_fact}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <Shield size={48} className="mb-4 opacity-20" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Select an Agency Dossier</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: ALERTS & WATCHLIST */}
                    <div className="lg:col-span-3 flex flex-col gap-4 h-full">

                        {/* 30-Day Brief Integration */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} className="text-blue-600" />
                                    30-Day Brief
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <MonthlyIntelBrief articles={topStories} fullView={false} />
                            </div>
                        </div>

                        {/* Priority Alerts */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-1/3 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-2 mb-4">
                                <Siren size={16} className="text-red-600 animate-pulse" />
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Priority Alerts</h3>
                            </div>
                            <div className="space-y-3">
                                {feedItems.filter(i => (i.novai_analysis?.includes('CRITICAL') || i.title.includes('Urgent'))).slice(0, 5).map((alert, i) => (
                                    <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
                                            <span className="text-[9px] font-black text-red-700 uppercase">Critical</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-800 leading-snug mb-2">{alert.title}</p>
                                        <a href={alert.link} target="_blank" className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1">
                                            View Intel <ArrowUpRight size={10} />
                                        </a>
                                    </div>
                                ))}
                                {feedItems.filter(i => (i.novai_analysis?.includes('CRITICAL') || i.title.includes('Urgent'))).length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-xs">No Active Alerts</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
