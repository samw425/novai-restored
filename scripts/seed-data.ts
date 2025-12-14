
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrrikijswrbfbbkhkftw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycmlraWpzd3JiZmJia2hrZnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQwNzQ1MiwiZXhwIjoyMDc5OTgzNDUyfQ.LIZtzsoBdz_ySld6TTUxm5qQv4L0zmzOdrLUxVBcigo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const featuredCompanies = [
    { ticker: 'NVDA', name: 'NVIDIA Corporation', is_ai: true, is_featured: true, featured_rank: 1, sector: 'Technology' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', is_ai: true, is_featured: true, featured_rank: 2, sector: 'Technology' },
    { ticker: 'GOOGL', 'name': 'Alphabet Inc.', is_ai: true, is_featured: true, featured_rank: 3, sector: 'Technology' },
    { ticker: 'AMD', name: 'Advanced Micro Devices', is_ai: true, is_featured: true, featured_rank: 4, sector: 'Technology' },
    { ticker: 'TSM', name: 'Taiwan Semiconductor', is_ai: true, is_featured: true, featured_rank: 5, sector: 'Technology' },
    { ticker: 'AVGO', name: 'Broadcom Inc.', is_ai: true, is_featured: true, featured_rank: 6, sector: 'Technology' },
    { ticker: 'META', name: 'Meta Platforms', is_ai: true, is_featured: true, featured_rank: 7, sector: 'Technology' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', is_ai: true, is_featured: true, featured_rank: 8, sector: 'Consumer Cyclical' },
    { ticker: 'ORCL', name: 'Oracle Corporation', is_ai: true, is_featured: true, featured_rank: 9, sector: 'Technology' },
    { ticker: 'PLTR', name: 'Palantir Technologies', is_ai: true, is_featured: true, featured_rank: 10, sector: 'Technology' },
];

const sp500Companies = [
    { ticker: 'JPM', name: 'JPMorgan Chase', is_sp500: true, sector: 'Financial Services' },
    { ticker: 'V', name: 'Visa Inc.', is_sp500: true, sector: 'Financial Services' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', is_sp500: true, sector: 'Healthcare' },
    { ticker: 'WMT', name: 'Walmart Inc.', is_sp500: true, sector: 'Consumer Defensive' },
];

async function seed() {
    console.log('🌱 Seeding data...');

    // 1. Insert Companies
    const allCompanies = [...featuredCompanies, ...sp500Companies];

    for (const c of allCompanies) {
        const { data, error } = await supabase
            .from('companies')
            .upsert(c, { onConflict: 'ticker' })
            .select()
            .single();

        if (error) {
            console.error(`Error inserting ${c.ticker}:`, error.message);
        } else {
            console.log(`Inserted/Updated ${c.ticker}`);
        }
    }

    // 2. Insert Next Earnings (with some fake future dates for demo)
    console.log('📅 Seeding next_earnings...');

    const { data: companies } = await supabase.from('companies').select('id, ticker, is_featured');

    if (!companies) return;

    const now = new Date();

    for (const c of companies) {
        let nextDate = null;
        let daysToAdd = 0;

        // Give featured companies upcoming earnings
        if (c.ticker === 'NVDA') daysToAdd = 5;
        if (c.ticker === 'MSFT') daysToAdd = 12;
        if (c.ticker === 'GOOGL') daysToAdd = 18;
        if (c.ticker === 'AMD') daysToAdd = 3; // "Market Moving" (< 14 days)

        if (daysToAdd > 0) {
            const d = new Date(now);
            d.setDate(d.getDate() + daysToAdd);
            nextDate = d.toISOString();
        } else if (c.is_featured) {
            // Some distant future
            const d = new Date(now);
            d.setDate(d.getDate() + 45);
            nextDate = d.toISOString();
        }

        if (nextDate) {
            const { error } = await supabase.from('next_earnings').upsert({
                company_id: c.id,
                next_earnings_at: nextDate,
                earnings_time: 'AMC',
                confidence: 'ESTIMATED'
            }, { onConflict: 'company_id' });

            if (error) console.error(`Error giving earnings to ${c.ticker}:`, error.message);
            else console.log(`Scheduled earnings for ${c.ticker} at ${nextDate}`);
        }
    }

    console.log('✅ Seeding complete.');
}

seed();
