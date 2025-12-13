const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rrrikijswrbfbbkhkftw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycmlraWpzd3JiZmJia2hrZnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQwNzQ1MiwiZXhwIjoyMDc5OTgzNDUyfQ.LIZtzsoBdz_ySld6TTUxm5qQv4L0zmzOdrLUxVBcigo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log("Testing connection...");
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(5);

    if (error) {
        console.error("ERROR:", error);
    } else {
        console.log("SUCCESS. Rows found:", data.length);
        console.log("Sample:", data[0]);
    }
}

testFetch();
