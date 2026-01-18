/**
 * CHRONOS PAGES FUNCTIONS - API HANDLER
 * 
 * Routes: chronos.pages.dev/api/*
 * Nuclear Restoration Version: Robust handling of all data types.
 */

import type { Env, GlobalState } from '../../src/lib/types';
import { seedHistoricalBackbone } from '../../src/lib/seeder';

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        if (path === '/api/nebula') return await handleNebula(env, corsHeaders);
        if (path === '/api/state') return await handleState(env, corsHeaders);
        if (path.startsWith('/api/rhyme/')) return await handleRhyme(env, path.split('/').pop()!, corsHeaders);

        if (path === '/api/seed' && request.method === 'POST') {
            await seedHistoricalBackbone(env);
            return new Response(JSON.stringify({ success: true, message: 'Chronicle Seeded' }), { headers: corsHeaders });
        }

        return new Response(JSON.stringify({ error: 'Chronos Error: Path Dissolved' }), { status: 404, headers: corsHeaders });
    } catch (error: any) {
        console.error('[CHRONOS FUNCTIONS] Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Temporal Error', details: error.message }), { status: 500, headers: corsHeaders });
    }
};

async function handleNebula(env: Env, headers: Record<string, string>) {
    // 1. Fetch Data
    const nodesRes = await env.DB.prepare(`SELECT * FROM Chronicle_Events ORDER BY timestamp DESC LIMIT 500`).all();
    const edgesRes = await env.DB.prepare(`SELECT * FROM History_Rhymes WHERE strength >= 0.8 ORDER BY strength DESC LIMIT 100`).all();
    const stateRes = await env.DB.prepare(`SELECT * FROM Global_State ORDER BY updated_at DESC LIMIT 1`).all();

    // 2. Map Nodes (Defensive)
    const nodes = (nodesRes.results || []).map((row: any) => ({
        id: String(row.event_id),
        title: String(row.title),
        category: row.category,
        intensity: Number(row.intensity_score) || 0.5,
        timestamp: Number(row.timestamp) || Date.now(),
        synthesis: String(row.content_blob || ''),
    }));

    // 3. Map Edges (Defensive)
    const edges = (edgesRes.results || []).map((row: any) => ({
        source: String(row.modern_event_id),
        target: String(row.historical_event_id),
        strength: Number(row.strength) || 0
    }));

    // 4. Map State (Bulletproof NaN prevention)
    const rawState = (stateRes.results?.[0] || {}) as any;

    // Check multiple potential column names due to schema drift
    const cosmic = rawState.cosmic_turbulence ?? rawState.cosmic_variance ?? 0.75;
    const sentiment = rawState.human_sentiment ?? rawState.sentiment_score ?? 0.5;
    const alignment = rawState.existential_alignment ?? rawState.alignment_score ?? 0.3;

    const state: GlobalState = {
        cosmic_turbulence: Number(cosmic) || 0.75,
        human_sentiment: Number(sentiment) || 0.5,
        existential_alignment: Number(alignment) || 0.3,
    };

    // 5. Map Daily Rhyme
    let dailyRhyme = undefined;
    if (edgesRes.results?.[0]) {
        const topRhyme = edgesRes.results[0] as any;
        dailyRhyme = {
            modern: String(topRhyme.modern_title || "Unknown Pattern"),
            historical: String(topRhyme.historical_title || "Ancient Echo"),
            explanation: String(topRhyme.logic_explanation || "History echoes through time.")
        };
    }

    const response = { nodes, edges, state, dailyRhyme };

    return new Response(JSON.stringify(response), { headers });
}

async function handleRhyme(env: Env, id: string, headers: Record<string, string>) {
    const rhyme = await env.DB.prepare(`
        SELECT r.*, 
               m.title as modern_title, m.content_blob as modern_synthesis,
               h.title as historical_title, h.content_blob as historical_synthesis
        FROM History_Rhymes r
        JOIN Chronicle_Events m ON r.modern_event_id = m.event_id
        JOIN Chronicle_Events h ON r.historical_event_id = h.event_id
        WHERE r.rhyme_id = ?
    `).bind(id).first();

    return rhyme
        ? new Response(JSON.stringify(rhyme), { headers })
        : new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers });
}

async function handleState(env: Env, headers: Record<string, string>) {
    const res = await env.DB.prepare(`SELECT * FROM Global_State ORDER BY updated_at DESC LIMIT 1`).first();
    return new Response(JSON.stringify(res || {}), { headers });
}
