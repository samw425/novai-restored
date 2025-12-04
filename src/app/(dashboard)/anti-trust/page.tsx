'use client';

import { useState, useEffect } from 'react';
import { Scale, Gavel, AlertTriangle, ShieldAlert, ArrowUp, Loader2, FileText, Building2, History, Skull, Info } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedCard } from '@/components/feed/FeedCard';
import { ResourceLoader } from '@/components/ui/ResourceLoader';
import { Article } from '@/types';

// Prevent static generation for this page to ensure real-time data
export const dynamic = 'force-dynamic';

interface RiskEntity {
    name: string;
    ticker: string;
    riskScore: number; // 0-100
    status: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
    activeCases: number;
    primaryThreat: string;
}

const RISK_DATA: RiskEntity[] = [
    { name: 'Google', ticker: 'GOOGL', riskScore: 92, status: 'CRITICAL', activeCases: 4, primaryThreat: 'Ad Tech Breakup & AI Search Monopoly' },
    { name: 'Apple', ticker: 'AAPL', riskScore: 85, status: 'HIGH', activeCases: 3, primaryThreat: 'App Store Monopoly & AI Gatekeeping' },
    { name: 'NVIDIA', ticker: 'NVDA', riskScore: 80, status: 'HIGH', activeCases: 2, primaryThreat: 'GPU Allocation / CUDA Lock-in' },
    { name: 'Meta', ticker: 'META', riskScore: 78, status: 'HIGH', activeCases: 2, primaryThreat: 'Social Monopoly (Instagram/WhatsApp)' },
    { name: 'Amazon', ticker: 'AMZN', riskScore: 75, status: 'HIGH', activeCases: 2, primaryThreat: 'E-Commerce Predation & AWS Lock-in' },
    { name: 'Microsoft', ticker: 'MSFT', riskScore: 65, status: 'MODERATE', activeCases: 1, primaryThreat: 'Cloud Dominance & OpenAI "Capture"' },
];

const DOCKET_ITEMS = [
    "US v. Google (Ad Tech): Closing Arguments Scheduled",
    "DOJ vs NVIDIA: Subpoenas Issued over GPU Allocation",
    "FTC v. Amazon: Discovery Phase Ongoing",
    "EU DMA: Apple Compliance Investigation Active",
    "NYT v. OpenAI: Copyright & Training Data Trial",
];

const HISTORICAL_CASES = [
    { year: '1911', name: 'Standard Oil', outcome: 'Broken into 34 companies', impact: 'Ended the industrial energy monopoly.' },
    { year: '1982', name: 'AT&T', outcome: 'Broken into Baby Bells', impact: 'Allowed the internet to exist on phone lines.' },
    { year: '2001', name: 'Microsoft', outcome: 'Settled', impact: 'Saved the web browser, enabling Google.' },
];

export default function AntiTrustPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/feed/anti-trust?page=1&limit=20', { cache: 'no-store' });
                const data = await res.json();
                if (data.items) {
                    setArticles(data.items);
                    setHasMore(data.items.length >= 20);
                }
            } catch (error) {
                console.error('Failed to fetch Anti-Trust data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);

        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/feed/anti-trust?page=${nextPage}&limit=20`, { cache: 'no-store' });
            const data = await res.json();

            if (data.items && data.items.length > 0) {
                setArticles(prev => [...prev, ...data.items]);
                setPage(nextPage);
                setHasMore(data.items.length >= 20);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more data:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Docket Ticker */}
            <div className="bg-slate-900 text-white rounded-lg overflow-hidden flex items-center shadow-md border border-slate-800 h-10">
                <div className="bg-slate-800 px-4 h-full font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 border-r border-slate-700">
                    <Gavel size={14} className="text-amber-500" />
                    THE DOCKET
                </div>
                <div className="overflow-hidden whitespace-nowrap w-full relative flex items-center">
                    <div className="inline-block animate-marquee pl-4 text-sm font-mono text-slate-300">
                        {DOCKET_ITEMS.map((item, i) => (
                            <span key={i} className="mr-12 inline-flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <PageHeader
                title="Anti-Trust War Room"
                description="Tracking the global regulatory siege on Big Tech. The end of the monopoly era."
                insight="Regulators are fighting a two-front war: dismantling the mobile/search monopolies of the last decade (Google, Apple) while trying to prevent a new 'Compute Cartel' from controlling AI."
                icon={<Scale className="w-8 h-8 text-blue-600" />}
            />

            {/* SECTION 1: THE CONTEXT (The Kill Zone) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Skull className="h-5 w-5 text-slate-800" />
                            The "Kill Zone"
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p className="text-lg leading-relaxed font-medium text-slate-800">
                                In the modern tech ecosystem, competition is stifled by the "Kill Zone"—the area around Big Tech giants where no startup can survive. This dynamic has now extended from mobile apps to Artificial Intelligence.
                            </p>
                            <p>
                                When a startup shows promise, it faces two fates: <strong>Acquisition</strong> (to neutralize the threat) or <strong>Cloning</strong> (to destroy its market). Now, a third fate has emerged: <strong>Compute Capture</strong>, where AI labs are forced to sell equity for cloud credits.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 not-prose">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">The Playbook</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 font-bold">1.</span>
                                            <span><strong>Buy or Bury:</strong> Acquire rivals early (Instagram, WhatsApp) or copy them (Stories) to maintain dominance.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 font-bold">2.</span>
                                            <span><strong>Gatekeeping:</strong> Use platform control (App Store, Search) to tax or disadvantage competitors.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">The New Threat</h3>
                                    <p className="text-sm text-slate-600">
                                        As AI rises, the same giants are using their cloud infrastructure to lock in the next generation of companies, ensuring the "AI Era" remains under the control of the "Mobile Era" incumbents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historical Context Sidebar */}
                <div className="lg:col-span-4">
                    <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg h-full">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 font-mono">
                            <History className="h-5 w-5 text-amber-500" />
                            PRECEDENT
                        </h3>
                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-700"></div>

                            {HISTORICAL_CASES.map((item, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center text-[10px] font-bold z-10">
                                        {item.year}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-400 text-lg">{item.name}</h4>
                                        <div className="text-sm font-bold text-white mb-1">{item.outcome}</div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {item.impact}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                            <p className="text-xs text-slate-500 font-mono uppercase">
                                History repeats. The cycle of centralization and breakup is inevitable.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: CURRENT BATTLEFIELD (Risk Board) */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 font-mono">
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                    MONOPOLY RISK BOARD
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {RISK_DATA.map((entity) => (
                        <div key={entity.name} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                        {entity.name}
                                        <span className="text-xs font-mono text-slate-400 font-normal">({entity.ticker})</span>
                                    </h3>
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mt-1 ${entity.status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                        entity.status === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {entity.status} RISK
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-2xl font-black text-slate-900">{entity.riskScore}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold">Breakup Prob.</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Primary Threat</div>
                                    <div className="text-xs font-medium text-slate-700 leading-snug">{entity.primaryThreat}</div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                                    <span className="flex items-center gap-1.5">
                                        <FileText size={12} />
                                        {entity.activeCases} Active Cases
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Building2 size={12} />
                                        DOJ/FTC
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                                <div
                                    className={`h-full ${entity.status === 'CRITICAL' ? 'bg-red-500' :
                                        entity.status === 'HIGH' ? 'bg-orange-500' :
                                            'bg-yellow-500'
                                        }`}
                                    style={{ width: `${entity.riskScore}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 3: LIVE INTELLIGENCE (Feed) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-mono">
                        <Gavel className="h-5 w-5 text-blue-600" />
                        REGULATORY FILINGS & NEWS
                    </h2>
                    <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        LIVE
                    </span>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="p-12">
                            <ResourceLoader message="Scanning court dockets..." />
                        </div>
                    ) : articles.length > 0 ? (
                        <div>
                            {articles.map(article => (
                                <FeedCard key={article.id} article={article} />
                            ))}

                            {/* Load More */}
                            <div className="p-6 flex justify-center bg-slate-50/50 mt-6 rounded-lg">
                                {hasMore ? (
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-mono text-xs hover:bg-slate-50 hover:text-blue-600 transition-colors rounded-full flex items-center gap-2 shadow-sm"
                                    >
                                        {loadingMore ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUp className="h-3 w-3 rotate-180" />}
                                        {loadingMore ? 'LOADING...' : 'LOAD OLDER BRIEFS'}
                                    </button>
                                ) : (
                                    <span className="text-slate-400 font-mono text-xs">END OF DOCKET</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400 font-mono">
                            No active filings found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
