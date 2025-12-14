// Earnings Hub Types

export type EarningsConfidence = 'CONFIRMED' | 'ESTIMATED' | 'UNKNOWN';
export type EarningsTime = 'BMO' | 'AMC' | 'DMH' | 'TBA'; // Before Market Open, After Market Close, During Market Hours

export interface EarningsCalendarItem {
    ticker: string;
    companyName: string;
    date: string; // ISO date string
    time: EarningsTime;
    confidence: EarningsConfidence;
    epsEstimate?: number;
    revenueEstimate?: number;
    fiscalQuarter?: string;
    fiscalYear?: number;
}

export interface CompanyEarningsDetails {
    ticker: string;
    name: string;
    sector?: string;
    exchange?: string;
    marketCap?: number;
    isAI?: boolean;
    isSP500?: boolean;
    isFeatured?: boolean;

    // Next earnings
    nextEarningsDate?: string;
    nextEarningsTime?: EarningsTime;
    confidence: EarningsConfidence;

    // Estimates
    epsEstimate?: string;
    revenueEstimate?: string;
    impliedMove?: string;

    // Links
    irUrl?: string;
    secUrl?: string;
    webcastUrl?: string;

    // History
    pastQuarters?: QuarterResult[];
}

export interface QuarterResult {
    quarter: string;
    date: string;
    epsEstimate: number;
    epsActual: number;
    beat: boolean;
    revenueEstimate?: number;
    revenueActual?: number;
}

export interface EarningsEvent {
    id: string;
    ticker: string;
    companyName: string;
    eventType: 'EARNINGS_RELEASE' | 'EARNINGS_CALL' | 'SEC_FILING';
    headline: string;
    timestamp: string;
    ago: string;
    impact: 'HIGH' | 'MED' | 'LOW';
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    summaryStatus: 'GENERATING' | 'COMPLETE';
    summaryText?: string;
    links: { label: string; url: string }[];
}

// Provider interface for pluggable architecture
export interface CalendarProvider {
    name: string;

    /**
     * Fetch upcoming earnings calendar
     * @param startDate ISO date string (default: today)
     * @param endDate ISO date string (default: +30 days)
     * @param tickers Optional filter for specific tickers
     */
    getEarningsCalendar(
        startDate?: string,
        endDate?: string,
        tickers?: string[]
    ): Promise<EarningsCalendarItem[]>;

    /**
     * Fetch detailed company earnings info
     */
    getCompanyDetails(ticker: string): Promise<CompanyEarningsDetails | null>;

    /**
     * Fetch historical earnings for a company
     */
    getEarningsHistory(ticker: string, limit?: number): Promise<QuarterResult[]>;
}
