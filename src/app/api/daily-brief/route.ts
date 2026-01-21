import { NextResponse } from 'next/server';
import { generateDailyBrief, calculateSignalScore } from '@/lib/synthesis';
import type { Article } from '@/types';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/daily-brief
 * Returns the AI-synthesized Daily Intelligence Brief for the Global Feed.
 * This is an ADDITIVE endpoint - does not modify any existing APIs.
 */
export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Fetch latest articles from existing feed API
        const feedRes = await fetch(`${baseUrl}/api/feed/live?category=All&limit=20`, {
            cache: 'no-store'
        });

        if (!feedRes.ok) {
            throw new Error('Failed to fetch feed data');
        }

        const feedData = await feedRes.json();
        const articles: Article[] = feedData.articles || [];

        if (articles.length === 0) {
            return NextResponse.json({
                brief: null,
                error: 'No articles available'
            });
        }

        // Generate the daily brief using our synthesis engine
        const brief = await generateDailyBrief(articles);

        return NextResponse.json({
            brief,
            generatedAt: new Date().toISOString()
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
            }
        });

    } catch (error: any) {
        console.error('[API/daily-brief] Error:', error);

        // Return graceful fallback
        return NextResponse.json({
            brief: {
                date: new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }),
                headline: 'Intelligence Brief Loading...',
                briefingItems: [],
                overallSentiment: 'Neutral',
                statOfTheDay: { value: '109+', label: 'Sources Monitored' }
            },
            error: error.message
        });
    }
}
