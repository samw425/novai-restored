// API Route: /api/earnings/refresh
// Manually trigger calendar refresh from FMP

import { NextRequest, NextResponse } from 'next/server';
import { earningsCache } from '@/lib/earnings/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        // Log ingestion start
        const { data: log } = await supabaseAdmin
            .from('earnings_ingestion_log')
            .insert({
                ingestion_type: 'ALL',
                started_at: new Date().toISOString(),
                status: 'RUNNING',
            })
            .select('id')
            .single();

        const logId = log?.id;

        // Refresh calendar from FMP
        const updated = await earningsCache.refreshCalendar();

        // Update log
        if (logId) {
            await supabaseAdmin
                .from('earnings_ingestion_log')
                .update({
                    completed_at: new Date().toISOString(),
                    items_processed: updated,
                    items_new: updated, // For now, all are new/updated
                    status: 'COMPLETE',
                })
                .eq('id', logId);
        }

        return NextResponse.json({
            success: true,
            message: `Refreshed ${updated} earnings records`,
            count: updated,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Refresh error:', error);
        return NextResponse.json(
            { error: error.message || 'Refresh failed' },
            { status: 500 }
        );
    }
}

// GET for simple trigger (e.g., from cron)
export async function GET(request: NextRequest) {
    return POST(request);
}
