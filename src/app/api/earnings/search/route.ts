

import { NextRequest, NextResponse } from 'next/server';
import { searchTickers, getTotalVerifiedTickers } from '@/lib/earnings/real-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim();
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        if (!query || query.length < 1) {
            return NextResponse.json({ results: [], source: 'empty' });
        }

        // Use the centralized search function which covers REAL_COMPANIES and SP500_ADDITIONAL
        // This runs purely on local "free" data, no API key required
        const results = await searchTickers(query, limit);

        if (results.length === 0) {
            return NextResponse.json({
                results: [],
                query,
                message: 'No results found. Try a different ticker or company name.',
            });
        }

        // Format results to match the frontend expectations
        const formattedResults = results.map(r => ({
            ticker: r.ticker,
            name: r.name,
            sector: r.sector,
            exchange: 'US', // Default to US for this free dataset
            nextEarningsDate: null,
            earningsTime: null,
            confidence: 'UNKNOWN',
            isAI: r.sector === 'Technology',
            source: 'database'
        }));

        return NextResponse.json({
            results: formattedResults,
            query,
            count: results.length,
            totalAvailable: getTotalVerifiedTickers(),
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
