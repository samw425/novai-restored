// ============================================================================
// SEC EDGAR REAL-TIME WATCHER
// Polls SEC 8-K RSS feed every 60 seconds for earnings releases
// ============================================================================

import Parser from 'rss-parser';
import { getCompanyInfo, getTotalVerifiedTickers } from './real-data';
import { REAL_COMPANIES } from './real-data';
import { SP500_ADDITIONAL } from './sp500-data';

// SEC RSS Feed - 8-K filings (earnings releases are filed as 8-K)
const SEC_8K_FEED = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&count=100&output=atom';

// In-memory store for recent SEC filings
let recentFilings: SECFiling[] = [];
let lastFetchTime: Date | null = null;

export interface SECFiling {
    id: string;
    ticker: string;
    companyName: string;
    title: string;
    link: string;
    pubDate: Date;
    agoMs: number;
    formType: string;
    impact: 'HIGH' | 'MED' | 'LOW';
    isEarnings: boolean;
}

// All our verified tickers
const ALL_TICKERS = new Set([
    ...Object.keys(REAL_COMPANIES),
    ...Object.keys(SP500_ADDITIONAL)
]);

/**
 * Parse SEC RSS feed and extract 8-K filings for our tracked companies
 */
export async function fetchSECFilings(): Promise<SECFiling[]> {
    const parser = new Parser({
        customFields: {
            item: [
                ['updated', 'updated'],
                ['link', 'link', { keepArray: false }],
            ]
        }
    });

    try {
        console.log('[SEC] Fetching 8-K filings from SEC EDGAR...');
        const feed = await parser.parseURL(SEC_8K_FEED);
        const now = new Date();

        const filings: SECFiling[] = [];

        for (const item of feed.items || []) {
            // Extract ticker from title
            // SEC titles look like: "8-K - NVIDIA CORP (0001045810) (Filer)"
            // or "8-K - Apple Inc. (AAPL)"
            const title = item.title || '';

            // Try to extract ticker from parentheses
            let ticker: string | null = null;

            // Pattern 1: Company name followed by (TICKER)
            const tickerMatch = title.match(/\(([A-Z]{1,5})\)(?:\s|$)/);
            if (tickerMatch) {
                ticker = tickerMatch[1];
            }

            // Pattern 2: Match against known company names
            if (!ticker) {
                const upperTitle = title.toUpperCase();
                for (const t of ALL_TICKERS) {
                    const info = getCompanyInfo(t);
                    if (info.found && upperTitle.includes(info.name.toUpperCase().split(' ')[0])) {
                        ticker = t;
                        break;
                    }
                }
            }

            // Skip if we can't identify the ticker or it's not in our list
            if (!ticker || !ALL_TICKERS.has(ticker)) continue;

            const info = getCompanyInfo(ticker);
            const pubDate = item.pubDate ? new Date(item.pubDate) : now;
            const agoMs = now.getTime() - pubDate.getTime();

            // Determine if this 8-K is likely earnings related
            // 8-K Item 2.02 = Results of Operations (earnings)
            const isEarnings = title.includes('2.02') ||
                title.toLowerCase().includes('earnings') ||
                title.toLowerCase().includes('financial results') ||
                title.toLowerCase().includes('quarterly');

            // HIGH impact for mega-cap AI/Tech
            const highImpact = ['NVDA', 'MSFT', 'AAPL', 'GOOGL', 'GOOG', 'META', 'AMZN', 'TSLA', 'AMD', 'PLTR'];
            const impact = highImpact.includes(ticker) ? 'HIGH' :
                (info.sector === 'Technology' ? 'MED' : 'LOW');

            filings.push({
                id: `sec-${ticker}-${pubDate.getTime()}`,
                ticker,
                companyName: info.name,
                title: title.replace(/8-K\s*-\s*/, '').trim(),
                link: typeof item.link === 'string' ? item.link : (item.link as any)?.href || '',
                pubDate,
                agoMs,
                formType: '8-K',
                impact,
                isEarnings
            });
        }

        // Sort by most recent first
        filings.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

        // Update cache
        recentFilings = filings;
        lastFetchTime = now;

        console.log(`[SEC] Found ${filings.length} filings from tracked companies`);
        return filings;

    } catch (error) {
        console.error('[SEC] Error fetching SEC feed:', error);
        return recentFilings; // Return cached data on error
    }
}

/**
 * Get cached filings (fetch if stale)
 */
export async function getSECFilings(forceRefresh: boolean = false): Promise<SECFiling[]> {
    const now = new Date();
    const staleness = lastFetchTime ? now.getTime() - lastFetchTime.getTime() : Infinity;

    // Refresh if cache is older than 60 seconds or forced
    if (forceRefresh || staleness > 60000) {
        return fetchSECFilings();
    }

    return recentFilings;
}

/**
 * Get the last fetch timestamp
 */
export function getLastFetchTime(): Date | null {
    return lastFetchTime;
}

/**
 * Format milliseconds to human-readable "ago" string
 */
export function formatAgo(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
}
