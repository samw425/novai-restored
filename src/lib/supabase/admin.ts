import { createClient } from '@supabase/supabase-js';

// Access Environment Variables directly (Server-Side Only)
// Fallback to validated keys if process.env is missing in the running context
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrrikijswrbfbbkhkftw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycmlraWpzd3JiZmJia2hrZnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQwNzQ1MiwiZXhwIjoyMDc5OTgzNDUyfQ.LIZtzsoBdz_ySld6TTUxm5qQv4L0zmzOdrLUxVBcigo';

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase Admin Keys missing. Check .env.local");
}

// Create a single supabase client for interacting with your database
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
