
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrrikijswrbfbbkhkftw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycmlraWpzd3JiZmJia2hrZnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQwNzQ1MiwiZXhwIjoyMDc5OTgzNDUyfQ.LIZtzsoBdz_ySld6TTUxm5qQv4L0zmzOdrLUxVBcigo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedSafe() {
    console.log('🌱 Seeding Data (SAFE MODE)...');

    // 1. Insert Companies (using only safe columns)
    const companies = [
        { ticker: 'NVDA', name: 'NVIDIA Corporation', is_ai: true, is_featured: true, featured_rank: 1, sector: 'Technology' },
        { ticker: 'MSFT', name: 'Microsoft Corporation', is_ai: true, is_featured: true, featured_rank: 2, sector: 'Technology' },
        { ticker: 'GOOGL', name: 'Alphabet Inc.', is_ai: true, is_featured: true, featured_rank: 3, sector: 'Technology' },
        { ticker: 'AMD', name: 'Advanced Micro Devices', is_ai: true, is_featured: true, featured_rank: 4, sector: 'Technology' },
        { ticker: 'META', name: 'Meta Platforms', is_ai: true, is_featured: true, featured_rank: 5, sector: 'Technology' },
        { ticker: 'TSLA', name: 'Tesla Inc.', is_ai: true, is_featured: true, featured_rank: 6, sector: 'Automotive' },
        { ticker: 'JPM', name: 'JPMorgan Chase', is_sp500: true, sector: 'Financial Services' },
        { ticker: 'V', name: 'Visa Inc.', is_sp500: true, sector: 'Financial Services' },
    ];

    for (const c of companies) {
        // Try full insert
        const { error } = await supabase.from('companies').upsert(c, { onConflict: 'ticker' });
        if (error && error.code === '42703') {
            // Fallback: Insert just ticker/name
            console.warn(`⚠️ Column mismatch for ${c.ticker}. Inserting minimal data.`);
            await supabase.from('companies').upsert({
                ticker: c.ticker,
                name: c.name
            }, { onConflict: 'ticker' });
        }
    }

    // 2. Next Earnings
    // Fetch existing IDs
    const { data: dbCompanies } = await supabase.from('companies').select('id, ticker');
    if (!dbCompanies) return;

    const now = new Date();
    for (const c of dbCompanies) {
        const { error } = await supabase.from('next_earnings').upsert({
            company_id: c.id,
            next_earnings_at: new Date(now.getTime() + 86400000 * 5).toISOString(), // 5 days
            earnings_time: 'AMC',
            confidence: 'ESTIMATED'
        }, { onConflict: 'company_id' });

        if (error) console.error(`Error adding earnings for ${c.ticker}:`, error.message);
    }

    console.log('✅ Seeding complete.');
}

seedSafe();
