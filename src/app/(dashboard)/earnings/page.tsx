"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    Zap, Calendar, Search,
    ExternalLink, FileText, PlayCircle, BarChart3, Clock,
    CheckCircle, Activity, ChevronRight, RefreshCw, AlertCircle
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES (matching API responses)
// ============================================================================

interface CalendarItem {
    ticker: string;
    companyName: string;
    date: string;
    time: 'BMO' | 'AMC' | 'DMH' | 'TBA';
    confidence: 'CONFIRMED' | 'ESTIMATED' | 'UNKNOWN';
    epsEstimate?: number;
    revenueEstimate?: number;
}

interface FeedItem {
    id: string;
    ticker: string;
    headline: string;
    time: string;
    ago: string;
    impact: 'HIGH' | 'MED' | 'LOW';
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    summaryStatus: 'GENERATING' | 'COMPLETE';
    links: { label: string; url: string }[];
}

interface SearchResult {
    ticker: string;
    name: string;
    sector?: string;
    isAI?: boolean;
    isFeatured?: boolean;
    nextEarningsDate?: string;
    confidence: string;
}

interface PastQuarter {
    quarter: string;
    date: string;
    epsEstimate: number;
    epsActual: number;
    revenueEstimate?: number;
    revenueActual?: number;
    beat: boolean;
    links: {
        secFiling: string;
        ir: string;
    };
}

interface CompanyDetails {
    ticker: string;
    name: string;
    sector?: string;
    industry?: string;
    exchange?: string;
    marketCap?: number;
    website?: string;

    // Next earnings
    nextEarnings?: {
        date: string;
        time: string;
        confidence: 'CONFIRMED' | 'ESTIMATED' | 'UNKNOWN';
        epsEstimate?: number;
        revenueEstimate?: number;
        fiscalQuarter?: number;
        fiscalYear?: number;
    };

    // Past earnings with links
    pastQuarters: PastQuarter[];

    // Quick links (always available)
    links: {
        ir: string;
        sec: string;
        webcast: string;
        yahooFinance: string;
        googleFinance: string;
    };
}

// ============================================================================
// 1. LIVE WIRE COMPONENT - Real-time SEC/IR feed with infinite scroll
// ============================================================================

function LiveWire() {
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"SCANNER" | "SIGNALS" | "FILINGS">("SCANNER");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const [source, setSource] = useState<string>('seed');
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchFeed = useCallback(async (pageNum: number = 1, append: boolean = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const filter = activeTab === "SIGNALS" ? "high" : activeTab === "FILINGS" ? "filings" : "all";
            const res = await fetch(`/api/earnings/feed?limit=20&filter=${filter}&page=${pageNum}`);
            const data = await res.json();

            if (data.success && data.feed) {
                if (append) {
                    setFeed(prev => [...prev, ...data.feed]);
                } else {
                    setFeed(data.feed);
                }
                setHasMore(data.hasMore || false);
                setLastSync(data.lastSync || null);
                setSource(data.source || 'seed');
                setError(null);
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to load feed');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeTab]);

    // Handle infinite scroll
    const handleScroll = useCallback(() => {
        if (!scrollRef.current || loadingMore || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            setPage(prev => prev + 1);
            fetchFeed(page + 1, true);
        }
    }, [loadingMore, hasMore, page, fetchFeed]);

    useEffect(() => {
        setPage(1);
        fetchFeed(1, false);
        // Poll every 15 seconds for new events
        const interval = setInterval(() => fetchFeed(1, false), 15000);
        return () => clearInterval(interval);
    }, [fetchFeed]);

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-[380px] flex-shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="h-10 border-b border-gray-200 flex items-center justify-between px-3 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-gray-400 fill-gray-400" />
                    <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">Live Wire</span>
                    {source === 'sec-edgar' && (
                        <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1 rounded border border-blue-100">SEC</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {lastSync && (
                        <span className="text-[9px] text-gray-400">
                            Synced {new Date(lastSync).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                    )}
                    <div className="flex items-center gap-1.5 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                        <span className="text-[9px] font-bold text-green-700 uppercase">Live</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center px-2 py-1.5 gap-1 border-b border-gray-200 bg-white">
                {(["SCANNER", "SIGNALS", "FILINGS"] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-1 rounded text-[10px] font-bold transition-all border",
                            activeTab === tab
                                ? "bg-gray-100 text-gray-900 border-gray-200 shadow-sm"
                                : "text-gray-400 hover:text-gray-600 border-transparent hover:bg-gray-50"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <RefreshCw className="w-5 h-5 text-gray-300 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-xs">
                        <AlertCircle className="w-5 h-5 mb-2" />
                        <span>{error}</span>
                        <button onClick={() => fetchFeed(1, false)} className="mt-2 text-blue-600 hover:underline">Retry</button>
                    </div>
                ) : feed.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-xs">
                        <Zap className="w-5 h-5 mb-2 opacity-30" />
                        <span>Waiting for earnings events...</span>
                        <span className="text-[10px] mt-1">SEC filings appear here in real-time</span>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {feed.map((item) => (
                            <div key={item.id} className="px-3 py-2.5 hover:bg-blue-50/30 transition-colors group cursor-default flex gap-3 animated-item">
                                <div className="flex flex-col items-end gap-1 w-10 shrink-0 pt-0.5">
                                    <span className="text-[10px] font-mono text-gray-400 leading-none">{item.ago}</span>
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        item.sentiment === "POSITIVE" ? "bg-green-500" :
                                            item.sentiment === "NEGATIVE" ? "bg-red-500" : "bg-gray-300"
                                    )} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-extrabold text-xs text-blue-700 hover:underline cursor-pointer">{item.ticker}</span>
                                        {item.impact === "HIGH" && (
                                            <span className="text-[9px] font-bold bg-gray-900 text-white px-1 rounded-[2px] leading-tight flex items-center gap-1"><Zap className="w-2 h-2 fill-white" /> HOT</span>
                                        )}
                                        {item.summaryStatus === "GENERATING" && (
                                            <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1 rounded animate-pulse">Generating...</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-700 leading-snug mb-1.5 line-clamp-3 group-hover:text-gray-900 font-medium">
                                        {item.headline}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.links.map((link, i) => (
                                            <a key={i} href={link.url} target="_blank" rel="noopener" className="text-[9px] font-bold text-gray-400 hover:text-blue-600 flex items-center gap-1 uppercase tracking-tight hover:underline decoration-blue-200 bg-gray-50 px-1.5 rounded border border-gray-100 hover:border-blue-200 transition-colors">
                                                {link.label} <ExternalLink className="w-2 h-2" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Infinite scroll loading indicator */}
                        {loadingMore && (
                            <div className="flex items-center justify-center py-4">
                                <RefreshCw className="w-4 h-4 text-gray-300 animate-spin" />
                            </div>
                        )}
                        {!hasMore && feed.length > 0 && (
                            <div className="text-center py-4 text-[10px] text-gray-400">
                                End of feed
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// 2. MARKET TERMINAL COMPONENT - Real earnings calendar
// ============================================================================

function MarketTerminal({ onSelect }: { onSelect: (ticker: string) => void }) {
    const [calendar, setCalendar] = useState<CalendarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "featured" | "today">("all");

    const fetchCalendar = useCallback(async () => {
        try {
            setLoading(true);
            // Pass filter to API for server-side filtering
            const res = await fetch(`/api/earnings/calendar?limit=100&filter=${filter}`);
            const data = await res.json();

            if (data.success && data.calendar) {
                setCalendar(data.calendar);
                setLastSync(data.lastSync);
                setError(null);
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to load calendar');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchCalendar();
    }, [fetchCalendar]);

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Calculate days until earnings
    const daysUntil = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "Tomorrow";
        return `${diff}d`;
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FC] text-gray-900 relative">
            <div className="h-10 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="p-1 bg-blue-50 rounded border border-blue-100">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Upcoming Earnings</h2>
                    </div>
                    {lastSync && (
                        <span className="text-[9px] text-gray-400 font-mono">
                            Synced {new Date(lastSync).toLocaleTimeString()}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                        {(['all', 'featured', 'today'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all",
                                    filter === f ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                                )}
                            >
                                {f === 'featured' ? 'AI/Tech' : f === 'today' ? 'Today' : 'All'}
                            </button>
                        ))}
                    </div>
                    <button onClick={fetchCalendar} className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <RefreshCw className={cn("w-3.5 h-3.5 text-gray-400", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-white overflow-hidden flex flex-col">
                    {loading && calendar.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <RefreshCw className="w-6 h-6 text-gray-300 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <AlertCircle className="w-6 h-6 mb-2" />
                            <span className="text-sm">{error}</span>
                            <button onClick={fetchCalendar} className="mt-2 text-blue-600 hover:underline text-sm">Retry</button>
                        </div>
                    ) : calendar.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Calendar className="w-6 h-6 mb-2 opacity-30" />
                            <span className="text-sm">No upcoming earnings found</span>
                            <button onClick={fetchCalendar} className="mt-2 text-blue-600 hover:underline text-sm">Refresh</button>
                        </div>
                    ) : (
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#FAFAFA] sticky top-0 z-10 text-[9px] uppercase font-bold text-gray-500 tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-2 w-[100px]">Date</th>
                                        <th className="px-4 py-2">Ticker</th>
                                        <th className="px-4 py-2 w-[80px]">Time</th>
                                        <th className="px-4 py-2 w-[100px]">Confidence</th>
                                        <th className="px-4 py-2 text-right w-[80px]">Est. EPS</th>
                                        <th className="px-4 py-2 text-right w-[80px]">Countdown</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-[11px] font-sans text-gray-600">
                                    {calendar.map((c, i) => (
                                        <tr
                                            key={`${c.ticker}-${i}`}
                                            onClick={() => onSelect(c.ticker)}
                                            className="group hover:bg-blue-50/50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-2.5 font-medium text-gray-900">
                                                {formatDate(c.date)}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors bg-gray-100 px-1 py-0.5 rounded text-[10px]">{c.ticker}</div>
                                                    <div className="text-[9px] text-gray-400 truncate max-w-[150px] hidden xl:block">{c.companyName}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2.5 text-[9px]">
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded font-bold border",
                                                    c.time === 'AMC' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                        c.time === 'BMO' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                            "bg-gray-50 text-gray-500 border-gray-100"
                                                )}>
                                                    {c.time || 'TBA'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-[9px]">
                                                <span className={cn(
                                                    "px-1.5 py-0.5 rounded font-bold",
                                                    c.confidence === 'CONFIRMED' ? "bg-green-50 text-green-700" :
                                                        c.confidence === 'ESTIMATED' ? "bg-yellow-50 text-yellow-700" :
                                                            "bg-gray-50 text-gray-500"
                                                )}>
                                                    {c.confidence}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-gray-500 font-mono">
                                                {c.epsEstimate ? `$${c.epsEstimate.toFixed(2)}` : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-900">
                                                {daysUntil(c.date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// 3. MAIN PAGE
// ============================================================================

export default function EarningsPage() {
    const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
    const [openSheet, setOpenSheet] = useState(false);
    const [details, setDetails] = useState<CompanyDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Search State
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Fetch company details when ticker selected - uses new company API
    useEffect(() => {
        if (!selectedTicker) return;

        setDetailsLoading(true);
        setOpenSheet(true); // Open immediately to show loading state

        fetch(`/api/earnings/company/${encodeURIComponent(selectedTicker)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.company) {
                    setDetails(data.company);
                } else {
                    console.error('Company fetch failed:', data.error);
                }
            })
            .catch(console.error)
            .finally(() => setDetailsLoading(false));
    }, [selectedTicker]);

    // Search with debounce
    useEffect(() => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await fetch(`/api/earnings/search?q=${encodeURIComponent(query)}&limit=8`);
                const data = await res.json();
                setSearchResults(data.results || []);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setSearchLoading(false);
            }
        }, 200);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [query]);

    // Format date for display
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'TBA';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Calculate days until
    const daysUntil = (dateStr?: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Math.max(0, Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    };

    return (
        <div className="h-screen flex flex-col bg-[#FAFAFA] overflow-hidden font-sans text-[13px]">
            {/* Top Bar */}
            <header className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-20 shadow-sm relative">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 relative flex items-center justify-center">
                            <svg className="w-full h-full text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L3 7V12C3 17.52 7 21.6 12 23C17 21.6 21 17.52 21 12V7L12 2Z" />
                                <circle cx="12" cy="12" r="3" className="text-red-500" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <span className="text-sm font-black tracking-tight text-gray-900">NOVAI</span>
                            <span className="text-[8px] font-bold tracking-[0.2em] text-gray-400 uppercase">INTELLIGENCE</span>
                        </div>
                    </div>

                    <div className="h-4 w-px bg-gray-200 mx-2" />
                    <h1 className="text-gray-900 font-bold tracking-tight text-xs bg-gray-100 px-2 py-0.5 rounded-full uppercase">Earnings Terminal</h1>
                </div>

                {/* Omnibox */}
                <div className="relative w-[500px] group transition-all focus-within:w-[600px]">
                    <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        className="w-full bg-gray-50 border border-gray-200 rounded-md pl-9 pr-4 py-1.5 text-xs text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-300 transition-all font-medium shadow-sm input-shadow"
                        placeholder="Search by Ticker or Company Name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {searchLoading && (
                        <RefreshCw className="absolute right-3 top-2 w-3.5 h-3.5 text-gray-400 animate-spin" />
                    )}
                    {/* Search Dropdown */}
                    {searchResults.length > 0 && query.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wide">
                                Best Matches
                            </div>
                            {searchResults.map(c => (
                                <button
                                    key={c.ticker}
                                    onClick={() => { setSelectedTicker(c.ticker); setQuery(""); setSearchResults([]); }}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center justify-between border-b border-gray-50 last:border-0 group transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs">{c.ticker.substring(0, 1)}</div>
                                        <div>
                                            <div className="font-bold text-gray-900 group-hover:text-blue-700 text-xs">{c.ticker}</div>
                                            <div className="text-[10px] text-gray-500">{c.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {c.nextEarningsDate && (
                                            <span className="text-[9px] text-gray-400 font-mono">{formatDate(c.nextEarningsDate)}</span>
                                        )}
                                        <span className={cn(
                                            "text-[9px] px-1.5 py-0.5 rounded font-bold",
                                            c.confidence === 'CONFIRMED' ? "bg-green-50 text-green-600" :
                                                c.confidence === 'ESTIMATED' ? "bg-yellow-50 text-yellow-600" :
                                                    "bg-gray-50 text-gray-400"
                                        )}>{c.confidence}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 text-[10px] font-medium">
                    <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="font-bold">LIVE DATA</span>
                    </span>
                    <span className="font-mono text-gray-500">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} EST</span>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                <LiveWire />
                <MarketTerminal onSelect={(ticker) => setSelectedTicker(ticker)} />
            </div>

            {/* SLIDE OVER (Company Details) */}
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent side="right" className="w-[600px] border-l border-gray-200 bg-[#FAFAFA] p-0 text-gray-900 sm:max-w-[600px] shadow-2xl">
                    {detailsLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <RefreshCw className="w-8 h-8 text-gray-300 animate-spin" />
                        </div>
                    ) : details ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 bg-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{details.sector || details.industry || 'Company'}</div>
                                    {details.exchange && (
                                        <>
                                            <span className="text-gray-300">•</span>
                                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">{details.exchange}</div>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-1">{details.ticker}</h2>
                                        <p className="text-sm text-gray-500 font-medium">{details.name}</p>
                                    </div>
                                    <div className="text-right">
                                        {details.nextEarnings && (
                                            <div className={cn(
                                                "text-xs font-bold px-2 py-1 rounded-full inline-block",
                                                details.nextEarnings.confidence === 'CONFIRMED' ? "bg-green-100 text-green-700" :
                                                    details.nextEarnings.confidence === 'ESTIMATED' ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-gray-100 text-gray-500"
                                            )}>
                                                {details.nextEarnings.confidence}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <a href={details.links.ir} target="_blank" rel="noopener" className="flex-1 py-3 rounded-lg bg-white border border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-xs font-bold text-gray-600 hover:text-purple-700 text-center transition-all flex flex-col items-center justify-center gap-1 group shadow-sm hover:shadow-md">
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                        <span>Investor Relations</span>
                                    </a>
                                    <a href={details.links.sec} target="_blank" rel="noopener" className="flex-1 py-3 rounded-lg bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-xs font-bold text-gray-600 hover:text-blue-700 text-center transition-all flex flex-col items-center justify-center gap-1 group shadow-sm hover:shadow-md">
                                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                        <span>SEC Filings</span>
                                    </a>
                                    <a href={details.links.webcast} target="_blank" rel="noopener" className="flex-1 py-3 rounded-lg bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-xs font-bold text-gray-600 hover:text-red-700 text-center transition-all flex flex-col items-center justify-center gap-1 group shadow-sm hover:shadow-md">
                                        <PlayCircle className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                        <span>Latest Webcast</span>
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Upcoming */}
                                <section>
                                    <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-purple-600" /> Next Earnings
                                    </h3>
                                    <div className="bg-white rounded-xl p-5 border border-gray-200 flex justify-between items-center shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900 mb-1">{details.nextEarnings ? formatDate(details.nextEarnings.date) : 'TBA'}</div>
                                            <div className="flex items-center gap-2">
                                                {details.nextEarnings && (
                                                    <>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                            details.nextEarnings.time === 'AMC' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                                        )}>
                                                            {details.nextEarnings.time === 'AMC' ? 'After Close' : details.nextEarnings.time === 'BMO' ? 'Before Open' : details.nextEarnings.time || 'TBA'}
                                                        </span>
                                                        <span className={cn(
                                                            "text-[10px] font-bold px-2 py-0.5 rounded",
                                                            details.nextEarnings.confidence === 'CONFIRMED' ? "bg-green-50 text-green-600" :
                                                                details.nextEarnings.confidence === 'ESTIMATED' ? "bg-yellow-50 text-yellow-600" :
                                                                    "text-gray-400"
                                                        )}>{details.nextEarnings.confidence}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-mono font-bold text-gray-900">
                                                {details.nextEarnings ? `${daysUntil(details.nextEarnings.date) ?? 0}d` : '—'}
                                            </div>
                                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Countdown</div>
                                        </div>
                                    </div>
                                </section>

                                {/* Estimates */}
                                {details.nextEarnings && (details.nextEarnings.epsEstimate || details.nextEarnings.revenueEstimate) && (
                                    <section>
                                        <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <BarChart3 className="w-3.5 h-3.5 text-blue-600" /> Consensus Estimates
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {details.nextEarnings.epsEstimate && (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">EPS Estimate</div>
                                                    <div className="text-xl font-mono font-bold text-gray-900">${details.nextEarnings.epsEstimate.toFixed(2)}</div>
                                                </div>
                                            )}
                                            {details.nextEarnings.revenueEstimate && (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Revenue Estimate</div>
                                                    <div className="text-xl font-mono font-bold text-gray-900">${(details.nextEarnings.revenueEstimate / 1e9).toFixed(1)}B</div>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* Historical */}
                                {details.pastQuarters && details.pastQuarters.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                <BarChart3 className="w-3.5 h-3.5 text-blue-600" /> Historical Performance
                                            </h3>
                                        </div>
                                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100 text-[10px]">
                                                    <tr>
                                                        <th className="px-5 py-3">Quarter</th>
                                                        <th className="px-5 py-3 text-right">Est</th>
                                                        <th className="px-5 py-3 text-right">Act</th>
                                                        <th className="px-5 py-3 text-right">Surprise</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {details.pastQuarters.map((q, i) => (
                                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-5 py-3 font-bold text-gray-900">
                                                                <div>{q.quarter}</div>
                                                                <div className="font-mono text-[10px] text-gray-400 font-medium">{formatDate(q.date)}</div>
                                                            </td>
                                                            <td className="px-5 py-3 text-right font-mono text-gray-500">${q.epsEstimate.toFixed(2)}</td>
                                                            <td className="px-5 py-3 text-right font-mono text-gray-900 font-bold">${q.epsActual.toFixed(2)}</td>
                                                            <td className="px-5 py-3 text-right">
                                                                {q.beat ? (
                                                                    <span className="text-green-700 font-bold text-[9px] bg-green-100 px-1.5 py-0.5 rounded">BEAT</span>
                                                                ) : (
                                                                    <span className="text-red-700 font-bold text-[9px] bg-red-100 px-1.5 py-0.5 rounded">MISS</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Activity className="w-8 h-8 text-gray-300 animate-spin" />
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
