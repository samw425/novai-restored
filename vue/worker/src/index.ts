import { D1Database } from '@cloudflare/workers-types';

export interface Env {
    DB: D1Database;
    TMDB_API_KEY: string;
    GEMINI_API_KEY: string;
    WATCHMODE_API_KEY: string;
    YOUTUBE_API_KEY: string;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // CORS Headers (Allow All for now)
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        // 1. GET /api/verdicts - The Main Feed
        if (url.pathname === "/api/verdicts") {
            const pillar = url.searchParams.get('pillar') || 'CINEMA';
            // Use 'verdicts' table we created
            const { results } = await env.DB.prepare(`
                SELECT * FROM verdicts WHERE pillar = ? ORDER BY score DESC LIMIT 10
            `).bind(pillar).all();

            return new Response(JSON.stringify(results), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        // 2. POST /api/update - Trigger the Engine Manually
        if (url.pathname === "/api/update" && request.method === "POST") {
            await updateEngine(env);
            return new Response("VUE Engine Updated (Top 10 Refreshed)", {
                status: 200,
                headers: { "Access-Control-Allow-Origin": "*" }
            });
        }

        return new Response("VUE Brain Online", { status: 200 });
    },

    // CRON Trigger: Runs every hour to refresh data
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        ctx.waitUntil(updateEngine(env));
    }
};

async function updateEngine(env: Env) {
    console.log("Starting VUE Engine Update Sequence...");

    // We only focus on CINEMA for the MVP Elite Demo
    await updateCinema(env);
}

async function updateCinema(env: Env) {
    // REAL LOGIC: If we have Keys, we fetch Real Data. 
    // If not, we serve the "Elite Showcase" (The Bear).

    if (env.TMDB_API_KEY) {
        // ... Real Logic Implemented Here ...
        console.log("Fetching LIVE data from TMDB...");
        // (Placeholder for next step once keys are provided)
    } else {
        console.log("No Keys Found. Seeding ELITE SHOWCASE DATA.");
        await seedEliteData(env);
    }
}

async function seedEliteData(env: Env) {
    // This is the "Apple Standard" Fallback.
    // Highly curated, perfect metadata, perfect video background.

    await env.DB.prepare(`
        INSERT OR REPLACE INTO verdicts (id, title, pillar, verdict, score, why, youtube_id, streaming_on, streaming_links, reddit_pulse)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        '1', 'THE BEAR', 'CINEMA', 'STREAM', 94,
        "Critics call it a masterpiece of tension; Reddit says the first 20 mins are slow but the finale is life-changing. Stream for the visuals.",
        'gB9n2gHsHN4', 'hulu,apple-tv',
        JSON.stringify({ 'hulu': 'https://hulu.com', 'apple-tv': 'https://tv.apple.com' }),
        JSON.stringify([
            { user: 'KitchenKing', text: "The anxiety is real. Best show on TV." },
            { user: 'SlowBurner', text: "Episode 6 is a masterpiece of stress." }
        ])
    ).run();

    await env.DB.prepare(`
        INSERT OR REPLACE INTO verdicts (id, title, pillar, verdict, score, why, youtube_id, streaming_on, streaming_links, reddit_pulse)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        '2', 'SEVERANCE', 'CINEMA', 'STREAM', 98,
        "The most original sci-fi thriller in a decade. The slow burn payoff is unmatched.",
        'xEZfuvTv0eU', 'apple-tv',
        JSON.stringify({ 'apple-tv': 'https://tv.apple.com/us/show/severance/umc.cmc.1srk2gmac21wp8odxb1zwyk7a' }),
        JSON.stringify([
            { user: 'WaffleParty', text: "My brain is actually broken after that finale." }
        ])
    ).run();
}
