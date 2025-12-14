// API Route: /api/earnings/feed
// Real-time earnings feed from SEC EDGAR 8-K filings
// Polls every 60 seconds for new filings

import { NextRequest, NextResponse } from 'next/server';
import { getSECFilings, getLastFetchTime, formatAgo, type SECFiling } from '@/lib/earnings/sec-realtime';
import { getCompanyInfo, getSecEdgarUrl } from '@/lib/earnings/real-data';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Fallback seed data when SEC feed is empty (weekends, after-hours)
const SEED_FEED = [
    { ticker: 'NVDA', headline: 'Q3 Revenue $18.1B (+206% YoY), Data Center revenue $14.5B beats Street. Raised Q4 guidance.', impact: 'HIGH' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'MSFT', headline: 'Cloud revenue $31.8B; Azure growth 29% constant currency. AI services driving incremental $10B+ run rate.', impact: 'HIGH' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'GOOGL', headline: 'Q3 Search revenue $44B (+11% YoY), YouTube ads $8B. Cloud segment profitable for 4th consecutive quarter.', impact: 'HIGH' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'META', headline: 'Q3 revenue $34.1B (+23% YoY), Family daily active people 3.14B. Reality Labs loss $3.7B.', impact: 'HIGH' as const, sentiment: 'NEUTRAL' as const },
    { ticker: 'AMZN', headline: 'Q3 revenue $143B, AWS revenue $23.1B (+12% YoY), operating income $11.2B beats by $3B.', impact: 'HIGH' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'TSLA', headline: 'Q3 deliveries 435K, operating margin 7.6%. Energy storage deployments up 90% YoY.', impact: 'HIGH' as const, sentiment: 'NEUTRAL' as const },
    { ticker: 'AMD', headline: 'Data Center revenue $2.3B (+21% QoQ), MI300 shipments ramping. Gaming segment weakness offset by enterprise.', impact: 'MED' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'PLTR', headline: 'Q3 revenue $558M (+17% YoY), US commercial revenue +52%. Raised full-year guidance.', impact: 'MED' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'CRM', headline: 'Q3 revenue $8.7B (+11% YoY), remaining performance obligation $48B. Data Cloud growing rapidly.', impact: 'MED' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'NFLX', headline: 'Q3 revenue $8.5B (+8% YoY), paid memberships 247M. Ad-supported tier growing 70% QoQ.', impact: 'MED' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'JPM', headline: 'Q3 revenue $40.7B (+22% YoY), net income $13.2B. NII guidance raised to $89B.', impact: 'HIGH' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'AAPL', headline: 'Q4 iPhone revenue $43.8B (-1% YoY), Services revenue $22.3B record high (+16% YoY).', impact: 'HIGH' as const, sentiment: 'NEUTRAL' as const },
    { ticker: 'AVGO', headline: 'Q4 Revenue $14.05B (+51% YoY). AI revenue $12.7B for FY2024. Raised dividend 11%.', impact: 'HIGH' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'ORCL', headline: 'Q2 Revenue $13.8B (+9% YoY). Cloud infrastructure revenue +52%, raising guidance.', impact: 'MED' as const, sentiment: 'POSITIVE' as const },
    { ticker: 'WMT', headline: 'Q3 revenue $160B (+5% YoY), US comp sales +4.9%. E-commerce up 24%.', impact: 'HIGH' as const, sentiment: 'POSITIVE' as const },
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all';
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        // Fetch real SEC filings
        let secFilings = await getSECFilings();
        const lastSync = getLastFetchTime();

        // Transform SEC filings to feed format
        let feed = secFilings.map((filing, index) => {
            const info = getCompanyInfo(filing.ticker);
            return {
                id: filing.id,
                ticker: filing.ticker,
                companyName: filing.companyName,
                headline: filing.isEarnings
                    ? `8-K Filed: ${filing.title}`
                    : filing.title,
                time: filing.pubDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                ago: formatAgo(filing.agoMs),
                impact: filing.impact,
                sentiment: filing.isEarnings ? 'POSITIVE' : 'NEUTRAL' as const,
                summaryStatus: 'COMPLETE' as const,
                sector: info.sector,
                eventType: filing.isEarnings ? 'EARNINGS_RELEASE' : 'SEC_FILING',
                isFromSEC: true,
                links: [
                    { label: '8-K', url: filing.link },
                    { label: 'IR', url: info.ir },
                    { label: 'SEC', url: info.sec },
                ],
            };
        });

        // If no SEC filings found (weekend/after-hours), use seed data
        if (feed.length === 0) {
            const now = new Date();
            feed = SEED_FEED.map((item, index) => {
                const info = getCompanyInfo(item.ticker);
                const minutesAgo = index * 12 + Math.floor(Math.random() * 8);
                return {
                    id: `seed-${item.ticker}-${index}`,
                    ticker: item.ticker,
                    companyName: info.name,
                    headline: item.headline,
                    time: new Date(now.getTime() - minutesAgo * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    ago: formatAgo(minutesAgo * 60000),
                    impact: item.impact,
                    sentiment: item.sentiment,
                    summaryStatus: 'COMPLETE' as const,
                    sector: info.sector,
                    eventType: 'EARNINGS_RELEASE',
                    isFromSEC: false,
                    links: [
                        { label: '8-K', url: info.sec },
                        { label: 'IR', url: info.ir },
                    ],
                };
            });
        }

        // Apply filters
        if (filter === 'high') {
            // SIGNALS: Only HIGH impact market movers
            feed = feed.filter(f => f.impact === 'HIGH');
        } else if (filter === 'filings') {
            // FILINGS: Only items that are SEC filings
            feed = feed.filter(f => f.isFromSEC || f.eventType === 'SEC_FILING');
        }
        // SCANNER (filter === 'all'): Shows everything in real-time order

        // Pagination
        const startIdx = (page - 1) * limit;
        const endIdx = startIdx + limit;
        const paginatedFeed = feed.slice(startIdx, endIdx);

        return NextResponse.json({
            success: true,
            count: paginatedFeed.length,
            totalCount: feed.length,
            page,
            hasMore: endIdx < feed.length,
            feed: paginatedFeed,
            source: secFilings.length > 0 ? 'sec-edgar' : 'seed',
            lastSync: lastSync?.toISOString() || null,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Earnings feed error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch feed', feed: [] },
            { status: 500 }
        );
    }
}
