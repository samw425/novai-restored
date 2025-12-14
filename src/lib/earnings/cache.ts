// Earnings Cache Layer - Supabase backed
// Caches FMP data to avoid API limits

import { supabaseAdmin } from '@/lib/supabase/admin';
import { fmpProvider } from './providers/fmp';
import {
    EarningsCalendarItem,
    CompanyEarningsDetails,
    EarningsConfidence,
    EarningsTime,
} from './types';

// Featured tickers get more frequent refresh
const FEATURED_TICKERS = [
    'NVDA', 'MSFT', 'GOOGL', 'META', 'AMZN', 'AAPL', 'TSLA', 'AMD',
    'PLTR', 'CRM', 'SNOW', 'AI', 'INTC', 'AVGO', 'ORCL', 'NOW'
];

// Refresh intervals
const FEATURED_REFRESH_MS = 60 * 60 * 1000; // 1 hour
const STANDARD_REFRESH_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedCompany {
    id: string;
    ticker: string;
    name: string;
    sector?: string;
    exchange?: string;
    is_ai: boolean;
    is_sp500: boolean;
    is_featured: boolean;
    updated_at: string;
}

interface CachedNextEarnings {
    company_id: string;
    next_earnings_at: string | null;
    earnings_time: EarningsTime;
    confidence: EarningsConfidence;
    source_url?: string;
    updated_at: string;
}

export class EarningsCache {

    /**
     * Get upcoming earnings calendar from cache, refresh if stale
     */
    async getCalendar(limit = 50, onlyFeatured = false): Promise<EarningsCalendarItem[]> {
        try {
            // Query cached data
            let query = supabaseAdmin
                .from('companies')
                .select(`
          id,
          ticker,
          name,
          sector,
          is_ai,
          is_sp500,
          is_featured,
          next_earnings:next_earnings(
            next_earnings_at,
            earnings_time,
            confidence,
            updated_at
          )
        `)
                .not('next_earnings.next_earnings_at', 'is', null)
                .gte('next_earnings.next_earnings_at', new Date().toISOString())
                .order('next_earnings(next_earnings_at)', { ascending: true })
                .limit(limit);

            if (onlyFeatured) {
                query = query.eq('is_featured', true);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Cache query error:', error);
                return this.fallbackToFMP(limit);
            }

            if (!data || data.length === 0) {
                console.log('Cache empty, fetching from FMP...');
                await this.refreshCalendar();
                return this.getCalendar(limit, onlyFeatured);
            }

            // Check if cache is stale for featured tickers
            const needsRefresh = this.checkStaleness(data as any[]);
            if (needsRefresh) {
                // Refresh in background, return current data
                this.refreshCalendar().catch(console.error);
            }

            return this.mapCachedToCalendar(data as any[]);

        } catch (err) {
            console.error('Cache error:', err);
            return this.fallbackToFMP(limit);
        }
    }

    /**
     * Get company details from cache or FMP
     */
    async getCompanyDetails(ticker: string): Promise<CompanyEarningsDetails | null> {
        try {
            const { data: company } = await supabaseAdmin
                .from('companies')
                .select(`
          *,
          next_earnings:next_earnings(*),
          summaries:earnings_summaries(
            quarter_label,
            eps_text,
            revenue_text,
            created_at
          )
        `)
                .eq('ticker', ticker.toUpperCase())
                .single();

            if (!company) {
                // Not in cache, fetch from FMP and cache it
                const details = await fmpProvider.getCompanyDetails(ticker);
                if (details) {
                    await this.cacheCompany(details);
                }
                return details;
            }

            // Check if stale
            const earnings = company.next_earnings;
            if (earnings && this.isStale(earnings.updated_at, company.is_featured)) {
                // Refresh in background
                this.refreshCompany(ticker).catch(console.error);
            }

            return this.mapCachedToDetails(company);

        } catch (err) {
            console.error('Company cache error:', err);
            return fmpProvider.getCompanyDetails(ticker);
        }
    }

    /**
     * Refresh calendar cache from FMP
     */
    async refreshCalendar(tickers?: string[]): Promise<number> {
        console.log('Refreshing earnings calendar from FMP...');

        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const items = await fmpProvider.getEarningsCalendar(today, futureDate, tickers);

        if (!items || items.length === 0) {
            console.warn('FMP returned no calendar items');
            return 0;
        }

        let updated = 0;

        for (const item of items) {
            try {
                // Upsert company
                const { data: company, error: companyError } = await supabaseAdmin
                    .from('companies')
                    .upsert({
                        ticker: item.ticker,
                        name: item.companyName,
                        is_featured: FEATURED_TICKERS.includes(item.ticker.toUpperCase()),
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: 'ticker',
                    })
                    .select('id')
                    .single();

                if (companyError || !company) {
                    console.error(`Error upserting company ${item.ticker}:`, companyError);
                    continue;
                }

                // Upsert next_earnings
                const { error: earningsError } = await supabaseAdmin
                    .from('next_earnings')
                    .upsert({
                        company_id: company.id,
                        next_earnings_at: item.date,
                        earnings_time: item.time,
                        confidence: item.confidence,
                        source_url: 'https://financialmodelingprep.com',
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: 'company_id',
                    });

                if (earningsError) {
                    console.error(`Error upserting earnings for ${item.ticker}:`, earningsError);
                    continue;
                }

                updated++;

            } catch (err) {
                console.error(`Error caching ${item.ticker}:`, err);
            }
        }

        console.log(`Cached ${updated} earnings records`);
        return updated;
    }

    /**
     * Refresh a single company
     */
    async refreshCompany(ticker: string): Promise<boolean> {
        const details = await fmpProvider.getCompanyDetails(ticker);
        if (!details) return false;

        await this.cacheCompany(details);
        return true;
    }

    // === Private Helpers ===

    private async cacheCompany(details: CompanyEarningsDetails): Promise<void> {
        // Upsert company
        const { data: company, error } = await supabaseAdmin
            .from('companies')
            .upsert({
                ticker: details.ticker,
                name: details.name,
                sector: details.sector,
                exchange: details.exchange,
                is_ai: details.isAI || false,
                is_sp500: details.isSP500 || false,
                is_featured: details.isFeatured || FEATURED_TICKERS.includes(details.ticker.toUpperCase()),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'ticker',
            })
            .select('id')
            .single();

        if (error || !company) {
            console.error('Error caching company:', error);
            return;
        }

        // Upsert next_earnings if available
        if (details.nextEarningsDate) {
            await supabaseAdmin
                .from('next_earnings')
                .upsert({
                    company_id: company.id,
                    next_earnings_at: details.nextEarningsDate,
                    earnings_time: details.nextEarningsTime || 'TBA',
                    confidence: details.confidence,
                    source_url: details.irUrl,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'company_id',
                });
        }
    }

    private checkStaleness(items: any[]): boolean {
        const now = Date.now();

        for (const item of items) {
            if (!item.next_earnings?.[0]?.updated_at) continue;

            const updatedAt = new Date(item.next_earnings[0].updated_at).getTime();
            const isFeatured = item.is_featured || FEATURED_TICKERS.includes(item.ticker);
            const maxAge = isFeatured ? FEATURED_REFRESH_MS : STANDARD_REFRESH_MS;

            if (now - updatedAt > maxAge) {
                return true;
            }
        }

        return false;
    }

    private isStale(updatedAt: string, isFeatured: boolean): boolean {
        const age = Date.now() - new Date(updatedAt).getTime();
        const maxAge = isFeatured ? FEATURED_REFRESH_MS : STANDARD_REFRESH_MS;
        return age > maxAge;
    }

    private mapCachedToCalendar(data: any[]): EarningsCalendarItem[] {
        return data
            .filter(item => item.next_earnings?.[0]?.next_earnings_at)
            .map(item => ({
                ticker: item.ticker,
                companyName: item.name,
                date: item.next_earnings[0].next_earnings_at,
                time: item.next_earnings[0].earnings_time || 'TBA',
                confidence: item.next_earnings[0].confidence || 'UNKNOWN',
            }));
    }

    private mapCachedToDetails(company: any): CompanyEarningsDetails {
        const earnings = company.next_earnings;

        return {
            ticker: company.ticker,
            name: company.name,
            sector: company.sector,
            exchange: company.exchange,
            isAI: company.is_ai,
            isSP500: company.is_sp500,
            isFeatured: company.is_featured,

            nextEarningsDate: earnings?.next_earnings_at,
            nextEarningsTime: earnings?.earnings_time || 'TBA',
            confidence: earnings?.confidence || 'UNKNOWN',

            irUrl: this.guessIRUrl(company.ticker),
            secUrl: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${company.ticker}&type=8-K`,
            webcastUrl: this.guessIRUrl(company.ticker),

            pastQuarters: company.summaries?.map((s: any) => ({
                quarter: s.quarter_label,
                date: s.created_at,
                epsEstimate: 0,
                epsActual: parseFloat(s.eps_text) || 0,
                beat: true, // TODO: calculate properly
            })) || [],
        };
    }

    private guessIRUrl(ticker: string): string {
        const known: Record<string, string> = {
            'NVDA': 'https://investor.nvidia.com/',
            'MSFT': 'https://www.microsoft.com/en-us/investor',
            'GOOGL': 'https://abc.xyz/investor/',
            'META': 'https://investor.fb.com/',
            'AMZN': 'https://ir.aboutamazon.com/',
            'AAPL': 'https://investor.apple.com/',
            'TSLA': 'https://ir.tesla.com/',
            'AMD': 'https://ir.amd.com/',
            'PLTR': 'https://investors.palantir.com/',
        };
        return known[ticker.toUpperCase()] || `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}`;
    }

    private async fallbackToFMP(limit: number): Promise<EarningsCalendarItem[]> {
        console.log('Using FMP directly (cache unavailable)');
        return fmpProvider.getEarningsCalendar();
    }
}

// Export singleton
export const earningsCache = new EarningsCache();
