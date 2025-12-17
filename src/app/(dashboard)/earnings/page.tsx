"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import {
    Zap, Calendar, Search,
    ExternalLink, FileText, PlayCircle, BarChart3, Clock,
    CheckCircle, Activity, ChevronRight, RefreshCw, AlertCircle, TrendingUp, TrendingDown
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

interface LiveWireProps {
    forcedFilter?: string;
    onSelect?: (ticker: string) => void;
}

function LiveWire({ forcedFilter, onSelect }: LiveWireProps) {
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

            let filter = activeTab === "SIGNALS" ? "high" : activeTab === "FILINGS" ? "filings" : "all";
            if (forcedFilter) filter = forcedFilter;

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
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-[380px] flex-shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* ... header ... */}
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
                                        <span
                                            onClick={() => onSelect?.(item.ticker)}
                                            className="font-extrabold text-xs text-blue-700 hover:underline cursor-pointer"
                                        >
                                            {item.ticker}
                                        </span>
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
        </div >
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
        if (!dateStr) return 'TBA';
        // Parse as noon local time to avoid timezone shifts
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Calculate days until earnings
    const daysUntil = (dateStr: string) => {
        if (!dateStr) return '';
        // Strict string comparison forces local date interpretation
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

        // Convert both to noon UTC to avoid any DST/midnight offsets
        const target = new Date(dateStr + 'T12:00:00Z');
        const today = new Date(todayStr + 'T12:00:00Z');

        const diffTime = target.getTime() - today.getTime();
        const diff = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diff === 0) return "Today";
        if (diff === 1) return "Tomorrow";
        if (diff === -1) return "Yesterday";
        if (diff < 0) return `${Math.abs(diff)}d ago`;
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

import { useSearchParams } from "next/navigation";



function EarningsContent() {
    const searchParams = useSearchParams();
    const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"Overview" | "Upcoming" | "Just Released" | "Company" | "Archive">("Overview");
    const [details, setDetails] = useState<CompanyDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Search State
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Deep linking: Check for 'ticker' query param on mount
    useEffect(() => {
        const urlTicker = searchParams.get('ticker');
        if (urlTicker) {
            setSelectedTicker(urlTicker);
        }
    }, [searchParams]);

    // Fetch company details when ticker selected - uses new company API
    useEffect(() => {
        if (!selectedTicker) return;

        setDetailsLoading(true);
        setActiveTab("Company"); // Switch to company tab

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
        const date = new Date(dateStr + 'T12:00:00');
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
            <header className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-50 shadow-sm relative">
                {/* ... existing header code ... */}
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
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-gray-900 font-black tracking-tight text-xs uppercase">Earnings Terminal</h1>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100">BETA</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-medium tracking-wide">Covering S&P 500 & Nasdaq 100</span>
                    </div>
                </div>

                {/* Omnibox */}
                <div className="relative w-[400px] xl:w-[500px] group transition-all focus-within:w-[600px]">
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

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-4">
                <div className="flex gap-6">
                    {(["Overview", "Upcoming", "Just Released", "Company", "Archive"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-3 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-colors",
                                activeTab === tab
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden bg-[#F8F9FC]">
                {activeTab === "Overview" && (
                    <>
                        <LiveWire onSelect={setSelectedTicker} />
                        <MarketTerminal onSelect={(ticker) => setSelectedTicker(ticker)} />
                    </>
                )}

                {activeTab === "Just Released" && (
                    <div className="w-full h-full max-w-4xl mx-auto border-x border-gray-200 bg-white">
                        <LiveWire forcedFilter="just_released" onSelect={setSelectedTicker} />
                    </div>
                )}

                {activeTab === "Upcoming" && (
                    <MarketTerminal onSelect={(ticker) => setSelectedTicker(ticker)} />
                )}

                {activeTab === "Company" && (
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-5xl mx-auto p-6">
                            {!selectedTicker ? (
                                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                                    <Search className="w-12 h-12 mb-4 opacity-20" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Company Intelligence</h3>
                                    <p className="text-sm">Search for a ticker (e.g. NVDA) to view deep dive earnings data.</p>
                                </div>
                            ) : detailsLoading ? (
                                <div className="flex items-center justify-center h-[60vh]">
                                    <div className="flex flex-col items-center gap-3">
                                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Intelligence...</span>
                                    </div>
                                </div>
                            ) : details ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Company Header */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-gray-900 text-white flex items-center justify-center text-2xl font-black">{details.ticker.substring(0, 1)}</div>
                                                <div>
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{details.ticker}</h2>
                                                    <div className="text-sm text-gray-500 font-medium">{details.name}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {details.exchange && (
                                                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-wide">
                                                        {details.exchange}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Sector</div>
                                                <div className="font-semibold text-gray-900">{details.sector || '—'}</div>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Industry</div>
                                                <div className="font-semibold text-gray-900">{details.industry || '—'}</div>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Market Cap</div>
                                                <div className="font-semibold text-gray-900">{details.marketCap ? `$${(details.marketCap / 1e9).toFixed(1)}B` : '—'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Left Column: Quick Links & Next Earnings */}
                                        <div className="space-y-6">
                                            {/* Quick Links */}
                                            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Official Sources</h3>
                                                <div className="space-y-2">
                                                    <a href={details.links.ir} target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all group">
                                                        <div className="w-8 h-8 rounded bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center text-gray-500 group-hover:text-purple-600">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-xs font-bold text-gray-700 group-hover:text-purple-700">Investor Relations</div>
                                                    </a>
                                                    <a href={details.links.sec} target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group">
                                                        <div className="w-8 h-8 rounded bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-gray-500 group-hover:text-blue-600">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-xs font-bold text-gray-700 group-hover:text-blue-700">SEC Filings</div>
                                                    </a>
                                                    <a href={details.links.webcast} target="_blank" rel="noopener" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:border-red-200 border border-transparent transition-all group">
                                                        <div className="w-8 h-8 rounded bg-gray-100 group-hover:bg-red-100 flex items-center justify-center text-gray-500 group-hover:text-red-600">
                                                            <PlayCircle className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-xs font-bold text-gray-700 group-hover:text-red-700">Earnings Call Webcast</div>
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Consensus */}
                                            {details.nextEarnings && (
                                                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Street Consensus</h3>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                                                            <span className="text-xs text-gray-500 font-medium">EPS Est.</span>
                                                            <span className="text-lg font-mono font-bold text-gray-900">${details.nextEarnings.epsEstimate?.toFixed(2) || '—'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-500 font-medium">Rev Est.</span>
                                                            <span className="text-lg font-mono font-bold text-gray-900">{details.nextEarnings.revenueEstimate ? `$${(details.nextEarnings.revenueEstimate / 1e9).toFixed(1)}B` : '—'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Center/Right: Next Event & History */}
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Next Event Hero */}
                                            {details.nextEarnings && (
                                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                                    <div className="relative z-10">
                                                        <div className="flex items-center gap-2 mb-6">
                                                            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider border border-white/10 backdrop-blur-sm">Next Event</span>
                                                            {details.nextEarnings.confidence === 'CONFIRMED' && (
                                                                <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase tracking-wider">
                                                                    <CheckCircle className="w-3.5 h-3.5" /> Confirmed
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-end justify-between">
                                                            <div>
                                                                <div className="text-4xl font-black tracking-tight mb-2">{formatDate(details.nextEarnings.date)}</div>
                                                                <div className="flex items-center gap-3 text-gray-300 font-medium">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>
                                                                        {details.nextEarnings.time === 'AMC' ? 'After Market Close' :
                                                                            details.nextEarnings.time === 'BMO' ? 'Before Market Open' :
                                                                                details.nextEarnings.time || 'Time TBA'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-5xl font-mono font-bold tracking-tighter">{daysUntil(details.nextEarnings.date)}d</div>
                                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Countdown</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* History Table */}
                                            {details.pastQuarters && details.pastQuarters.length > 0 && (
                                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Historical Performance</h3>
                                                    </div>
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                                                            <tr>
                                                                <th className="px-6 py-3">Quarter</th>
                                                                <th className="px-6 py-3 text-right">Est EPS</th>
                                                                <th className="px-6 py-3 text-right">Act EPS</th>
                                                                <th className="px-6 py-3 text-right">Surprise</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {details.pastQuarters.map((q, i) => (
                                                                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                                    <td className="px-6 py-3 font-bold text-gray-900">
                                                                        {q.quarter}
                                                                        <span className="block text-[10px] font-mono text-gray-400 font-normal mt-0.5">{formatDate(q.date)}</span>
                                                                    </td>
                                                                    <td className="px-6 py-3 text-right font-mono text-gray-500">${q.epsEstimate.toFixed(2)}</td>
                                                                    <td className="px-6 py-3 text-right font-mono text-gray-900 font-bold">${q.epsActual.toFixed(2)}</td>
                                                                    <td className="px-6 py-3 text-right">
                                                                        {q.beat ? (
                                                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
                                                                                <TrendingUp className="w-3 h-3" /> BEAT
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold border border-red-100">
                                                                                <TrendingDown className="w-3 h-3" /> MISS
                                                                            </span>
                                                                        )}
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
                            ) : null}
                        </div>
                    </div>
                )}

                {activeTab === "Archive" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Earnings Archive</h3>
                        <p className="text-sm max-w-sm text-center mt-2">Historical earnings data and transcripts will be available here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EarningsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Terminal...</span>
                </div>
            </div>
        }>
            <EarningsContent />
        </Suspense>
    );
}

