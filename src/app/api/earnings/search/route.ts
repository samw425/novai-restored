// API Route: /api/earnings/search
// Comprehensive search covering S&P 500 + NASDAQ tickers

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Comprehensive ticker database - S&P 500 + major NASDAQ
const COMPANIES: Record<string, { name: string; sector: string; exchange: string; nextDate?: string; time?: string; isAI?: boolean }> = {
    // AI / Big Tech (Featured)
    'NVDA': { name: 'NVIDIA Corporation', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-02-26', time: 'AMC', isAI: true },
    'MSFT': { name: 'Microsoft Corporation', sector: 'Software', exchange: 'NASDAQ', nextDate: '2025-01-28', time: 'AMC', isAI: true },
    'GOOGL': { name: 'Alphabet Inc.', sector: 'Internet', exchange: 'NASDAQ', nextDate: '2025-02-04', time: 'AMC', isAI: true },
    'GOOG': { name: 'Alphabet Inc. Class C', sector: 'Internet', exchange: 'NASDAQ', nextDate: '2025-02-04', time: 'AMC', isAI: true },
    'META': { name: 'Meta Platforms Inc.', sector: 'Internet', exchange: 'NASDAQ', nextDate: '2025-01-29', time: 'AMC', isAI: true },
    'AMZN': { name: 'Amazon.com Inc.', sector: 'E-Commerce', exchange: 'NASDAQ', nextDate: '2025-02-06', time: 'AMC', isAI: true },
    'TSLA': { name: 'Tesla Inc.', sector: 'Automotive', exchange: 'NASDAQ', nextDate: '2025-01-29', time: 'AMC', isAI: true },
    'AAPL': { name: 'Apple Inc.', sector: 'Consumer Electronics', exchange: 'NASDAQ', nextDate: '2025-01-30', time: 'AMC' },

    // Semiconductors
    'AMD': { name: 'Advanced Micro Devices', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-01-28', time: 'AMC', isAI: true },
    'INTC': { name: 'Intel Corporation', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-01-23', time: 'AMC' },
    'AVGO': { name: 'Broadcom Inc.', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-03-06', time: 'AMC', isAI: true },
    'QCOM': { name: 'Qualcomm Inc.', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-02-05', time: 'AMC' },
    'MU': { name: 'Micron Technology', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-03-20', time: 'AMC' },
    'TXN': { name: 'Texas Instruments', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-01-28', time: 'AMC' },
    'ARM': { name: 'Arm Holdings', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-02-05', time: 'AMC', isAI: true },
    'MRVL': { name: 'Marvell Technology', sector: 'Semiconductors', exchange: 'NASDAQ', nextDate: '2025-02-27', time: 'AMC', isAI: true },

    // Software / Cloud
    'CRM': { name: 'Salesforce Inc.', sector: 'Software', exchange: 'NYSE', nextDate: '2025-02-26', time: 'AMC', isAI: true },
    'ORCL': { name: 'Oracle Corporation', sector: 'Software', exchange: 'NYSE', nextDate: '2025-03-10', time: 'AMC', isAI: true },
    'ADBE': { name: 'Adobe Inc.', sector: 'Software', exchange: 'NASDAQ', nextDate: '2025-03-13', time: 'AMC', isAI: true },
    'NOW': { name: 'ServiceNow Inc.', sector: 'Software', exchange: 'NYSE', nextDate: '2025-01-29', time: 'AMC', isAI: true },
    'SNOW': { name: 'Snowflake Inc.', sector: 'Software', exchange: 'NYSE', nextDate: '2025-02-26', time: 'AMC', isAI: true },
    'PLTR': { name: 'Palantir Technologies', sector: 'Software', exchange: 'NYSE', nextDate: '2025-02-03', time: 'AMC', isAI: true },
    'PANW': { name: 'Palo Alto Networks', sector: 'Cybersecurity', exchange: 'NASDAQ', nextDate: '2025-02-18', time: 'AMC' },
    'CRWD': { name: 'CrowdStrike Holdings', sector: 'Cybersecurity', exchange: 'NASDAQ', nextDate: '2025-03-04', time: 'AMC', isAI: true },
    'ZS': { name: 'Zscaler Inc.', sector: 'Cybersecurity', exchange: 'NASDAQ', nextDate: '2025-02-25', time: 'AMC' },
    'DDOG': { name: 'Datadog Inc.', sector: 'Software', exchange: 'NASDAQ', nextDate: '2025-02-13', time: 'BMO', isAI: true },
    'MDB': { name: 'MongoDB Inc.', sector: 'Database', exchange: 'NASDAQ', nextDate: '2025-03-05', time: 'AMC' },
    'NET': { name: 'Cloudflare Inc.', sector: 'Internet', exchange: 'NYSE', nextDate: '2025-02-06', time: 'AMC' },

    // Internet / E-Commerce
    'NFLX': { name: 'Netflix Inc.', sector: 'Streaming', exchange: 'NASDAQ', nextDate: '2025-01-21', time: 'AMC' },
    'DIS': { name: 'The Walt Disney Company', sector: 'Entertainment', exchange: 'NYSE', nextDate: '2025-02-05', time: 'AMC' },
    'SPOT': { name: 'Spotify Technology', sector: 'Streaming', exchange: 'NYSE', nextDate: '2025-02-04', time: 'BMO' },
    'UBER': { name: 'Uber Technologies', sector: 'Transportation', exchange: 'NYSE', nextDate: '2025-02-05', time: 'BMO' },
    'LYFT': { name: 'Lyft Inc.', sector: 'Transportation', exchange: 'NASDAQ', nextDate: '2025-02-11', time: 'AMC' },
    'ABNB': { name: 'Airbnb Inc.', sector: 'Travel', exchange: 'NASDAQ', nextDate: '2025-02-13', time: 'AMC' },
    'BKNG': { name: 'Booking Holdings', sector: 'Travel', exchange: 'NASDAQ', nextDate: '2025-02-27', time: 'AMC' },
    'SHOP': { name: 'Shopify Inc.', sector: 'E-Commerce', exchange: 'NYSE', nextDate: '2025-02-11', time: 'BMO' },
    'EBAY': { name: 'eBay Inc.', sector: 'E-Commerce', exchange: 'NASDAQ', nextDate: '2025-02-25', time: 'AMC' },
    'ETSY': { name: 'Etsy Inc.', sector: 'E-Commerce', exchange: 'NASDAQ', nextDate: '2025-02-20', time: 'AMC' },
    'ZM': { name: 'Zoom Video Communications', sector: 'Software', exchange: 'NASDAQ', nextDate: '2025-02-24', time: 'AMC' },

    // Fintech / Payments
    'V': { name: 'Visa Inc.', sector: 'Payments', exchange: 'NYSE', nextDate: '2025-01-30', time: 'AMC' },
    'MA': { name: 'Mastercard Inc.', sector: 'Payments', exchange: 'NYSE', nextDate: '2025-01-30', time: 'BMO' },
    'PYPL': { name: 'PayPal Holdings', sector: 'Payments', exchange: 'NASDAQ', nextDate: '2025-02-04', time: 'AMC' },
    'SQ': { name: 'Block Inc.', sector: 'Fintech', exchange: 'NYSE', nextDate: '2025-02-20', time: 'AMC' },
    'COIN': { name: 'Coinbase Global', sector: 'Crypto', exchange: 'NASDAQ', nextDate: '2025-02-13', time: 'AMC' },
    'AFRM': { name: 'Affirm Holdings', sector: 'Fintech', exchange: 'NASDAQ', nextDate: '2025-02-06', time: 'AMC' },
    'SOFI': { name: 'SoFi Technologies', sector: 'Fintech', exchange: 'NASDAQ', nextDate: '2025-01-27', time: 'AMC' },

    // Banks
    'JPM': { name: 'JPMorgan Chase', sector: 'Banking', exchange: 'NYSE', nextDate: '2025-01-15', time: 'BMO' },
    'BAC': { name: 'Bank of America', sector: 'Banking', exchange: 'NYSE', nextDate: '2025-01-16', time: 'BMO' },
    'WFC': { name: 'Wells Fargo', sector: 'Banking', exchange: 'NYSE', nextDate: '2025-01-15', time: 'BMO' },
    'GS': { name: 'Goldman Sachs', sector: 'Banking', exchange: 'NYSE', nextDate: '2025-01-15', time: 'BMO' },
    'MS': { name: 'Morgan Stanley', sector: 'Banking', exchange: 'NYSE', nextDate: '2025-01-16', time: 'BMO' },
    'C': { name: 'Citigroup Inc.', sector: 'Banking', exchange: 'NYSE', nextDate: '2025-01-15', time: 'BMO' },
    'SCHW': { name: 'Charles Schwab', sector: 'Brokerage', exchange: 'NYSE', nextDate: '2025-01-21', time: 'BMO' },

    // Retail
    'WMT': { name: 'Walmart Inc.', sector: 'Retail', exchange: 'NYSE', nextDate: '2025-02-20', time: 'BMO' },
    'COST': { name: 'Costco Wholesale', sector: 'Retail', exchange: 'NASDAQ', nextDate: '2025-03-06', time: 'AMC' },
    'TGT': { name: 'Target Corporation', sector: 'Retail', exchange: 'NYSE', nextDate: '2025-03-05', time: 'BMO' },
    'HD': { name: 'Home Depot', sector: 'Retail', exchange: 'NYSE', nextDate: '2025-02-25', time: 'BMO' },
    'LOW': { name: 'Lowe\'s Companies', sector: 'Retail', exchange: 'NYSE', nextDate: '2025-02-26', time: 'BMO' },
    'NKE': { name: 'Nike Inc.', sector: 'Apparel', exchange: 'NYSE', nextDate: '2025-03-20', time: 'AMC' },
    'LULU': { name: 'Lululemon Athletica', sector: 'Apparel', exchange: 'NASDAQ', nextDate: '2025-03-27', time: 'AMC' },
    'SBUX': { name: 'Starbucks Corporation', sector: 'Restaurants', exchange: 'NASDAQ', nextDate: '2025-01-28', time: 'AMC' },
    'MCD': { name: 'McDonald\'s Corporation', sector: 'Restaurants', exchange: 'NYSE', nextDate: '2025-02-10', time: 'BMO' },

    // Healthcare
    'UNH': { name: 'UnitedHealth Group', sector: 'Healthcare', exchange: 'NYSE', nextDate: '2025-01-16', time: 'BMO' },
    'JNJ': { name: 'Johnson & Johnson', sector: 'Pharma', exchange: 'NYSE', nextDate: '2025-01-22', time: 'BMO' },
    'PFE': { name: 'Pfizer Inc.', sector: 'Pharma', exchange: 'NYSE', nextDate: '2025-02-04', time: 'BMO' },
    'ABBV': { name: 'AbbVie Inc.', sector: 'Pharma', exchange: 'NYSE', nextDate: '2025-02-07', time: 'BMO' },
    'MRK': { name: 'Merck & Co.', sector: 'Pharma', exchange: 'NYSE', nextDate: '2025-02-06', time: 'BMO' },
    'LLY': { name: 'Eli Lilly', sector: 'Pharma', exchange: 'NYSE', nextDate: '2025-02-06', time: 'BMO' },
    'TMO': { name: 'Thermo Fisher Scientific', sector: 'Life Sciences', exchange: 'NYSE', nextDate: '2025-01-29', time: 'BMO' },
    'DHR': { name: 'Danaher Corporation', sector: 'Life Sciences', exchange: 'NYSE', nextDate: '2025-01-28', time: 'BMO' },
    'ISRG': { name: 'Intuitive Surgical', sector: 'Medical Devices', exchange: 'NASDAQ', nextDate: '2025-01-23', time: 'AMC' },

    // Energy
    'XOM': { name: 'Exxon Mobil', sector: 'Oil & Gas', exchange: 'NYSE', nextDate: '2025-01-31', time: 'BMO' },
    'CVX': { name: 'Chevron Corporation', sector: 'Oil & Gas', exchange: 'NYSE', nextDate: '2025-01-31', time: 'BMO' },
    'COP': { name: 'ConocoPhillips', sector: 'Oil & Gas', exchange: 'NYSE', nextDate: '2025-02-06', time: 'BMO' },
    'SLB': { name: 'Schlumberger', sector: 'Oil Services', exchange: 'NYSE', nextDate: '2025-01-17', time: 'BMO' },

    // Industrials
    'CAT': { name: 'Caterpillar Inc.', sector: 'Machinery', exchange: 'NYSE', nextDate: '2025-02-04', time: 'BMO' },
    'DE': { name: 'Deere & Company', sector: 'Machinery', exchange: 'NYSE', nextDate: '2025-02-19', time: 'BMO' },
    'BA': { name: 'Boeing Company', sector: 'Aerospace', exchange: 'NYSE', nextDate: '2025-01-29', time: 'BMO' },
    'LMT': { name: 'Lockheed Martin', sector: 'Defense', exchange: 'NYSE', nextDate: '2025-01-28', time: 'BMO' },
    'RTX': { name: 'RTX Corporation', sector: 'Defense', exchange: 'NYSE', nextDate: '2025-01-28', time: 'BMO' },
    'HON': { name: 'Honeywell International', sector: 'Conglomerate', exchange: 'NASDAQ', nextDate: '2025-02-06', time: 'BMO' },
    'GE': { name: 'GE Aerospace', sector: 'Aerospace', exchange: 'NYSE', nextDate: '2025-01-23', time: 'BMO' },
    'UPS': { name: 'United Parcel Service', sector: 'Logistics', exchange: 'NYSE', nextDate: '2025-01-30', time: 'BMO' },
    'FDX': { name: 'FedEx Corporation', sector: 'Logistics', exchange: 'NYSE', nextDate: '2025-03-20', time: 'AMC' },

    // Communications
    'T': { name: 'AT&T Inc.', sector: 'Telecom', exchange: 'NYSE', nextDate: '2025-01-29', time: 'BMO' },
    'VZ': { name: 'Verizon Communications', sector: 'Telecom', exchange: 'NYSE', nextDate: '2025-01-24', time: 'BMO' },
    'TMUS': { name: 'T-Mobile US', sector: 'Telecom', exchange: 'NASDAQ', nextDate: '2025-01-29', time: 'BMO' },
    'CMCSA': { name: 'Comcast Corporation', sector: 'Media', exchange: 'NASDAQ', nextDate: '2025-01-30', time: 'BMO' },

    // Consumer Goods
    'PG': { name: 'Procter & Gamble', sector: 'Consumer Goods', exchange: 'NYSE', nextDate: '2025-01-22', time: 'BMO' },
    'KO': { name: 'Coca-Cola Company', sector: 'Beverages', exchange: 'NYSE', nextDate: '2025-02-11', time: 'BMO' },
    'PEP': { name: 'PepsiCo Inc.', sector: 'Beverages', exchange: 'NASDAQ', nextDate: '2025-02-04', time: 'BMO' },

    // EV / Clean Energy
    'RIVN': { name: 'Rivian Automotive', sector: 'EV', exchange: 'NASDAQ', nextDate: '2025-02-20', time: 'AMC', isAI: true },
    'LCID': { name: 'Lucid Group', sector: 'EV', exchange: 'NASDAQ', nextDate: '2025-02-25', time: 'AMC' },
    'ENPH': { name: 'Enphase Energy', sector: 'Solar', exchange: 'NASDAQ', nextDate: '2025-02-04', time: 'AMC' },
    'FSLR': { name: 'First Solar', sector: 'Solar', exchange: 'NASDAQ', nextDate: '2025-02-25', time: 'AMC' },
};

const FMP_API_KEY = process.env.FMP_API_KEY || 'demo';

async function searchCompanies(query: string, limit: number = 10): Promise<any[]> {
    const upperQuery = query.toUpperCase();
    const results: any[] = [];

    // 1. Local Search (Fast, High Confidence)
    for (const [ticker, data] of Object.entries(COMPANIES)) {
        if (
            ticker.includes(upperQuery) ||
            data.name.toUpperCase().includes(upperQuery) ||
            data.sector.toUpperCase().includes(upperQuery)
        ) {
            results.push({
                ticker,
                name: data.name,
                sector: data.sector,
                exchange: data.exchange,
                nextEarningsDate: data.nextDate,
                earningsTime: data.time,
                confidence: data.nextDate ? (data.time ? 'CONFIRMED' : 'ESTIMATED') : 'UNKNOWN',
                isAI: data.isAI || false,
                source: 'local'
            });
        }
    }

    // 2. External API Fallback (If local results are insufficient)
    if (results.length < 5) {
        try {
            const apiUrl = `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ,NYSE&apikey=${FMP_API_KEY}`;
            const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    data.forEach((item: any) => {
                        // Avoid duplicates
                        if (!results.find(r => r.ticker === item.symbol)) {
                            results.push({
                                ticker: item.symbol,
                                name: item.name,
                                sector: 'N/A', // Search endpoint sometimes omits sector, handled by profile fetch later
                                exchange: item.stockExchange,
                                nextEarningsDate: null, // Requires separate call, UI handles null gracefully
                                earningsTime: null,
                                confidence: 'UNKNOWN',
                                isAI: false,
                                source: 'api'
                            });
                        }
                    });
                }
            }
        } catch (e) {
            console.error('External search API failed:', e);
        }
    }

    // Sort: exact ticker match first, then AI companies, then alphabetical
    results.sort((a, b) => {
        if (a.ticker === upperQuery) return -1;
        if (b.ticker === upperQuery) return 1;
        if (a.ticker.startsWith(upperQuery) && !b.ticker.startsWith(upperQuery)) return -1;
        if (!a.ticker.startsWith(upperQuery) && b.ticker.startsWith(upperQuery)) return 1;
        if (a.isAI && !b.isAI) return -1;
        if (!a.isAI && b.isAI) return 1;
        return a.ticker.localeCompare(b.ticker);
    });

    return results.slice(0, limit);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim();
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        if (!query || query.length < 1) {
            return NextResponse.json({ results: [], source: 'empty' });
        }

        const results = await searchCompanies(query, limit);

        if (results.length === 0) {
            return NextResponse.json({
                results: [],
                query,
                message: 'No results found. Try a different ticker or company name.',
            });
        }

        return NextResponse.json({
            results,
            query,
            count: results.length,
            totalAvailable: Object.keys(COMPANIES).length,
            source: 'database',
        });

    } catch (error: any) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: error.message, results: [] },
            { status: 500 }
        );
    }
}
