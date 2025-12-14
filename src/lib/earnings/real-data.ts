// ============================================================================
// REAL EARNINGS DATA SYSTEM - V1
// Sources: SEC EDGAR (free), Company IR (free), Public Calendars (free)
// ============================================================================

"use server";

import { SP500_ADDITIONAL } from "./sp500-data";

// All S&P 500 + Major NASDAQ tickers with VERIFIED IR links
// This is REAL data - authoritative investor relations pages

export const REAL_COMPANIES: Record<string, {
    name: string;
    sector: string;
    ir: string;  // Investor Relations page
    cik?: string; // SEC CIK for direct EDGAR lookup
}> = {
    // ========== MEGA CAP TECH (AI/Cloud) ==========
    "NVDA": { name: "NVIDIA Corporation", sector: "Technology", ir: "https://investor.nvidia.com/", cik: "1045810" },
    "MSFT": { name: "Microsoft Corporation", sector: "Technology", ir: "https://www.microsoft.com/en-us/investor", cik: "789019" },
    "AAPL": { name: "Apple Inc.", sector: "Technology", ir: "https://investor.apple.com/", cik: "320193" },
    "GOOGL": { name: "Alphabet Inc.", sector: "Technology", ir: "https://abc.xyz/investor/", cik: "1652044" },
    "GOOG": { name: "Alphabet Inc.", sector: "Technology", ir: "https://abc.xyz/investor/", cik: "1652044" },
    "AMZN": { name: "Amazon.com Inc.", sector: "Consumer", ir: "https://ir.aboutamazon.com/", cik: "1018724" },
    "META": { name: "Meta Platforms Inc.", sector: "Technology", ir: "https://investor.fb.com/", cik: "1326801" },
    "TSLA": { name: "Tesla Inc.", sector: "Automotive", ir: "https://ir.tesla.com/", cik: "1318605" },

    // ========== AI/SEMICONDUCTORS ==========
    "AMD": { name: "Advanced Micro Devices", sector: "Technology", ir: "https://ir.amd.com/", cik: "2488" },
    "INTC": { name: "Intel Corporation", sector: "Technology", ir: "https://www.intc.com/", cik: "50863" },
    "AVGO": { name: "Broadcom Inc.", sector: "Technology", ir: "https://investors.broadcom.com/", cik: "1730168" },
    "QCOM": { name: "Qualcomm Inc.", sector: "Technology", ir: "https://investor.qualcomm.com/", cik: "804328" },
    "MU": { name: "Micron Technology", sector: "Technology", ir: "https://investors.micron.com/", cik: "723125" },
    "MRVL": { name: "Marvell Technology", sector: "Technology", ir: "https://investor.marvell.com/", cik: "1058057" },
    "ARM": { name: "Arm Holdings", sector: "Technology", ir: "https://investors.arm.com/", cik: "1973239" },

    // ========== AI SOFTWARE ==========
    "PLTR": { name: "Palantir Technologies", sector: "Technology", ir: "https://investors.palantir.com/", cik: "1321655" },
    "CRM": { name: "Salesforce Inc.", sector: "Technology", ir: "https://investor.salesforce.com/", cik: "1108524" },
    "SNOW": { name: "Snowflake Inc.", sector: "Technology", ir: "https://investors.snowflake.com/", cik: "1640147" },
    "NOW": { name: "ServiceNow Inc.", sector: "Technology", ir: "https://investors.servicenow.com/", cik: "1373715" },
    "PANW": { name: "Palo Alto Networks", sector: "Technology", ir: "https://investors.paloaltonetworks.com/", cik: "1327567" },
    "CRWD": { name: "CrowdStrike Holdings", sector: "Technology", ir: "https://ir.crowdstrike.com/", cik: "1535527" },
    "ZS": { name: "Zscaler Inc.", sector: "Technology", ir: "https://ir.zscaler.com/", cik: "1713683" },
    "DDOG": { name: "Datadog Inc.", sector: "Technology", ir: "https://investors.datadoghq.com/", cik: "1714608" },
    "NET": { name: "Cloudflare Inc.", sector: "Technology", ir: "https://cloudflare.net/", cik: "1477333" },
    "MDB": { name: "MongoDB Inc.", sector: "Technology", ir: "https://investors.mongodb.com/", cik: "1441816" },

    // ========== STREAMING/MEDIA ==========
    "NFLX": { name: "Netflix Inc.", sector: "Media", ir: "https://ir.netflix.net/", cik: "1065280" },
    "DIS": { name: "Walt Disney Co.", sector: "Media", ir: "https://thewaltdisneycompany.com/investor-relations/", cik: "1744489" },
    "WBD": { name: "Warner Bros. Discovery", sector: "Media", ir: "https://ir.wbd.com/", cik: "1437107" },
    "PARA": { name: "Paramount Global", sector: "Media", ir: "https://ir.paramount.com/", cik: "813828" },
    "CMCSA": { name: "Comcast Corporation", sector: "Media", ir: "https://www.cmcsa.com/", cik: "902739" },
    "SPOT": { name: "Spotify Technology", sector: "Media", ir: "https://investors.spotify.com/", cik: "1639920" },

    // ========== FINANCIALS ==========
    "JPM": { name: "JPMorgan Chase", sector: "Financial", ir: "https://www.jpmorganchase.com/ir", cik: "19617" },
    "BAC": { name: "Bank of America", sector: "Financial", ir: "https://investor.bankofamerica.com/", cik: "70858" },
    "WFC": { name: "Wells Fargo", sector: "Financial", ir: "https://www.wellsfargo.com/about/investor-relations/", cik: "72971" },
    "C": { name: "Citigroup Inc.", sector: "Financial", ir: "https://www.citigroup.com/global/investors", cik: "831001" },
    "GS": { name: "Goldman Sachs", sector: "Financial", ir: "https://www.goldmansachs.com/investor-relations/", cik: "886982" },
    "MS": { name: "Morgan Stanley", sector: "Financial", ir: "https://www.morganstanley.com/about-us-ir", cik: "895421" },
    "V": { name: "Visa Inc.", sector: "Financial", ir: "https://investor.visa.com/", cik: "1403161" },
    "MA": { name: "Mastercard Inc.", sector: "Financial", ir: "https://investor.mastercard.com/", cik: "1141391" },
    "AXP": { name: "American Express", sector: "Financial", ir: "https://ir.americanexpress.com/", cik: "4962" },
    "PYPL": { name: "PayPal Holdings", sector: "Financial", ir: "https://investor.pypl.com/", cik: "1633917" },
    "BLK": { name: "BlackRock Inc.", sector: "Financial", ir: "https://ir.blackrock.com/", cik: "1364742" },
    "SCHW": { name: "Charles Schwab", sector: "Financial", ir: "https://www.aboutschwab.com/investor-relations", cik: "316709" },

    // ========== HEALTHCARE/PHARMA ==========
    "JNJ": { name: "Johnson & Johnson", sector: "Healthcare", ir: "https://investor.jnj.com/", cik: "200406" },
    "UNH": { name: "UnitedHealth Group", sector: "Healthcare", ir: "https://www.unitedhealthgroup.com/investors.html", cik: "731766" },
    "LLY": { name: "Eli Lilly", sector: "Healthcare", ir: "https://investor.lilly.com/", cik: "59478" },
    "PFE": { name: "Pfizer Inc.", sector: "Healthcare", ir: "https://investors.pfizer.com/", cik: "78003" },
    "ABBV": { name: "AbbVie Inc.", sector: "Healthcare", ir: "https://investors.abbvie.com/", cik: "1551152" },
    "MRK": { name: "Merck & Co.", sector: "Healthcare", ir: "https://www.merck.com/investor-relations/", cik: "310158" },
    "TMO": { name: "Thermo Fisher Scientific", sector: "Healthcare", ir: "https://ir.thermofisher.com/", cik: "97745" },
    "ABT": { name: "Abbott Laboratories", sector: "Healthcare", ir: "https://www.abbott.com/investors.html", cik: "1800" },
    "BMY": { name: "Bristol-Myers Squibb", sector: "Healthcare", ir: "https://investor.bms.com/", cik: "14272" },
    "GILD": { name: "Gilead Sciences", sector: "Healthcare", ir: "https://investors.gilead.com/", cik: "882095" },
    "AMGN": { name: "Amgen Inc.", sector: "Healthcare", ir: "https://investors.amgen.com/", cik: "318154" },
    "ISRG": { name: "Intuitive Surgical", sector: "Healthcare", ir: "https://isrg.intuitive.com/", cik: "1035267" },
    "MRNA": { name: "Moderna Inc.", sector: "Healthcare", ir: "https://investors.modernatx.com/", cik: "1682852" },

    // ========== CONSUMER ==========
    "WMT": { name: "Walmart Inc.", sector: "Consumer", ir: "https://stock.walmart.com/", cik: "104169" },
    "COST": { name: "Costco Wholesale", sector: "Consumer", ir: "https://investor.costco.com/", cik: "909832" },
    "HD": { name: "Home Depot", sector: "Consumer", ir: "https://ir.homedepot.com/", cik: "354950" },
    "LOW": { name: "Lowe's Companies", sector: "Consumer", ir: "https://corporate.lowes.com/investors", cik: "60667" },
    "TGT": { name: "Target Corporation", sector: "Consumer", ir: "https://investors.target.com/", cik: "27419" },
    "PG": { name: "Procter & Gamble", sector: "Consumer", ir: "https://pginvestor.com/", cik: "80424" },
    "KO": { name: "Coca-Cola Co.", sector: "Consumer", ir: "https://investors.coca-colacompany.com/", cik: "21344" },
    "PEP": { name: "PepsiCo Inc.", sector: "Consumer", ir: "https://investor.pepsico.com/", cik: "77476" },
    "MCD": { name: "McDonald's Corp.", sector: "Consumer", ir: "https://investor.mcdonalds.com/", cik: "63908" },
    "SBUX": { name: "Starbucks Corp.", sector: "Consumer", ir: "https://investor.starbucks.com/", cik: "829224" },
    "NKE": { name: "Nike Inc.", sector: "Consumer", ir: "https://investors.nike.com/", cik: "320187" },
    "LULU": { name: "Lululemon Athletica", sector: "Consumer", ir: "https://investor.lululemon.com/", cik: "1397187" },

    // ========== ENERGY ==========
    "XOM": { name: "Exxon Mobil", sector: "Energy", ir: "https://investor.exxonmobil.com/", cik: "34088" },
    "CVX": { name: "Chevron Corp.", sector: "Energy", ir: "https://www.chevron.com/investors", cik: "93410" },
    "OXY": { name: "Occidental Petroleum", sector: "Energy", ir: "https://www.oxy.com/investors/", cik: "797468" },
    "SLB": { name: "Schlumberger", sector: "Energy", ir: "https://investorcenter.slb.com/", cik: "87347" },
    "COP": { name: "ConocoPhillips", sector: "Energy", ir: "https://investor.conocophillips.com/", cik: "1163165" },

    // ========== INDUSTRIALS ==========
    "CAT": { name: "Caterpillar Inc.", sector: "Industrial", ir: "https://www.caterpillar.com/en/investors.html", cik: "18230" },
    "DE": { name: "Deere & Company", sector: "Industrial", ir: "https://investor.deere.com/", cik: "315189" },
    "BA": { name: "Boeing Co.", sector: "Industrial", ir: "https://investors.boeing.com/", cik: "12927" },
    "RTX": { name: "RTX Corporation", sector: "Industrial", ir: "https://investors.rtx.com/", cik: "101829" },
    "LMT": { name: "Lockheed Martin", sector: "Industrial", ir: "https://investors.lockheedmartin.com/", cik: "936468" },
    "GE": { name: "GE Aerospace", sector: "Industrial", ir: "https://www.geaerospace.com/investors", cik: "40545" },
    "HON": { name: "Honeywell International", sector: "Industrial", ir: "https://investor.honeywell.com/", cik: "773840" },
    "UNP": { name: "Union Pacific", sector: "Industrial", ir: "https://www.up.com/investor/", cik: "100885" },
    "UPS": { name: "United Parcel Service", sector: "Industrial", ir: "https://investors.ups.com/", cik: "1090727" },
    "FDX": { name: "FedEx Corporation", sector: "Industrial", ir: "https://investors.fedex.com/", cik: "1048911" },

    // ========== TELECOM/UTILITIES ==========
    "T": { name: "AT&T Inc.", sector: "Telecom", ir: "https://investors.att.com/", cik: "732717" },
    "VZ": { name: "Verizon Communications", sector: "Telecom", ir: "https://www.verizon.com/about/investors", cik: "732712" },
    "TMUS": { name: "T-Mobile US", sector: "Telecom", ir: "https://investor.t-mobile.com/", cik: "1283699" },
    "NEE": { name: "NextEra Energy", sector: "Utilities", ir: "https://investor.nexteraenergy.com/", cik: "753308" },
    "DUK": { name: "Duke Energy", sector: "Utilities", ir: "https://www.duke-energy.com/our-company/investors", cik: "1326160" },
    "SO": { name: "Southern Company", sector: "Utilities", ir: "https://investor.southerncompany.com/", cik: "92122" },

    // ========== REAL ESTATE ==========
    "AMT": { name: "American Tower", sector: "Real Estate", ir: "https://www.americantower.com/investor-relations/", cik: "1053507" },
    "PLD": { name: "Prologis Inc.", sector: "Real Estate", ir: "https://ir.prologis.com/", cik: "1045609" },
    "EQIX": { name: "Equinix Inc.", sector: "Real Estate", ir: "https://investor.equinix.com/", cik: "1101239" },

    // ========== TRAVEL/HOSPITALITY ==========
    "BKNG": { name: "Booking Holdings", sector: "Travel", ir: "https://ir.bookingholdings.com/", cik: "1075531" },
    "ABNB": { name: "Airbnb Inc.", sector: "Travel", ir: "https://investors.airbnb.com/", cik: "1559720" },
    "MAR": { name: "Marriott International", sector: "Travel", ir: "https://marriott.gcs-web.com/", cik: "1048286" },
    "UBER": { name: "Uber Technologies", sector: "Travel", ir: "https://investor.uber.com/", cik: "1543151" },
    "LYFT": { name: "Lyft Inc.", sector: "Travel", ir: "https://investor.lyft.com/", cik: "1759509" },
    "DAL": { name: "Delta Air Lines", sector: "Travel", ir: "https://ir.delta.com/", cik: "27904" },
    "UAL": { name: "United Airlines", sector: "Travel", ir: "https://ir.united.com/", cik: "100517" },
    "LUV": { name: "Southwest Airlines", sector: "Travel", ir: "https://www.southwestairlinesinvestorrelations.com/", cik: "92380" },
};

// ============================================================================
// SEC EDGAR URL GENERATORS (Always works - direct to official source)
// ============================================================================

export function getSecEdgarUrl(ticker: string, cik?: string): string {
    const company = REAL_COMPANIES[ticker.toUpperCase()];
    const useCik = cik || company?.cik;

    if (useCik) {
        return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${useCik}&type=8-K&dateb=&owner=include&count=40`;
    }
    // Fallback: search by ticker
    return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${ticker}&type=8-K&dateb=&owner=include&count=40`;
}

export function getSecFilingsRssUrl(cik: string): string {
    return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=8-K&dateb=&owner=include&count=20&output=atom`;
}

// ============================================================================
// YAHOO FINANCE URL GENERATORS (Free, always works)
// ============================================================================

export function getYahooFinanceUrl(ticker: string): string {
    return `https://finance.yahoo.com/quote/${ticker}`;
}

export function getYahooEarningsUrl(ticker: string): string {
    return `https://finance.yahoo.com/quote/${ticker}/analysis`;
}

// ============================================================================
// IR URL GETTER (Returns verified IR or fallback to SEC)
// ============================================================================

export function getInvestorRelationsUrl(ticker: string): string {
    const company = REAL_COMPANIES[ticker.toUpperCase()];
    if (company?.ir) {
        return company.ir;
    }
    // Fallback: SEC search
    return getSecEdgarUrl(ticker);
}

// ============================================================================
// COMPANY LOOKUP
// ============================================================================

export function getCompanyInfo(ticker: string): {
    ticker: string;
    name: string;
    sector: string;
    ir: string;
    sec: string;
    yahoo: string;
    found: boolean;
} {
    const upper = ticker.toUpperCase();

    // Check core companies first
    let company = REAL_COMPANIES[upper];

    // Then check S&P 500 additional companies
    if (!company) {
        company = SP500_ADDITIONAL[upper];
    }

    if (company) {
        return {
            ticker: upper,
            name: company.name,
            sector: company.sector,
            ir: company.ir,
            sec: getSecEdgarUrl(upper, company.cik),
            yahoo: getYahooFinanceUrl(upper),
            found: true
        };
    }

    // Unknown ticker - still provide working links
    return {
        ticker: upper,
        name: `${upper}`,
        sector: "Unknown",
        ir: `https://www.google.com/search?q=${upper}+investor+relations`,
        sec: getSecEdgarUrl(upper),
        yahoo: getYahooFinanceUrl(upper),
        found: false
    };
}

// ============================================================================
// SEARCH FUNCTION - Works for ANY ticker
// ============================================================================

export async function searchTickers(query: string, limit: number = 10): Promise<{
    ticker: string;
    name: string;
    sector: string;
    verified: boolean;
}[]> {
    if (!query || query.length === 0) return [];

    const q = query.toUpperCase();
    const results: { ticker: string; name: string; sector: string; verified: boolean }[] = [];
    const seen = new Set<string>();

    // Search through REAL_COMPANIES first
    for (const [ticker, data] of Object.entries(REAL_COMPANIES)) {
        if (ticker.includes(q) || data.name.toUpperCase().includes(q)) {
            if (!seen.has(ticker)) {
                results.push({
                    ticker,
                    name: data.name,
                    sector: data.sector,
                    verified: true
                });
                seen.add(ticker);
            }
            if (results.length >= limit) break;
        }
    }

    // Continue searching through SP500_ADDITIONAL if we need more results
    if (results.length < limit) {
        for (const [ticker, data] of Object.entries(SP500_ADDITIONAL)) {
            if (ticker.includes(q) || data.name.toUpperCase().includes(q)) {
                if (!seen.has(ticker)) {
                    results.push({
                        ticker,
                        name: data.name,
                        sector: data.sector,
                        verified: true
                    });
                    seen.add(ticker);
                }
                if (results.length >= limit) break;
            }
        }
    }

    // If exact match not found but query looks like a ticker, add as unverified
    if (results.length === 0 && /^[A-Z]{1,5}$/.test(q)) {
        results.push({
            ticker: q,
            name: q,
            sector: "Unknown",
            verified: false
        });
    }

    return results;
}

// ============================================================================
// TICKER COUNT
// ============================================================================

export function getTotalVerifiedTickers(): number {
    return Object.keys(REAL_COMPANIES).length + Object.keys(SP500_ADDITIONAL).length;
}
