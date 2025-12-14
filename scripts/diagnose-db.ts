
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrrikijswrbfbbkhkftw.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycmlraWpzd3JiZmJia2hrZnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQwNzQ1MiwiZXhwIjoyMDc5OTgzNDUyfQ.LIZtzsoBdz_ySld6TTUxm5qQv4L0zmzOdrLUxVBcigo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
    console.log('--- DIAGNOSTIC START ---');
    console.log('Checking connection to:', supabaseUrl);

    // 1. Check Companies Table
    console.log('\n1. Checking "companies" table...');
    const { data: companies, error: companiesError } = await supabase.from('companies').select('count', { count: 'exact', head: true });

    if (companiesError) {
        console.error('❌ FAILED to query companies table:', companiesError.message);
        console.error('   Details:', companiesError.details);
        if (companiesError.code === '42P01') console.log('   -> Table does not exist.');
    } else {
        console.log('✅ "companies" table exists.');
        console.log(`   Row count: ${companies}`);
    }

    // 2. Check Next Earnings Table
    console.log('\n2. Checking "next_earnings" table...');
    const { data: nextEarnings, error: nextError } = await supabase.from('next_earnings').select('count', { count: 'exact', head: true });

    if (nextError) {
        console.error('❌ FAILED to query next_earnings table:', nextError.message);
        if (nextError.code === '42P01') console.log('   -> Table does not exist.');
    } else {
        console.log('✅ "next_earnings" table exists.');
        console.log(`   Row count: ${nextEarnings}`);

        // Check Relation
        console.log('   Checking relation (companies -> next_earnings)...');
        const { error: relError } = await supabase.from('companies').select('id, next_earnings(next_earnings_at)').limit(1);
        if (relError) {
            console.error('❌ Relation check FAILED:', relError.message);
            console.log('   -> Schema relationship missing. PostgREST cache might be stale or Foreign Key missing.');
        } else {
            console.log('✅ Relation check PASSED.');
        }
    }

    // 3. Check Ingestion Log
    console.log('\n3. Checking "earnings_ingestion_log" table...');
    const { data: logs, error: logsError } = await supabase.from('earnings_ingestion_log').select('count', { count: 'exact', head: true });

    if (logsError) {
        console.error('❌ FAILED to query earnings_ingestion_log:', logsError.message);
    } else {
        console.log('✅ "earnings_ingestion_log" table exists.');
        console.log(`   Row count: ${logs}`);
    }

    console.log('\n--- DIAGNOSTIC END ---');
}

diagnose();
