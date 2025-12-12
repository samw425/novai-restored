import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
export const runtime = 'edge';


export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Just return success - ranking is not yet implemented
        return NextResponse.json({
            message: 'Ranking endpoint - not yet implemented',
            success: true
        });

    } catch (error: any) {
        console.error('Ranking Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
