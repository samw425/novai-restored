// API Route: /api/earnings/feed
// Real-time earnings feed with comprehensive S&P 500 / NASDAQ coverage

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Comprehensive feed data - simulates real-time earnings releases
// In production, this comes from SEC EDGAR RSS + company IR monitoring
function generateFeed() {
    const now = new Date();

    const companies = [
        // AI/Tech Leaders - HIGH impact
        { ticker: 'NVDA', name: 'NVIDIA Corporation', headline: 'Q3 Revenue $18.1B (+206% YoY), Data Center revenue $14.5B beats Street. Raised Q4 guidance.', impact: 'HIGH', sentiment: 'POSITIVE', sector: 'AI' },
        { ticker: 'MSFT', name: 'Microsoft', headline: 'Cloud revenue $31.8B; Azure growth 29% constant currency. AI services driving incremental $10B+ run rate.', impact: 'HIGH', sentiment: 'POSITIVE', sector: 'AI' },
        { ticker: 'GOOGL', name: 'Alphabet', headline: 'Q3 Search revenue $44B (+11% YoY), YouTube ads $8B. Cloud segment profitable for 4th consecutive quarter.', impact: 'HIGH', sentiment: 'POSITIVE', sector: 'AI' },
        { ticker: 'META', name: 'Meta Platforms', headline: 'Q3 revenue $34.1B (+23% YoY), Family daily active people 3.14B. Reality Labs loss $3.7B.', impact: 'HIGH', sentiment: 'NEUTRAL', sector: 'AI' },
        { ticker: 'AMZN', name: 'Amazon', headline: 'Q3 revenue $143B, AWS revenue $23.1B (+12% YoY), operating income $11.2B beats by $3B.', impact: 'HIGH', sentiment: 'POSITIVE', sector: 'AI' },
        { ticker: 'TSLA', name: 'Tesla', headline: 'Q3 deliveries 435K, operating margin 7.6%. Energy storage deployments up 90% YoY.', impact: 'HIGH', sentiment: 'NEUTRAL', sector: 'AI' },
        { ticker: 'AAPL', name: 'Apple', headline: 'Q4 iPhone revenue $43.8B (-1% YoY), Services revenue $22.3B record high (+16% YoY).', impact: 'HIGH', sentiment: 'NEUTRAL', sector: 'Tech' },

        // Tech - MED impact
        { ticker: 'AMD', name: 'AMD', headline: 'Data Center revenue $2.3B (+21% QoQ), MI300 shipments ramping. Gaming segment weakness offset by enterprise.', impact: 'MED', sentiment: 'POSITIVE', sector: 'AI' },
        { ticker: 'PLTR', name: 'Palantir', headline: 'Q3 revenue $558M (+17% YoY), US commercial revenue +52%. Raised full-year guidance.', impact: 'MED', sentiment: 'POSITIVE', sector: 'AI' },
        { ticker: 'CRM', name: 'Salesforce', headline: 'Q3 revenue $8.7B (+11% YoY), remaining performance obligation $48B. Data Cloud growing rapidly.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Tech' },
        { ticker: 'SNOW', name: 'Snowflake', headline: 'Q3 product revenue $698M (+34% YoY), net revenue retention 135%. RPO growth concerns.', impact: 'MED', sentiment: 'NEUTRAL', sector: 'AI' },
        { ticker: 'INTC', name: 'Intel', headline: 'Q3 revenue $14.2B (+9% YoY), data center revenue down 10%. Foundry services gaining traction.', impact: 'MED', sentiment: 'NEGATIVE', sector: 'Tech' },
        { ticker: 'NFLX', name: 'Netflix', headline: 'Q3 revenue $8.5B (+8% YoY), paid memberships 247M. Ad-supported tier growing 70% QoQ.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Tech' },
        { ticker: 'ADBE', name: 'Adobe', headline: 'Q4 revenue $5.05B (+11% YoY), Digital Media ARR $14.9B. Firefly AI generating 3B+ images.', impact: 'MED', sentiment: 'POSITIVE', sector: 'AI' },

        // Financials
        { ticker: 'JPM', name: 'JPMorgan Chase', headline: 'Q3 revenue $40.7B (+22% YoY), net income $13.2B. NII guidance raised to $89B.', impact: 'HIGH', sentiment: 'POSITIVE', sector: 'Finance' },
        { ticker: 'BAC', name: 'Bank of America', headline: 'Q3 revenue $25.2B, net income $7.8B. Consumer banking strong despite rate headwinds.', impact: 'MED', sentiment: 'NEUTRAL', sector: 'Finance' },
        { ticker: 'GS', name: 'Goldman Sachs', headline: 'Q3 revenue $11.8B, trading revenue beats. Asset management AUM reaches $2.7T.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Finance' },
        { ticker: 'V', name: 'Visa', headline: 'Q4 revenue $8.6B (+11% YoY), payments volume +9%. Cross-border volume +16%.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Finance' },
        { ticker: 'MA', name: 'Mastercard', headline: 'Q3 revenue $6.5B (+14% YoY), operating margin 57%. Value-added services growing 18%.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Finance' },

        // Consumer
        { ticker: 'WMT', name: 'Walmart', headline: 'Q3 revenue $160B (+5% YoY), US comp sales +4.9%. E-commerce up 24%.', impact: 'HIGH', sentiment: 'POSITIVE', sector: 'Retail' },
        { ticker: 'COST', name: 'Costco', headline: 'Q1 revenue $57.8B (+6% YoY), membership renewal rate 93%. Same-store sales +3.8%.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Retail' },
        { ticker: 'HD', name: 'Home Depot', headline: 'Q3 revenue $37.7B (-3% YoY), comparable sales decline 3.5%. Pro segment outperforming.', impact: 'MED', sentiment: 'NEGATIVE', sector: 'Retail' },

        // Healthcare
        { ticker: 'UNH', name: 'UnitedHealth', headline: 'Q3 revenue $92.4B (+14% YoY), medical care ratio 82.3%. Optum revenue $56.3B.', impact: 'HIGH', sentiment: 'POSITIVE', sector: 'Healthcare' },
        { ticker: 'JNJ', name: 'Johnson & Johnson', headline: 'Q3 revenue $21.4B (+6.8% YoY), pharmaceutical sales $14.6B. Raised FY guidance.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Healthcare' },
        { ticker: 'PFE', name: 'Pfizer', headline: 'Q3 revenue $13.2B (-42% YoY ex-COVID), oncology revenue $3.4B. Cost cuts on track.', impact: 'MED', sentiment: 'NEGATIVE', sector: 'Healthcare' },

        // More tech
        { ticker: 'ORCL', name: 'Oracle', headline: 'Q2 revenue $12.9B (+9% YoY), Cloud infrastructure revenue +52%. Multi-cloud demand strong.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Tech' },
        { ticker: 'IBM', name: 'IBM', headline: 'Q3 revenue $14.8B (+4% YoY), software revenue $6.5B (+7%). Consulting flat.', impact: 'MED', sentiment: 'NEUTRAL', sector: 'Tech' },
        { ticker: 'CSCO', name: 'Cisco', headline: 'Q1 revenue $14.7B (-6% YoY), product orders flat. Security up 3%.', impact: 'MED', sentiment: 'NEUTRAL', sector: 'Tech' },
        { ticker: 'UBER', name: 'Uber', headline: 'Q3 revenue $9.3B (+11% YoY), gross bookings $35.3B. Delivery profitable at $1.3B segment EBITDA.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Tech' },
        { ticker: 'ABNB', name: 'Airbnb', headline: 'Q3 revenue $3.4B (+18% YoY), nights booked 113M. Free cash flow $1.1B.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Tech' },
        { ticker: 'COIN', name: 'Coinbase', headline: 'Q3 revenue $674M (-5% QoQ), transaction revenue $289M. Subscription revenue growing.', impact: 'MED', sentiment: 'NEUTRAL', sector: 'Crypto' },
        { ticker: 'SQ', name: 'Block', headline: 'Q3 revenue $5.6B (+24% YoY), Cash App gross profit $984M (+27%). Bitcoin revenue $3B.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Fintech' },
        { ticker: 'SHOP', name: 'Shopify', headline: 'Q3 revenue $1.7B (+25% YoY), GMV $56B (+22%). Operating income $122M vs loss YoY.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Tech' },
        { ticker: 'ZM', name: 'Zoom', headline: 'Q3 revenue $1.14B (+3% YoY), enterprise customers up 6%. AI Companion adoption growing.', impact: 'LOW', sentiment: 'NEUTRAL', sector: 'Tech' },
        { ticker: 'SPOT', name: 'Spotify', headline: 'Q3 MAU 574M (+26% YoY), premium subs 226M. Gross margin 26.4%, operating income €32M.', impact: 'MED', sentiment: 'POSITIVE', sector: 'Tech' },
    ];

    // Generate feed items with timing
    return companies.map((company, index) => {
        const minutesAgo = index * 7 + Math.floor(Math.random() * 5); // Spread out
        const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);

        const formatAgo = (mins: number) => {
            if (mins < 60) return `${mins}m`;
            if (mins < 1440) return `${(mins / 60).toFixed(1)}h`;
            return `${Math.floor(mins / 1440)}d`;
        };

        return {
            id: `feed-${company.ticker}-${index}`,
            ticker: company.ticker,
            companyName: company.name,
            headline: company.headline,
            time: timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            ago: formatAgo(minutesAgo),
            impact: company.impact as 'HIGH' | 'MED' | 'LOW',
            sentiment: company.sentiment as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
            summaryStatus: 'COMPLETE' as const,
            sector: company.sector,
            eventType: 'EARNINGS_RELEASE',
            links: [
                { label: '8-K', url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${company.ticker}&type=8-K&dateb=&owner=include&count=10` },
                { label: 'IR', url: getIRUrl(company.ticker) },
                ...(company.impact === 'HIGH' ? [{ label: 'WEBCAST', url: getIRUrl(company.ticker) }] : []),
            ],
        };
    });
}

function getIRUrl(ticker: string): string {
    const irUrls: Record<string, string> = {
        'NVDA': 'https://investor.nvidia.com/',
        'MSFT': 'https://www.microsoft.com/en-us/investor',
        'GOOGL': 'https://abc.xyz/investor/',
        'META': 'https://investor.fb.com/',
        'AMZN': 'https://ir.aboutamazon.com/',
        'TSLA': 'https://ir.tesla.com/',
        'AAPL': 'https://investor.apple.com/',
        'AMD': 'https://ir.amd.com/',
        'PLTR': 'https://investors.palantir.com/',
        'CRM': 'https://investor.salesforce.com/',
        'NFLX': 'https://ir.netflix.net/',
        'JPM': 'https://www.jpmorganchase.com/ir',
        'WMT': 'https://stock.walmart.com/',
        'V': 'https://investor.visa.com/',
    };
    return irUrls[ticker] || `https://www.google.com/search?q=${ticker}+investor+relations`;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all';
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        let feed = generateFeed();

        // Apply filters
        if (filter === 'high') {
            feed = feed.filter(f => f.impact === 'HIGH');
        } else if (filter === 'filings') {
            // All items are earnings releases (SEC filings)
            feed = feed.filter(f => f.eventType === 'EARNINGS_RELEASE');
        }

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
            source: 'seed',
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
