'use client';

import { useState, useEffect, useRef } from 'react';
import { Scale, Gavel, AlertTriangle, ShieldAlert, ArrowUp, Loader2, FileText, Building2, History, Skull, Info, Globe } from 'lucide-react';
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
    cases: { name: string; url: string }[];
}

const RISK_DATA: RiskEntity[] = [
    {
        name: 'Google', ticker: 'GOOGL', riskScore: 92, status: 'CRITICAL', activeCases: 4, primaryThreat: 'Ad Tech Breakup & AI Search Monopoly',
        cases: [
            { name: 'US v. Google (Search)', url: 'https://www.justice.gov/atr/case/us-and-plaintiff-states-v-google-llc' },
            { name: 'US v. Google (Ad Tech)', url: 'https://www.justice.gov/opa/pr/justice-department-sues-google-monopolizing-digital-advertising-technologies' },
            { name: 'DOJ Remedies Filing', url: 'https://www.justice.gov/atr/case-document/proposed-final-judgment-0' },
            { name: 'Epic v. Google', url: 'https://www.theverge.com/23994174/epic-google-trial-jury-verdict-monopoly-google-play' }
        ]
    },
    {
        name: 'Apple', ticker: 'AAPL', riskScore: 85, status: 'HIGH', activeCases: 3, primaryThreat: 'App Store Monopoly & AI Gatekeeping',
        cases: [
            { name: 'DOJ v. Apple (2024)', url: 'https://www.justice.gov/opa/pr/justice-department-sues-apple-monopolizing-smartphone-markets' },
            { name: 'Epic v. Apple', url: 'https://www.theverge.com/2021/9/10/22662320/epic-apple-ruling-injunction-judge-fortnite' },
            { name: 'EU DMA Investigation', url: 'https://ec.europa.eu/commission/presscorner/detail/en/ip_24_3433' }
        ]
    },
    {
        name: 'NVIDIA', ticker: 'NVDA', riskScore: 80, status: 'HIGH', activeCases: 2, primaryThreat: 'GPU Allocation / CUDA Lock-in',
        cases: [
            { name: 'DOJ Antitrust Probe', url: 'https://www.reuters.com/technology/nvidia-receives-doj-subpoena-antitrust-probe-bloomberg-news-reports-2024-09-03/' },
            { name: 'FTC ARM Block (2022)', url: 'https://www.ftc.gov/news-events/news/press-releases/2021/12/ftc-sues-block-40-billion-semiconductor-chip-merger' }
        ]
    },
    {
        name: 'Meta', ticker: 'META', riskScore: 78, status: 'HIGH', activeCases: 2, primaryThreat: 'Social Monopoly (Instagram/WhatsApp)',
        cases: [
            { name: 'FTC v. Meta', url: 'https://www.ftc.gov/news-events/news/press-releases/2020/12/ftc-sues-facebook-illegal-monopolization' },
            { name: 'EU DMA Proceedings', url: 'https://ec.europa.eu/commission/presscorner/detail/en/ip_24_3582' }
        ]
    },
    {
        name: 'Amazon', ticker: 'AMZN', riskScore: 75, status: 'HIGH', activeCases: 2, primaryThreat: 'E-Commerce Predation & AWS Lock-in',
        cases: [
            { name: 'FTC v. Amazon', url: 'https://www.ftc.gov/news-events/news/press-releases/2023/09/ftc-sues-amazon-illegally-maintaining-monopoly-power' },
            { name: 'State AGs Lawsuit', url: 'https://oag.dc.gov/release/ag-racine-announces-lawsuit-against-amazon' }
        ]
    },
    {
        name: 'Microsoft', ticker: 'MSFT', riskScore: 65, status: 'MODERATE', activeCases: 1, primaryThreat: 'Cloud Dominance & OpenAI "Capture"',
        cases: [
            { name: 'FTC OpenAI Inquiry', url: 'https://www.ftc.gov/news-events/news/press-releases/2024/01/ftc-launches-inquiry-generative-artificial-intelligence-investments-partnerships' }
        ]
    },
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
    const [showMajorOnly, setShowMajorOnly] = useState(false);
    const observerTarget = useRef(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        setArticles([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/feed/anti-trust?page=1&limit=20&major=${showMajorOnly}`, { cache: 'no-store' });
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
    }, [showMajorOnly]);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);

        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/feed/anti-trust?page=${nextPage}&limit=20&major=${showMajorOnly}`, { cache: 'no-store' });
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, hasMore, loadingMore, loading]);

    return (
        <div className="space-y-12 max-w-[1600px]">
            {/* Docket Ticker - Kept as it's a functional bar */}
            <div className="bg-slate-900 text-white rounded-none border-y border-slate-800 h-10 flex items-center w-full -mx-4 lg:-mx-8 px-4 lg:px-8">
                <div className="font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 pr-4 border-r border-slate-700 h-full">
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
                icon={
                    <div className="relative">
                        <Globe className="w-10 h-10 text-blue-600 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        </div>
                    </div>
                }
            />

            {/* SECTION 1: THE CONTEXT (The Kill Zone) - Clean Text, No Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-slate-200 pb-12">
                <div className="lg:col-span-8 space-y-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                            <Skull className="h-6 w-6 text-slate-900" />
                            The "AI Kill Zone"
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 leading-relaxed">
                            <div>
                                <p className="mb-4 font-medium text-lg text-slate-900">
                                    The era of the "garage startup" is over.
                                </p>
                                <p>
                                    Modern AI requires billions in compute (GPUs) and massive proprietary datasets—resources only the "Big 6" possess. This has created an <strong>"AI Kill Zone"</strong>: a market dynamic where no independent AI lab can scale without selling equity (and control) to a cloud giant.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-200 pb-2 mb-2">The New Playbook</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-start gap-3">
                                            <span className="text-red-600 font-bold">01</span>
                                            <span><strong>Compute Capture:</strong> Invest cloud credits instead of cash to lock startups into infrastructure.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-red-600 font-bold">02</span>
                                            <span><strong>Talent Hoarding:</strong> "Acqui-hire" entire teams to bypass merger review.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historical Context - Clean List, No Box */}
                <div className="lg:col-span-4 border-l border-slate-200 pl-8">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Historical Precedent
                    </h3>
                    <div className="space-y-8">
                        {HISTORICAL_CASES.map((item, i) => (
                            <div key={i} className="relative">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-xl font-black text-slate-200">{item.year}</span>
                                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                                </div>
                                <div className="text-xs font-bold text-blue-600 mb-1 uppercase">{item.outcome}</div>
                                <p className="text-sm text-slate-500 leading-snug">
                                    {item.impact}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 1.5: KEY PLAYERS (2025 Command) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        name: 'Andrew Ferguson',
                        role: 'Chair, FTC',
                        status: 'DEREGULATOR',
                        target: 'Agency Overreach',
                        recentMove: 'Ending "dubious" consumer cases',
                        image: ''
                    },
                    {
                        name: 'Gail Slater',
                        role: 'AAG, DOJ Antitrust',
                        status: 'PRAGMATIST',
                        target: 'Big Tech Settlements',
                        recentMove: 'Reviewing Google breakup remedies',
                        image: ''
                    },
                    {
                        name: 'Teresa Ribera',
                        role: 'EVP, EU Commission',
                        status: 'STRATEGIST',
                        target: 'Green/Tech Nexus',
                        recentMove: 'Integrating climate into competition',
                        image: ''
                    }
                ].map((player) => (
                    <div key={player.name} className="bg-slate-50 border border-slate-200 p-4 flex items-center gap-4 group hover:border-slate-300 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300 group-hover:border-slate-400 transition-all">
                            <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold text-sm">
                                {player.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{player.role}</div>
                            <div className="font-bold text-slate-900 leading-tight">{player.name}</div>
                            <div className="text-[10px] font-mono text-slate-500 mt-1">
                                <span className="text-blue-600 font-bold">AGENDA:</span> {player.recentMove}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECTION 1.6: MAJOR CASE TIMELINE */}
            <div className="border-t border-b border-slate-200 py-8">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Active Litigation Timeline (2025-2026)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { date: 'DEC 2025', case: 'US v. Google', event: 'Remedies Phase: Breakup Proposed', url: 'https://www.justice.gov/atr/case/us-and-plaintiff-states-v-google-llc' },
                        { date: 'FEB 2026', case: 'EU DMA', event: 'Gatekeeper Status Review', url: 'https://digital-markets-act.ec.europa.eu/gatekeepers_en' },
                        { date: 'APR 2026', case: 'FTC v. Amazon', event: 'Trial Scheduled to Begin', url: 'https://www.ftc.gov/news-events/news/press-releases/2023/09/ftc-sues-amazon-illegally-maintaining-monopoly-power' },
                        { date: 'JUN 2026', case: 'DOJ v. Apple', event: 'Discovery Phase Concludes', url: 'https://www.justice.gov/opa/pr/justice-department-sues-apple-monopolizing-smartphone-markets' }
                    ].map((event, i) => (
                        <a
                            key={i}
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white p-4 border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-lg transition-all group"
                        >
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{event.date}</div>
                            <div className="font-bold text-blue-600 text-sm group-hover:text-blue-700 transition-colors">{event.case}</div>
                            <div className="text-xs text-slate-600 font-medium leading-tight mt-1">{event.event}</div>
                            <div className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-wide mt-2 transition-colors">
                                View Docket →
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* SECTION 2: THREAT MATRIX (Horizontal Table Layout) */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                        Monopoly Risk Matrix
                    </h2>
                    <div className="text-xs font-mono text-slate-400">
                        LIVE RISK ASSESSMENT // UPDATED {new Date().toLocaleDateString()}
                    </div>
                </div>

                <div className="bg-white rounded-none border-t border-b border-slate-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="col-span-3">Entity</div>
                        <div className="col-span-2">Risk Level</div>
                        <div className="col-span-2">Score</div>
                        <div className="col-span-3">Primary Threat</div>
                        <div className="col-span-2 text-right">Active Cases</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-slate-100">
                        {RISK_DATA.map((entity) => (
                            <div key={entity.name} className="py-4 px-4 hover:bg-slate-50 transition-colors group">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-3">
                                        <div className="font-bold text-slate-900 text-lg">{entity.name}</div>
                                        <div className="text-xs font-mono text-slate-400">{entity.ticker}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${entity.status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                            entity.status === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {entity.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-bold text-slate-900">{entity.riskScore}</span>
                                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                                <div
                                                    className={`h-full ${entity.status === 'CRITICAL' ? 'bg-red-500' :
                                                        entity.status === 'HIGH' ? 'bg-orange-500' :
                                                            'bg-yellow-500'
                                                        }`}
                                                    style={{ width: `${entity.riskScore}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="text-sm font-medium text-slate-700 leading-tight">
                                            {entity.primaryThreat}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <div className="inline-flex items-center gap-1.5 text-blue-600 font-mono text-sm font-bold">
                                            <FileText size={14} />
                                            {entity.activeCases} Cases
                                        </div>
                                    </div>
                                </div>
                                {/* Expandable Case Links */}
                                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                                    {entity.cases.map((c, idx) => (
                                        <a
                                            key={idx}
                                            href={c.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded text-xs font-medium text-slate-600 hover:text-blue-700 transition-colors"
                                        >
                                            <FileText size={12} />
                                            {c.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 3: LIVE INTELLIGENCE (Feed) - Clean List */}
            <div>
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                            <Gavel className="h-6 w-6 text-blue-600" />
                            Regulatory Filings & News
                        </h2>

                        {/* Toggle Switch */}
                        <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
                            <button
                                onClick={() => setShowMajorOnly(false)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${!showMajorOnly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Live Feed
                            </button>
                            <button
                                onClick={() => setShowMajorOnly(true)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${showMajorOnly ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Groundbreaking Cases
                            </button>
                        </div>
                    </div>

                    <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        LIVE FEED
                    </span>
                </div>

                <div className="">
                    {loading ? (
                        <div className="py-12">
                            <ResourceLoader message="Scanning court dockets..." />
                        </div>
                    ) : articles.length > 0 ? (
                        <div className="space-y-4">
                            {articles.map(article => (
                                <FeedCard key={article.id} article={article} />
                            ))}

                            {/* Infinite Scroll Target */}
                            <div ref={observerTarget} className="py-8 flex justify-center w-full">
                                {loadingMore && (
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-widest">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading older briefs...
                                    </div>
                                )}
                                {!hasMore && articles.length > 0 && (
                                    <span className="text-slate-300 font-mono text-xs uppercase tracking-widest">End of Docket</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400 font-mono">
                            {showMajorOnly ? 'No major groundbreaking cases found recently.' : 'No active filings found.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
