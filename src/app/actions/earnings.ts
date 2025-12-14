"use server";

// ============================================================================
// MARKET INTELLIGENCE DATA KERNEL
// ============================================================================

export interface CompanyData {
    id: string;
    ticker: string;
    name: string;
    sector?: string;
    is_ai: boolean;
    is_sp500: boolean;
    market_cap?: string;
    next_earnings_at?: string | null;
    earnings_time?: "BMO" | "AMC" | "DMH" | "TBA" | null;
    confidence?: "CONFIRMED" | "ESTIMATED";
    est_eps?: string;
    est_rev?: string;
    implied_move?: string;

    // Computed qualities
    formatted_date?: string;
    status?: "UPCOMING" | "LIVE" | "REPORTED";
    days_until?: number | null;

    // External Links
    ir_url: string;
    sec_url: string;
    webcast_url: string;
}

export interface EarningsSummary {
    id: string;
    ticker: string;
    headline: string;
    time: string; // e.g. "10:45 AM"
    ago: string; // e.g. "2m ago"
    impact: "HIGH" | "MED" | "LOW";
    sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
    links: { label: string; url: string }[];
    // Extended properties
    status?: "PROCESSING" | "COMPLETE";
    quarter_label?: string;
    company_name?: string;
    time_ago?: string;
    summary_text?: string;
    highlights?: string[];
    eps_text?: string;
    revenue_text?: string;
}

// ----------------------------------------------------------------------------
// 1. MASSIVE MOCK DATASET (The "Pro" Backend)
// ----------------------------------------------------------------------------

const SECTORS = ["Technology", "Healthcare", "Financial", "Energy", "Consumer", "Industrial", "Utilities"];
const TICKERS_CORE = [
    { t: "NVDA", n: "NVIDIA Corp", s: "Technology" },
    { t: "MSFT", n: "Microsoft Corp", s: "Technology" },
    { t: "AAPL", n: "Apple Inc", s: "Technology" },
    { t: "AMZN", n: "Amazon.com", s: "Consumer" },
    { t: "GOOGL", n: "Alphabet Inc", s: "Technology" },
    { t: "META", n: "Meta Platforms", s: "Technology" },
    { t: "TSLA", n: "Tesla Inc", s: "Automotive" },
    { t: "AMD", n: "Adv Micro Devices", s: "Technology" },
    { t: "PLTR", n: "Palantir Tech", s: "Technology" },
    { t: "JPM", n: "JPMorgan Chase", s: "Financial" },
    { t: "V", n: "Visa Inc", s: "Financial" },
    { t: "JNJ", n: "Johnson & Johnson", s: "Healthcare" },
    { t: "WMT", n: "Walmart Inc", s: "Consumer" },
    { t: "PG", n: "Procter & Gamble", s: "Consumer" },
    { t: "XOM", n: "Exxon Mobil", s: "Energy" },
    { t: "CVX", n: "Chevron Corp", s: "Energy" },
    { t: "BAC", n: "Bank of America", s: "Financial" },
    { t: "KO", n: "Coca-Cola Co", s: "Consumer" },
    { t: "PEP", n: "PepsiCo Inc", s: "Consumer" },
    { t: "COST", n: "Costco Wholesale", s: "Consumer" },
    { t: "LLY", n: "Eli Lilly", s: "Healthcare" },
    { t: "AVGO", n: "Broadcom Inc", s: "Technology" },
    { t: "ORCL", n: "Oracle Corp", s: "Technology" },
    { t: "NFLX", n: "Netflix Inc", s: "Consumer" },
    { t: "DIS", n: "Walt Disney", s: "Consumer" },
    { t: "CRM", n: "Salesforce", s: "Technology" },
    { t: "ADBE", n: "Adobe Inc", s: "Technology" },
    { t: "QCOM", n: "Qualcomm Inc", s: "Technology" },
    { t: "CSCO", n: "Cisco Systems", s: "Technology" },
    { t: "INTC", n: "Intel Corp", s: "Technology" }
];

const REAL_URLS: Record<string, { ir: string, sec?: string }> = {
    "NVDA": { ir: "https://investor.nvidia.com/", sec: "https://investor.nvidia.com/financial-info/sec-filings/default.aspx" },
    "MSFT": { ir: "https://www.microsoft.com/en-us/investor", sec: "https://www.microsoft.com/en-us/investor/sec-filings.aspx" },
    "AAPL": { ir: "https://investor.apple.com/", sec: "https://investor.apple.com/sec-filings/default.aspx" },
    "AMZN": { ir: "https://ir.aboutamazon.com/", sec: "https://ir.aboutamazon.com/sec-filings" },
    "GOOGL": { ir: "https://abc.xyz/investor/", sec: "https://abc.xyz/investor/sec-filings/" },
    "META": { ir: "https://investor.fb.com/", sec: "https://investor.fb.com/financials/sec-filings/" },
    "TSLA": { ir: "https://ir.tesla.com/", sec: "https://ir.tesla.com/sec-filings" },
    "AMD": { ir: "https://ir.amd.com/", sec: "https://ir.amd.com/financial-information/sec-filings" },
    "PLTR": { ir: "https://investors.palantir.com/", sec: "https://investors.palantir.com/financials/sec-filings" },
    "JPM": { ir: "https://www.jpmorganchase.com/ir", sec: "https://www.jpmorganchase.com/ir/financial-information/sec-filings" },
    "NFLX": { ir: "https://ir.netflix.net/", sec: "https://ir.netflix.net/financials/sec-filings/default.aspx" },
    "DIS": { ir: "https://thewaltdisneycompany.com/investor-relations/", sec: "https://thewaltdisneycompany.com/investor-relations/sec-filings/" }
};

function generateMarketData(): CompanyData[] {
    const companies: CompanyData[] = [];

    // Add Core 30
    TICKERS_CORE.forEach((c, i) => {
        companies.push(createMockCompany(i.toString(), c.t, c.n, c.s, true));
    });

    // Add 470 Filler Companies (Total 500)
    for (let i = 30; i < 500; i++) {
        const t1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const t2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const t3 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const ticker = `${t1}${t2}${t3}`;

        companies.push(createMockCompany(
            i.toString(),
            ticker,
            `${ticker} International`,
            SECTORS[Math.floor(Math.random() * SECTORS.length)],
            Math.random() > 0.8
        ));
    }

    // Sort by Date (Soonest First)
    return companies.sort((a, b) => new Date(a.next_earnings_at!).getTime() - new Date(b.next_earnings_at!).getTime());
}

function createMockCompany(id: string, ticker: string, name: string, sector: string, isKey: boolean): CompanyData {
    const daysOffset = Math.floor(Math.random() * 60) - 5; // -5 to +55 days
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);

    // Process formatting
    const daysUntil = daysOffset;
    let fmt = "TBA";
    if (daysUntil === 0) fmt = "Today";
    else if (daysUntil === 1) fmt = "Tomorrow";
    else if (daysUntil < 0) fmt = `${Math.abs(daysUntil)}d Ago`;
    else if (daysUntil < 7) fmt = `${daysUntil}d Away`;
    else fmt = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Link Resolution
    const real = REAL_URLS[ticker];
    const ir_url = real?.ir || `https://finance.yahoo.com/quote/${ticker}`;
    const sec_url = real?.sec || `https://www.sec.gov/cgi-bin/browse-edgar?CIK=${ticker}&action=getcompany`;

    return {
        id,
        ticker,
        name,
        sector,
        is_ai: sector === "Technology" && Math.random() > 0.6,
        is_sp500: Math.random() > 0.3,
        market_cap: isKey ? `${(Math.random() * 2 + 0.1).toFixed(1)}T` : `${(Math.random() * 100).toFixed(1)}B`,
        next_earnings_at: date.toISOString(),
        earnings_time: Math.random() > 0.5 ? "AMC" : "BMO",
        confidence: isKey ? "CONFIRMED" : "ESTIMATED",
        est_eps: `$${(Math.random() * 5).toFixed(2)}`,
        est_rev: `$${(Math.random() * 10).toFixed(1)}B`,
        implied_move: `±${(Math.random() * 10 + 2).toFixed(1)}%`,
        formatted_date: fmt,
        status: daysUntil <= 0 ? (daysUntil === 0 ? "LIVE" : "REPORTED") : "UPCOMING",
        days_until: daysUntil,
        ir_url,
        sec_url,
        webcast_url: "https://event.webcasts.com/starthere.jsp"
    };
}

const GLOBAL_MARKET_DATA = generateMarketData();

// ----------------------------------------------------------------------------
// 2. SERVER ACTIONS
// ----------------------------------------------------------------------------

export async function searchCompanyData(query: string) {
    if (!query) return [];
    const q = query.toUpperCase();

    // Fuzzy match
    return GLOBAL_MARKET_DATA.filter(c =>
        c.ticker.includes(q) ||
        c.name.toUpperCase().includes(q)
    ).slice(0, 10);
}

export async function getMarketCalendarData(
    filter: "all" | "sp500" | "nasdaq" | "ai" = "all",
    start: number = 0,
    limit: number = 50
) {
    // 1. Filter
    let data = GLOBAL_MARKET_DATA;
    if (filter === "sp500") data = data.filter(c => c.is_sp500);
    if (filter === "nasdaq") data = data.filter(c => c.sector === "Technology"); // Approx
    if (filter === "ai") data = data.filter(c => c.is_ai);

    // 2. Slice
    const slice = data.slice(start, start + limit);

    return {
        data: slice,
        total: data.length,
        has_more: (start + limit) < data.length
    };
}

export async function getFeaturedCompanies(limit: number = 12): Promise<CompanyData[]> {
    // Return AI/Tech companies with upcoming earnings, sorted by days until
    return GLOBAL_MARKET_DATA
        .filter(c => c.is_ai || c.sector === "Technology")
        .filter(c => c.days_until != null && c.days_until >= 0)
        .sort((a, b) => (a.days_until ?? 999) - (b.days_until ?? 999))
        .slice(0, limit);
}

export async function getLatestSummaries(limit: number = 10): Promise<EarningsSummary[]> {
    const feed = await getLiveWireFeed();
    return feed.slice(0, limit);
}

export async function getMarketMovingEarnings(limit: number = 6): Promise<CompanyData[]> {
    // Return largest market cap companies with upcoming earnings
    return GLOBAL_MARKET_DATA
        .filter(c => c.days_until != null && c.days_until >= 0 && c.days_until <= 14)
        .sort((a, b) => {
            // Parse market cap (e.g., "2.1T", "100B")
            const parseCap = (cap?: string) => {
                if (!cap) return 0;
                const val = parseFloat(cap);
                if (cap.includes('T')) return val * 1000;
                return val;
            };
            return parseCap(b.market_cap) - parseCap(a.market_cap);
        })
        .slice(0, limit);
}


export async function getLiveWireFeed(): Promise<EarningsSummary[]> {
    const feed = [
        {
            ticker: "PLTR", headline: "Q3 Revenue $725M (+17% YoY) beats estimates of $700M; raises full-year guidance significantly driven by AI demand.", time: "4:05 PM", ago: "14s", impact: "HIGH", sentiment: "POSITIVE",
            links: ["8-K", "Press Release"]
        },
        {
            ticker: "AMD", headline: "CEO Lisa Su: MI300 demand 'exceeding expectations' across enterprise partners.", time: "4:02 PM", ago: "32s", impact: "MED", sentiment: "POSITIVE",
            links: ["Webcast"]
        },
        {
            ticker: "PARA", headline: "Paramount Global misses EPS by $0.15; streaming subscriber growth slows to lowest pace in 2 years.", time: "4:01 PM", ago: "1m", impact: "LOW", sentiment: "NEGATIVE",
            links: ["Report"]
        },
        {
            ticker: "JPM", headline: "Dimon: 'Economic clouds gathering' - warns of potential headwinds in Q4 consumer spending.", time: "3:45 PM", ago: "4m", impact: "MED", sentiment: "NEUTRAL",
            links: ["Transcript"]
        },
        {
            ticker: "TSLA", headline: "Vehicle deliveries up 5% QoQ, slight beat vs consensus.", time: "3:30 PM", ago: "15m", impact: "HIGH", sentiment: "POSITIVE",
            links: ["Press Release"]
        },
        {
            ticker: "AAPL", headline: "Apple announces special event 'Scary Fast' for Oct 30.", time: "3:15 PM", ago: "30m", impact: "MED", sentiment: "NEUTRAL",
            links: ["News"]
        },
        {
            ticker: "GOOGL", headline: "Waymo expands service area in San Francisco.", time: "3:00 PM", ago: "45m", impact: "LOW", sentiment: "POSITIVE",
            links: ["Blog"]
        },
        {
            ticker: "AMZN", headline: "AWS outage affecting US-EAST-1 region resolved.", time: "2:45 PM", ago: "1h", impact: "HIGH", sentiment: "NEGATIVE",
            links: ["Status"]
        },
        {
            ticker: "MSFT", headline: "Microsoft completes Activision Blizzard acquisition.", time: "2:30 PM", ago: "1.2h", impact: "HIGH", sentiment: "POSITIVE",
            links: ["PR"]
        },
        {
            ticker: "NVDA", headline: "Analyst upgrades price target to $1000 citing supply chain improvements.", time: "2:15 PM", ago: "1.5h", impact: "MED", sentiment: "POSITIVE",
            links: ["Note"]
        },
        {
            ticker: "INTC", headline: "Intel foundry updates: roadmap on track for 18A process.", time: "1:45 PM", ago: "2h", impact: "MED", sentiment: "NEUTRAL",
            links: ["Slides"]
        },
        {
            ticker: "CRM", headline: "Salesforce AI Cloud pricing details leaked.", time: "1:30 PM", ago: "2.5h", impact: "LOW", sentiment: "POSITIVE",
            links: ["Report"]
        },
        {
            ticker: "ADBE", headline: "Firefly image generation model integrated into Photoshop.", time: "1:15 PM", ago: "3h", impact: "HIGH", sentiment: "POSITIVE",
            links: ["Demo"]
        },
        {
            ticker: "NFLX", headline: "Ad-supported tier reaches 15M monthly active users.", time: "12:45 PM", ago: "3.5h", impact: "MED", sentiment: "POSITIVE",
            links: ["PR"]
        },
        {
            ticker: "UBER", headline: "Uber Freight announces new logistics partnerships.", time: "12:30 PM", ago: "4h", impact: "LOW", sentiment: "NEUTRAL",
            links: ["Blog"]
        }
    ];

    return feed.map((item, i) => {
        const real = REAL_URLS[item.ticker];
        const base = real?.ir || `https://finance.yahoo.com/quote/${item.ticker}`;
        return {
            id: i.toString(),
            ticker: item.ticker,
            headline: item.headline,
            time: item.time,
            ago: item.ago,
            impact: item.impact as any,
            sentiment: item.sentiment as any,
            links: item.links.map(l => ({
                label: l,
                url: base
            }))
        };
    });
}

export async function getCompanyDeepDive(ticker: string) {
    let base = GLOBAL_MARKET_DATA.find(c => c.ticker === ticker);

    // If searching for something not in the mock, generate it instantly
    if (!base) {
        base = createMockCompany("gen", ticker, `${ticker} Corp.`, "Technology", false);
    }

    return {
        ...base,
        description: `${base.name} engages in the ${base.sector} sector globally.`,
        past_quarters: [
            { q: "Q3 2024", date: "Oct 24", eps_est: "0.80", eps_act: "0.85", beat: true },
            { q: "Q2 2024", date: "Jul 21", eps_est: "0.75", eps_act: "0.74", beat: false },
            { q: "Q1 2024", date: "Apr 15", eps_est: "0.70", eps_act: "0.78", beat: true },
            { q: "Q4 2023", date: "Jan 22", eps_est: "0.68", eps_act: "0.72", beat: true },
        ]
    };
}

// Extended interface for EarningsDetailsPanel
interface EarningsSummaryExtended extends EarningsSummary {
    quarter_label?: string;
    summary_text?: string;
    highlights?: string[];
    time_ago?: string;
}

export async function getCompanyDetails(ticker: string): Promise<{
    company: CompanyData;
    latestSummary: EarningsSummaryExtended | null;
    pastSummaries: EarningsSummaryExtended[];
}> {
    const deepDive = await getCompanyDeepDive(ticker);

    // Generate latest summary if the company has reported
    const latestSummary: EarningsSummaryExtended | null = deepDive.status === "REPORTED" ? {
        id: "latest",
        ticker,
        headline: `${deepDive.name} reported Q3 2024 earnings`,
        time: "4:00 PM",
        ago: "2h",
        impact: "HIGH",
        sentiment: "POSITIVE",
        links: [{ label: "8-K Filing", url: deepDive.sec_url }],
        quarter_label: "Q3 2024",
        summary_text: `${deepDive.name} reported quarterly earnings with results largely in line with expectations.`,
        highlights: [
            "Revenue grew YoY driven by strong demand",
            "Management raised forward guidance",
            "Operating margins improved sequentially"
        ],
        time_ago: "2 hours ago"
    } : null;

    // Past summaries
    const pastSummaries: EarningsSummaryExtended[] = deepDive.past_quarters?.slice(1).map((q, i) => ({
        id: `past-${i}`,
        ticker,
        headline: `${deepDive.name} ${q.q} Results`,
        time: "4:00 PM",
        ago: q.date,
        impact: "MED" as const,
        sentiment: q.beat ? "POSITIVE" as const : "NEGATIVE" as const,
        links: [{ label: "8-K", url: deepDive.sec_url }],
        quarter_label: q.q,
        highlights: [q.beat ? `Beat EPS estimate: $${q.eps_act} vs $${q.eps_est}` : `Missed EPS: $${q.eps_act} vs $${q.eps_est}`],
        time_ago: q.date
    })) || [];

    return {
        company: deepDive as CompanyData,
        latestSummary,
        pastSummaries
    };
}

