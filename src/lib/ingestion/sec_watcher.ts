
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

// SEC RSS Feed definitions
const SEC_FEEDS = {
    ALL: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&count=100&output=atom',
    // We filter this "Firehose" for our specific tickers
};

export class SECEarningsWatcher {
    private parser: Parser;
    private supabase: any;

    constructor() {
        this.parser = new Parser();
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }

    async checkFeed() {
        console.log("Checking SEC Feed...");
        // 1. Fetch RSS
        const feed = await this.parser.parseURL(SEC_FEEDS.ALL);

        // 2. Filter for our Watchlist (NVDA, MSFT, etc)
        const relevantItems = feed.items.filter(item => this.isRelevant(item));

        // 3. Insert into Supabase
        if (relevantItems.length > 0) {
            await this.processItems(relevantItems);
        }
    }

    private isRelevant(item: any): boolean {
        // Logic to match Ticker symbols in title
        // e.g. "8-K: CURRENT REPORT - NVIDIA CORP"
        return true; // placeholder
    }

    private async processItems(items: any[]) {
        console.log(`Processing ${items.length} new SEC filings...`);

        for (const item of items) {
            // 1. Extract Ticker (Naive regex for now, e.g. "NVIDIA CORP (NVDA)")
            const title = item.title || "";
            const tickerMatch = title.match(/\(([A-Z]+)\)/);
            const ticker = tickerMatch ? tickerMatch[1] : null;

            if (!ticker) continue;

            // 2. Find Company ID
            const { data: company } = await this.supabase
                .from('companies')
                .select('id')
                .eq('ticker', ticker)
                .single();

            if (!company) continue;

            // 3. Insert Event (8-K or 10-Q)
            const { error } = await this.supabase
                .from('earnings_events')
                .insert({
                    company_id: company.id,
                    event_type: 'SEC_FILING',
                    earnings_at: new Date(item.pubDate), // Use pubDate from RSS
                    source_urls: [{ url: item.link, title: item.title }]
                });

            if (error) console.error(`Error saving event for ${ticker}:`, error);
            else console.log(`Saved event for ${ticker}`);
        }
    }
}
