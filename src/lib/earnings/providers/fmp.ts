// Financial Modeling Prep (FMP) Provider Implementation
// Free tier: https://financialmodelingprep.com/

import {
    CalendarProvider,
    EarningsCalendarItem,
    CompanyEarningsDetails,
    QuarterResult,
    EarningsConfidence,
    EarningsTime,
} from '../types';

const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Get API key from environment
const getApiKey = () => {
    const key = process.env.FMP_API_KEY;
    if (!key) {
        console.warn('FMP_API_KEY not set, using demo key (limited)');
        return 'demo'; // FMP allows 'demo' for testing with limits
    }
    return key;
};

// Map FMP time codes to our standard
const mapEarningsTime = (time: string | null): EarningsTime => {
    if (!time) return 'TBA';
    const t = time.toLowerCase();
    if (t.includes('bmo') || t.includes('before')) return 'BMO';
    if (t.includes('amc') || t.includes('after')) return 'AMC';
    if (t.includes('dmh') || t.includes('during')) return 'DMH';
    return 'TBA';
};

// Determine confidence based on data quality
const determineConfidence = (item: any): EarningsConfidence => {
    if (item.date && item.time && item.time !== 'TBA') {
        return 'CONFIRMED';
    }
    if (item.date) {
        return 'ESTIMATED';
    }
    return 'UNKNOWN';
};

export class FMPProvider implements CalendarProvider {
    name = 'Financial Modeling Prep';

    private async fetchJSON(endpoint: string): Promise<any> {
        const apiKey = getApiKey();
        const url = `${FMP_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${apiKey}`;

        try {
            const response = await fetch(url, {
                next: { revalidate: 3600 } // Cache for 1 hour at edge
            });

            if (!response.ok) {
                console.error(`FMP API error: ${response.status} ${response.statusText}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('FMP fetch error:', error);
            return null;
        }
    }

    async getEarningsCalendar(
        startDate?: string,
        endDate?: string,
        tickers?: string[]
    ): Promise<EarningsCalendarItem[]> {
        // Default to next 30 days
        const start = startDate || new Date().toISOString().split('T')[0];
        const end = endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const data = await this.fetchJSON(`/earning_calendar?from=${start}&to=${end}`);

        if (!data || !Array.isArray(data)) {
            console.warn('FMP returned no calendar data');
            return [];
        }

        let items: EarningsCalendarItem[] = data.map((item: any) => ({
            ticker: item.symbol,
            companyName: item.companyName || item.symbol,
            date: item.date,
            time: mapEarningsTime(item.time),
            confidence: determineConfidence(item),
            epsEstimate: item.eps || item.epsEstimated,
            revenueEstimate: item.revenue || item.revenueEstimated,
            fiscalQuarter: item.fiscalQuarter,
            fiscalYear: item.fiscalYear,
        }));

        // Filter by tickers if provided
        if (tickers && tickers.length > 0) {
            const tickerSet = new Set(tickers.map(t => t.toUpperCase()));
            items = items.filter(item => tickerSet.has(item.ticker.toUpperCase()));
        }

        // Sort by date
        items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return items;
    }

    async getCompanyDetails(ticker: string): Promise<CompanyEarningsDetails | null> {
        // Fetch company profile
        const profile = await this.fetchJSON(`/profile/${ticker}`);

        if (!profile || !Array.isArray(profile) || profile.length === 0) {
            return null;
        }

        const company = profile[0];

        // Fetch upcoming earnings for this ticker
        const today = new Date().toISOString().split('T')[0];
        const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const calendar = await this.getEarningsCalendar(today, future, [ticker]);

        const nextEarnings = calendar.length > 0 ? calendar[0] : null;

        // Fetch earnings history
        const history = await this.getEarningsHistory(ticker, 4);

        // Build IR URL (common patterns)
        const irUrl = this.guessIRUrl(ticker, company.website);

        return {
            ticker: company.symbol,
            name: company.companyName,
            sector: company.sector,
            exchange: company.exchangeShortName,
            marketCap: company.mktCap,
            isAI: this.isAICompany(company.sector, company.industry),
            isSP500: company.isEtf === false && company.mktCap > 10_000_000_000, // Rough check
            isFeatured: this.isFeaturedTicker(ticker),

            nextEarningsDate: nextEarnings?.date,
            nextEarningsTime: nextEarnings?.time || 'TBA',
            confidence: nextEarnings?.confidence || 'UNKNOWN',

            epsEstimate: nextEarnings?.epsEstimate ? `$${nextEarnings.epsEstimate.toFixed(2)}` : undefined,
            revenueEstimate: nextEarnings?.revenueEstimate
                ? this.formatRevenue(nextEarnings.revenueEstimate)
                : undefined,

            irUrl,
            secUrl: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=8-K&dateb=&owner=include&count=40`,
            webcastUrl: irUrl, // Usually same as IR page

            pastQuarters: history,
        };
    }

    async getEarningsHistory(ticker: string, limit = 8): Promise<QuarterResult[]> {
        const data = await this.fetchJSON(`/historical/earning_calendar/${ticker}?limit=${limit}`);

        if (!data || !Array.isArray(data)) {
            return [];
        }

        return data.map((item: any) => ({
            quarter: `Q${item.fiscalQuarter || '?'} '${String(item.fiscalYear).slice(-2)}`,
            date: item.date,
            epsEstimate: item.epsEstimated || 0,
            epsActual: item.eps || 0,
            beat: (item.eps || 0) > (item.epsEstimated || 0),
            revenueEstimate: item.revenueEstimated,
            revenueActual: item.revenue,
        }));
    }

    // Helper: Check if company is AI-related
    private isAICompany(sector?: string, industry?: string): boolean {
        const aiKeywords = ['semiconductor', 'software', 'cloud', 'artificial intelligence', 'machine learning', 'technology'];
        const combined = `${sector || ''} ${industry || ''}`.toLowerCase();
        return aiKeywords.some(kw => combined.includes(kw));
    }

    // Helper: Check if ticker is in our featured list
    private isFeaturedTicker(ticker: string): boolean {
        const featured = ['NVDA', 'MSFT', 'GOOGL', 'META', 'AMZN', 'AAPL', 'TSLA', 'AMD', 'PLTR', 'CRM', 'SNOW', 'AI'];
        return featured.includes(ticker.toUpperCase());
    }

    // Helper: Guess IR URL based on common patterns
    private guessIRUrl(ticker: string, website?: string): string {
        const irPatterns: Record<string, string> = {
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
        };

        if (irPatterns[ticker.toUpperCase()]) {
            return irPatterns[ticker.toUpperCase()];
        }

        // Fallback: guess from website
        if (website) {
            const domain = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
            return `https://investor.${domain}/`;
        }

        return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=&dateb=&owner=include&count=40`;
    }

    // Helper: Format large revenue numbers
    private formatRevenue(value: number): string {
        if (value >= 1_000_000_000) {
            return `$${(value / 1_000_000_000).toFixed(1)}B`;
        }
        if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(0)}M`;
        }
        return `$${value.toLocaleString()}`;
    }
}

// Export singleton instance
export const fmpProvider = new FMPProvider();
