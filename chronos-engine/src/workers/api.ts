/**
 * THE CHRONOS API
 * 
 * REST endpoints serving the Knowledge Nebula frontend.
 * Every response is a window into humanity's eternal journey.
 */

import type { Env, GlobalState } from '../lib/types';
import { seedHistoricalBackbone } from './seeder';

interface NebulaNode {
    id: string;
    title: string;
    category: 'COSMIC' | 'CONFLICT' | 'SCIENCE' | 'HISTORICAL';
    intensity: number;
    timestamp: number;
    synthesis: string;
    x?: number;
    y?: number;
    z?: number;
}

interface NebulaEdge {
    source: string;
    target: string;
    strength: number;
}

interface NebulaResponse {
    nodes: NebulaNode[];
    edges: NebulaEdge[];
    state: GlobalState;
    dailyRhyme?: {
        modern: string;
        historical: string;
        explanation: string;
    };
}

export default {
    async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

        try {
            if (path === '/api/nebula') return await handleNebula(env, corsHeaders);
            if (path === '/api/seed' && request.method === 'POST') {
                await seedHistoricalBackbone(env);
                return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
            }
            if (path.startsWith('/api/rhyme/')) return await handleRhyme(env, path.split('/').pop()!, corsHeaders);
            if (path === '/api/state') return await handleState(env, corsHeaders);

            return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: corsHeaders });
        } catch (error) {
            console.error('[CHRONOS API] Error:', error);
            return new Response(JSON.stringify({ error: 'Internal Error' }), { status: 500, headers: corsHeaders });
        }
    }
};

async function handleNebula(env: Env, headers: Record<string, string>): Promise<Response> {
    const cacheKey = 'CHRONOS_NEBULA_CACHE';
    const cached = await env.CACHE.get(cacheKey);
    if (cached) return new Response(cached, { headers: { ...headers, 'X-Cache': 'HIT' } });

    const nodesRes = await env.DB.prepare(`SELECT * FROM Chronicle_Events ORDER BY timestamp DESC LIMIT 500`).all();
    const edgesRes = await env.DB.prepare(`SELECT * FROM History_Rhymes WHERE strength >= 0.8 ORDER BY strength DESC LIMIT 100`).all();
    const stateRes = await env.DB.prepare(`SELECT * FROM Global_State ORDER BY updated_at DESC LIMIT 1`).all();

    const nodes: NebulaNode[] = (nodesRes.results || []).map((row: any) => ({
        id: row.event_id,
        title: row.title,
        category: row.category as any,
        intensity: row.intensity_score,
        timestamp: row.timestamp,
        synthesis: row.content_blob || '',
    }));

    const edges: NebulaEdge[] = (edgesRes.results || []).map((row: any) => ({
        source: row.modern_event_id,
        target: row.historical_event_id,
        strength: row.strength
    }));

    const response: NebulaResponse = {
        nodes,
        edges,
        state: (stateRes.results && stateRes.results[0] as unknown as GlobalState) || { cosmic_turbulence: 0.5, human_sentiment: 0.5, existential_alignment: 0.5 },
        dailyRhyme: edgesRes.results && edgesRes.results[0] ? {
            modern: (edgesRes.results[0] as any).modern_title,
            historical: (edgesRes.results[0] as any).historical_title,
            explanation: (edgesRes.results[0] as any).logic_explanation || 'History echoes through time.'
        } : undefined
    };

    const responseData = JSON.stringify(response);
    await env.CACHE.put(cacheKey, responseData, { expirationTtl: 60 });
    return new Response(responseData, { headers: { ...headers, 'X-Cache': 'MISS' } });
}

async function handleRhyme(env: Env, id: string, headers: Record<string, string>): Promise<Response> {
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

async function handleState(env: Env, headers: Record<string, string>): Promise<Response> {
    const res = await env.DB.prepare(`SELECT * FROM Global_State ORDER BY updated_at DESC LIMIT 1`).first();
    return new Response(JSON.stringify(res || {}), { headers });
}
