// API Route: /api/earnings/company/[ticker]
// Full company earnings profile - past + future + links
// Works for ANY ticker

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const FMP_BASE = 'https://financialmodelingprep.com/api/v3';

// Known IR URLs for major companies
const IR_URLS: Record<string, string> = {
    'NVDA': 'https://investor.nvidia.com/',
    'MSFT': 'https://www.microsoft.com/en-us/investor',
    'GOOGL': 'https://abc.xyz/investor/',
    'GOOG': 'https://abc.xyz/investor/',
    'META': 'https://investor.fb.com/',
    'AMZN': 'https://ir.aboutamazon.com/',
    'AAPL': 'https://investor.apple.com/',
    'TSLA': 'https://ir.tesla.com/',
    'AMD': 'https://ir.amd.com/',
    'PLTR': 'https://investors.palantir.com/',
    'CRM': 'https://investor.salesforce.com/',
    'INTC': 'https://www.intc.com/',
    'SNOW': 'https://investors.snowflake.com/',
    'NFLX': 'https://ir.netflix.net/',
    'DIS': 'https://thewaltdisneycompany.com/investor-relations/',
    'JPM': 'https://www.jpmorganchase.com/ir',
    'BAC': 'https://investor.bankofamerica.com/',
    'WMT': 'https://stock.walmart.com/',
    'V': 'https://investor.visa.com/',
    'MA': 'https://investor.mastercard.com/',
    'PYPL': 'https://investor.pypl.com/',
    'ADBE': 'https://www.adobe.com/investor-relations.html',
    'ORCL': 'https://investor.oracle.com/',
    'IBM': 'https://www.ibm.com/investor',
    'CSCO': 'https://investor.cisco.com/',
    'UBER': 'https://investor.uber.com/',
    'ABNB': 'https://investors.airbnb.com/',
    'SQ': 'https://investors.block.xyz/',
    'SHOP': 'https://investors.shopify.com/',
    'ZM': 'https://investors.zoom.us/',
    'COIN': 'https://investor.coinbase.com/',
    'RIVN': 'https://rivian.com/investors',
    'LCID': 'https://ir.lucidmotors.com/',
};

// Generate SEC search URL for any ticker
function getSecUrl(ticker: string, cik?: string): string {
    if (cik) {
        return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=8-K&dateb=&owner=include&count=40`;
    }
    return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${ticker}&type=8-K&dateb=&owner=include&count=40`;
}

// Generate IR URL (known or guessed)
function getIrUrl(ticker: string, website?: string): string {
    if (IR_URLS[ticker.toUpperCase()]) {
        return IR_URLS[ticker.toUpperCase()];
    }
    if (website) {
        const domain = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
        return `https://investor.${domain}/`;
    }
    return `https://www.google.com/search?q=${ticker}+investor+relations`;
}

// Fetch from FMP
async function fetchFMP(endpoint: string): Promise<any> {
    const apiKey = process.env.FMP_API_KEY || 'demo';
    const url = `${FMP_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${apiKey}`;

    try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error('FMP fetch error:', e);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ ticker: string }> }
) {
    try {
        const { ticker } = await params;
        const upperTicker = ticker.toUpperCase();

        // 1. Fetch company profile from FMP
        const profile = await fetchFMP(`/profile/${upperTicker}`);
        const company = Array.isArray(profile) && profile.length > 0 ? profile[0] : null;

        if (!company) {
            return NextResponse.json(
                { error: 'Company not found', ticker: upperTicker },
                { status: 404 }
            );
        }

        // 2. Fetch earnings history (PAST earnings with dates)
        const history = await fetchFMP(`/historical/earning_calendar/${upperTicker}?limit=12`);

        // 3. Fetch upcoming earnings (FUTURE)
        const today = new Date().toISOString().split('T')[0];
        const future = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const upcomingAll = await fetchFMP(`/earning_calendar?from=${today}&to=${future}`);
        const upcoming = upcomingAll?.find((e: any) => e.symbol?.toUpperCase() === upperTicker);

        // 4. Build links
        const irUrl = getIrUrl(upperTicker, company.website);
        const secUrl = getSecUrl(upperTicker, company.cik);

        // 5. Format past quarters with links
        const pastQuarters = (history || []).map((q: any) => {
            const quarterDate = new Date(q.date);
            const year = quarterDate.getFullYear();
            const month = quarterDate.getMonth();
            const fiscalQ = Math.floor(month / 3) + 1;

            return {
                quarter: q.fiscalQuarter ? `Q${q.fiscalQuarter} '${String(q.fiscalYear).slice(-2)}` : `Q${fiscalQ} '${String(year).slice(-2)}`,
                date: q.date,
                epsEstimate: q.epsEstimated || 0,
                epsActual: q.eps || 0,
                revenueEstimate: q.revenueEstimated,
                revenueActual: q.revenue,
                beat: (q.eps || 0) >= (q.epsEstimated || 0),
                // Links for each past quarter
                links: {
                    secFiling: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${upperTicker}&type=8-K&dateb=${q.date.replace(/-/g, '')}&owner=include&count=5`,
                    ir: irUrl,
                }
            };
        });

        // 6. Determine confidence
        let confidence: 'CONFIRMED' | 'ESTIMATED' | 'UNKNOWN' = 'UNKNOWN';
        if (upcoming?.date && upcoming?.time && upcoming.time !== 'TBA') {
            confidence = 'CONFIRMED';
        } else if (upcoming?.date) {
            confidence = 'ESTIMATED';
        }

        // 7. Build response
        const response = {
            ticker: upperTicker,
            name: company.companyName,
            sector: company.sector,
            industry: company.industry,
            exchange: company.exchangeShortName,
            marketCap: company.mktCap,
            website: company.website,
            cik: company.cik,

            // Next earnings
            nextEarnings: upcoming ? {
                date: upcoming.date,
                time: upcoming.time || 'TBA',
                confidence,
                epsEstimate: upcoming.epsEstimated,
                revenueEstimate: upcoming.revenueEstimated,
                fiscalQuarter: upcoming.fiscalQuarter,
                fiscalYear: upcoming.fiscalYear,
            } : null,

            // Past earnings with links
            pastQuarters,

            // Quick links (always available)
            links: {
                ir: irUrl,
                sec: secUrl,
                webcast: irUrl, // Usually on IR page
                yahooFinance: `https://finance.yahoo.com/quote/${upperTicker}`,
                googleFinance: `https://www.google.com/finance/quote/${upperTicker}:${company.exchangeShortName || 'NASDAQ'}`,
            },

            // Metadata
            fetchedAt: new Date().toISOString(),
        };

        // 8. Cache to Supabase for future quick lookups (async, don't wait)
        cacheCompany(response).catch(console.error);

        return NextResponse.json({
            success: true,
            company: response,
        });

    } catch (error: any) {
        console.error('Company fetch error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch company' },
            { status: 500 }
        );
    }
}

// Background cache to Supabase
async function cacheCompany(data: any) {
    try {
        // Upsert company
        const { data: company, error } = await supabaseAdmin
            .from('companies')
            .upsert({
                ticker: data.ticker,
                name: data.name,
                sector: data.sector,
                cik: data.cik,
                exchange: data.exchange,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'ticker' })
            .select('id')
            .single();

        if (error || !company) return;

        // Upsert next_earnings if available
        if (data.nextEarnings?.date) {
            await supabaseAdmin
                .from('next_earnings')
                .upsert({
                    company_id: company.id,
                    next_earnings_at: data.nextEarnings.date,
                    earnings_time: data.nextEarnings.time,
                    confidence: data.nextEarnings.confidence,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'company_id' });
        }
    } catch (e) {
        console.error('Cache error:', e);
    }
}
