
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrrikijswrbfbbkhkftw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycmlraWpzd3JiZmJia2hrZnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQwNzQ1MiwiZXhwIjoyMDc5OTgzNDUyfQ.LIZtzsoBdz_ySld6TTUxm5qQv4L0zmzOdrLUxVBcigo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    console.log('🚀 Starting Fix & Seed Script...');

    // 1. Fix Schema (Tables & Columns)
    console.log('🔧 Fixing Companies Schema...');
    // We can't easily run DDL via JS client without a stored procedure, 
    // BUT we can use the `rpc` if we had one, OR we just trust the user ran the SQL.
    // HOWEVER, the user is having trouble. 
    // We will assume the companies table EXISTS (basic) but might miss columns.
    // Since we can't run ALTER TABLE via supabase-js client directly (unless we use the REST API to call a function),
    // We will try to rely on the previously provided SQL. 
    // wait! I can't run DDL from here. 
    // I MUST rely on the user running the SQL in the dashboard for purely structural changes if they don't exist.
    // BUT I can try to insert data and if it fails, I'll know why.

    // Actually, I can use the 'rpc' hack if there's a function, but I don't have one.
    // I will focus on SEEDING. If seeding fails on "column not found", I will fail loudly.

    // 2. Clear existing data to be clean (optional, maybe dangerous? keeping it safe with upserts)

    const companies = [
        { ticker: 'NVDA', name: 'NVIDIA Corporation', is_ai: true, is_featured: true, featured_rank: 1, sector: 'Technology' },
        { ticker: 'MSFT', name: 'Microsoft Corporation', is_ai: true, is_featured: true, featured_rank: 2, sector: 'Technology' },
        { ticker: 'GOOGL', name: 'Alphabet Inc.', is_ai: true, is_featured: true, featured_rank: 3, sector: 'Technology' },
        { ticker: 'AMD', name: 'Advanced Micro Devices', is_ai: true, is_featured: true, featured_rank: 4, sector: 'Technology' },
        { ticker: 'TSM', name: 'Taiwan Semiconductor', is_ai: true, is_featured: true, featured_rank: 5, sector: 'Technology' },
        { ticker: 'AVGO', name: 'Broadcom Inc.', is_ai: true, is_featured: true, featured_rank: 6, sector: 'Technology' },
        { ticker: 'META', name: 'Meta Platforms', is_ai: true, is_featured: true, featured_rank: 7, sector: 'Technology' },
        { ticker: 'AMZN', name: 'Amazon.com Inc.', is_ai: true, is_featured: true, featured_rank: 8, sector: 'Consumer Cyclical' },
        { ticker: 'TSLA', name: 'Tesla Inc.', is_ai: true, is_featured: true, featured_rank: 9, sector: 'Automotive' },
        { ticker: 'AAPL', name: 'Apple Inc.', is_ai: true, is_featured: true, featured_rank: 10, sector: 'Technology' }
    ];

    console.log('🌱 Upserting Companies...');
    for (const c of companies) {
        const { data, error } = await supabase
            .from('companies')
            .upsert(c, { onConflict: 'ticker' })
            .select()
            .single();
        if (error) {
            console.error(`❌ Failed to upsert ${c.ticker}:`, error.message);
            if (error.message.includes('column')) {
                console.error('   !!! CRITICAL: You MUST run the SQL Schema fix in Supabase Dashboard !!!');
                process.exit(1);
            }
        } else {
            // console.log(`   OK: ${c.ticker}`);
        }
    }

    // 3. Seed Next Earnings
    console.log('📅 Seeding Next Earnings...');
    // Get IDs
    const { data: dbCompanies } = await supabase.from('companies').select('id, ticker');
    if (!dbCompanies) return;

    const now = new Date();

    for (const c of dbCompanies) {
        let days = Math.floor(Math.random() * 20); // 0-20 days away
        if (c.ticker === 'NVDA') days = 5;
        if (c.ticker === 'AMD') days = 2; // Market moving

        const nextDate = new Date(now);
        nextDate.setDate(nextDate.getDate() + days);

        const { error } = await supabase.from('next_earnings').upsert({
            company_id: c.id,
            next_earnings_at: nextDate.toISOString(),
            earnings_time: days % 2 === 0 ? 'AMC' : 'BMO',
            confidence: c.ticker === 'NVDA' ? 'CONFIRMED' : 'ESTIMATED'
        }, { onConflict: 'company_id' });

        if (error) console.error(`❌ Next Earnings error for ${c.ticker}:`, error.message);
    }

    // 4. Seed Summaries (History)
    console.log('📝 Seeding Summaries...');
    for (const c of dbCompanies) {
        // Create a dummy previous earnings
        const prevDate = new Date(now);
        prevDate.setMonth(prevDate.getMonth() - 3);

        const { error } = await supabase.from('earnings_summaries').insert({
            company_id: c.id,
            quarter_label: 'Q3 2025',
            highlights: [
                'Revenue beat expectations by 15%',
                'Guidance raised for Q4 due to strong AI demand',
                'Gross margins improved to 75%'
            ],
            summary_text: `${c.ticker} reported strong Q3 results driven by accelerating demand for AI infrastructure. Revenue grew 200% YoY.`,
            status: 'COMPLETE',
            created_at: prevDate.toISOString()
        });
        // Ignore error if it duplicates or whatever, this is a append log usually
        if (error) console.error(`❌ Summary error for ${c.ticker}:`, error.message);
    }

    // 5. Seed Ingestion Log
    console.log('⏱ Updating Ingestion Log...');
    const { error: logError } = await supabase.from('earnings_ingestion_log').insert({
        ingestion_type: 'FEATURED',
        started_at: new Date().toISOString(),
        status: 'COMPLETE',
        items_processed: 10,
        items_new: 0
    });
    if (logError) console.error('❌ Log error:', logError.message);

    console.log('✅ Script Complete. Data should be ready.');
}

run();
