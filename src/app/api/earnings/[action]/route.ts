
import { NextRequest, NextResponse } from 'next/server';
import { getSECFilings, getLastFetchTime, formatAgo } from '@/lib/earnings/sec-realtime';
import { getCompanyInfo, searchTickers, getTotalVerifiedTickers, REAL_COMPANIES } from '@/lib/earnings/real-data';
import { SP500_ADDITIONAL } from '@/lib/earnings/sp500-data';
import { earningsCache } from '@/lib/earnings/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 300;

const FMP_API_KEY = process.env.FMP_API_KEY || 'demo';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;
    const { searchParams } = new URL(request.url);

    switch (action) {
        case 'feed':
            return handleFeed(request);
        case 'calendar':
            return handleCalendar(request);
        case 'search':
            return handleSearch(request);
        case 'refresh':
            return handleRefresh(request);
        default:
            return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;
    if (action === 'refresh') return handleRefresh(request);
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

async function handleFeed(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    let secFilings = await getSECFilings();
    let feed = secFilings.map(filing => {
        const info = getCompanyInfo(filing.ticker);
        return {
            id: filing.id,
            ticker: filing.ticker,
            companyName: filing.companyName,
            headline: filing.isEarnings ? `8-K Filed: ${filing.title}` : filing.title,
            time: filing.pubDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            timestamp: filing.pubDate.toISOString(),
            ago: formatAgo(filing.agoMs),
            impact: filing.impact,
            sentiment: filing.isEarnings ? 'POSITIVE' : 'NEUTRAL' as const,
            sector: info.sector,
            eventType: filing.isEarnings ? 'EARNINGS_RELEASE' : 'SEC_FILING',
            isFromSEC: true,
            links: [{ label: '8-K', url: filing.link }, { label: 'IR', url: info.ir }, { label: 'SEC', url: info.sec }],
        };
    });

    if (feed.length === 0) {
        // Simple fallback generation
        feed = []; // Keep it empty if no real data for now
    }

    if (filter === 'high') feed = feed.filter(f => f.impact === 'HIGH');

    const startIdx = (page - 1) * limit;
    return NextResponse.json({
        success: true,
        feed: feed.slice(startIdx, startIdx + limit),
        page,
        hasMore: feed.length > startIdx + limit
    });
}

async function handleCalendar(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const from = new Date().toISOString().split('T')[0];
    const to = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];

    const apiUrl = `https://financialmodelingprep.com/api/v3/earning_calendar?from=${from}&to=${to}&apikey=${FMP_API_KEY}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        const calendar = (data || []).map((item: any) => {
            const info = REAL_COMPANIES[item.symbol] || SP500_ADDITIONAL[item.symbol];
            return {
                ticker: item.symbol,
                companyName: info?.name || item.symbol,
                date: item.date,
                time: item.time === 'bmo' ? 'BMO' : 'AMC',
                epsEstimate: item.epsEstimated,
                sector: info?.sector || 'Unknown'
            };
        }).slice(0, limit);

        return NextResponse.json({ success: true, calendar });
    } catch (e) {
        return NextResponse.json({ success: false, calendar: [] });
    }
}

async function handleSearch(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    if (!query) return NextResponse.json({ results: [] });

    const results = await searchTickers(query, 10);
    return NextResponse.json({
        results: results.map(r => ({ ...r, exchange: 'US', isAI: r.sector === 'Technology' }))
    });
}

async function handleRefresh(request: NextRequest) {
    const updated = await earningsCache.refreshCalendar();
    return NextResponse.json({ success: true, count: updated });
}
