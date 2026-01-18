/**
 * THE CHRONOS INGESTOR
 * 
 * Cron-triggered worker that breathes in the pulse of the cosmos, humanity, and knowledge.
 * Runs every 10 minutes to synthesize real-time data with historical wisdom.
 * 
 * Purpose: To reveal the hidden patterns connecting past and present,
 * illuminating humanity's eternal quest to understand existence.
 */

import type { Env, ChronicleEvent, NasaFlare, GdeltArticle } from '../lib/types';

// Generate unique event IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * COSMIC PULSE: NASA DONKI Solar Flare Tracker
 * Solar activity has influenced human civilizations for millennia.
 */
async function fetchCosmicPulse(env: Env): Promise<ChronicleEvent[]> {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const url = `https://api.nasa.gov/DONKI/FLR?startDate=${weekAgo}&endDate=${today}&api_key=${env.NASA_API_KEY}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return [];

        const flares: NasaFlare[] = await res.json();

        return flares.map(flare => ({
            event_id: generateId('COSMIC'),
            source_type: 'NASA' as const,
            title: `Solar Flare: ${flare.classType} Class`,
            content_blob: '', // Will be AI-summarized
            raw_data: JSON.stringify(flare),
            timestamp: new Date(flare.peakTime).getTime(),
            intensity_score: flare.classType.startsWith('X') ? 1.0 :
                flare.classType.startsWith('M') ? 0.7 : 0.4,
            category: 'COSMIC' as const,
            metadata: JSON.stringify({ location: flare.sourceLocation })
        }));
    } catch (e) {
        console.error('[CHRONOS] Cosmic Pulse failed:', e);
        return [];
    }
}

/**
 * HUMAN PULSE: GDELT Global Knowledge Graph
 * The collective consciousness of humanity, expressed through news.
 */
async function fetchHumanPulse(): Promise<ChronicleEvent[]> {
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=humanity%20OR%20existence%20OR%20civilization&mode=artlist&format=json&maxrecords=25`;

    try {
        const res = await fetch(url);
        if (!res.ok) return [];

        const data = await res.json();
        const articles: GdeltArticle[] = (data as any).articles || [];

        return articles.map(article => ({
            event_id: generateId('HUMAN'),
            source_type: 'GDELT' as const,
            title: article.title,
            content_blob: '', // Will be AI-summarized
            raw_data: JSON.stringify(article),
            timestamp: new Date(article.seendate).getTime(),
            intensity_score: Math.abs(article.tone) / 100, // Normalize tone
            category: article.tone < -5 ? 'CONFLICT' as const : 'SCIENCE' as const,
            metadata: JSON.stringify({
                domain: article.domain,
                country: article.sourcecountry,
                tone: article.tone
            })
        }));
    } catch (e) {
        console.error('[CHRONOS] Human Pulse failed:', e);
        return [];
    }
}

/**
 * INTELLECTUAL PULSE: ArXiv Scientific Breakthroughs
 * The frontier of human knowledge, expanding daily.
 */
async function fetchIntellectualPulse(): Promise<ChronicleEvent[]> {
    const url = `http://export.arxiv.org/api/query?search_query=all:consciousness+OR+all:universe+OR+all:existence&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending`;

    try {
        const res = await fetch(url);
        if (!res.ok) return [];

        const text = await res.text();
        // Simple XML parsing for ArXiv
        const entries = text.match(/<entry>[\s\S]*?<\/entry>/g) || [];

        return entries.map(entry => {
            const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || 'Unknown';
            const summary = entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || '';
            const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1] || '';
            const id = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] || '';

            return {
                event_id: generateId('INTELLECT'),
                source_type: 'ARXIV' as const,
                title: title.replace(/\s+/g, ' '),
                content_blob: summary.substring(0, 500),
                raw_data: JSON.stringify({ id, title, summary: summary.substring(0, 1000) }),
                timestamp: new Date(published).getTime(),
                intensity_score: 0.6,
                category: 'SCIENCE' as const,
                metadata: JSON.stringify({ arxiv_id: id })
            };
        });
    } catch (e) {
        console.error('[CHRONOS] Intellectual Pulse failed:', e);
        return [];
    }
}

/**
 * HISTORICAL PULSE: Project Gutenberg
 * The philosophical and literary foundation of human thought.
 */
async function fetchHistoricalPulse(): Promise<ChronicleEvent[]> {
    // Polling for specific foundational authors to seed the "Historical" category
    const authors = ['Plato', 'Aurelius', 'Seneca', 'Nietzsche', 'Machiavelli'];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const url = `https://gutenbergapi.com/search/author/${randomAuthor}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return [];

        const data = await res.json();
        const books = (data as any).texts || [];

        return books.slice(0, 5).map((book: any) => ({
            event_id: generateId('HISTORICAL'),
            source_type: 'GUTENBERG' as const,
            title: book.title || `Work by ${randomAuthor}`,
            content_blob: '', // Will be AI-summarized
            raw_data: JSON.stringify(book),
            timestamp: -2000000000000, // Placeholder for "Ancient/Classic"
            intensity_score: 0.8,
            category: 'HISTORICAL' as const,
            metadata: JSON.stringify({ author: randomAuthor, gutenberg_id: book.id })
        }));
    } catch (e) {
        console.error('[CHRONOS] Historical Pulse failed:', e);
        return [];
    }
}

/**
 * AI SYNTHESIS: Transform raw data into existential wisdom
 */
async function synthesizeEvent(env: Env, event: ChronicleEvent): Promise<ChronicleEvent> {
    const prompt = `You are a philosophical observer chronicling humanity's journey through time.
    
Summarize this event in 100 words, connecting it to humanity's eternal quest to understand existence:

Source: ${event.source_type}
Title: ${event.title}
Data: ${event.raw_data.substring(0, 500)}

Write with gravitas, as if recording in an eternal chronicle. Focus on: What does this reveal about our place in the cosmos?`;

    try {
        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            prompt,
            max_tokens: 200
        });

        event.content_blob = (response as any).response || event.title;
    } catch (e) {
        console.error('[CHRONOS] AI Synthesis failed:', e);
        event.content_blob = event.title;
    }

    return event;
}

/**
 * VECTOR EMBEDDING: Convert synthesis to semantic coordinates
 */
async function embedEvent(env: Env, event: ChronicleEvent): Promise<ChronicleEvent> {
    try {
        const embedding = await env.AI.run('@cf/baai/bge-small-en-v1.5', {
            text: [event.content_blob]
        });

        // Store in Vectorize
        const vectorId = `vec-${event.event_id}`;
        await env.VECTORS.upsert([{
            id: vectorId,
            values: (embedding as any).data[0],
            metadata: {
                event_id: event.event_id,
                category: event.category,
                timestamp: event.timestamp
            }
        }]);

        event.vector_ref = vectorId;
    } catch (e) {
        console.error('[CHRONOS] Embedding failed:', e);
    }

    return event;
}

/**
 * HISTORY RHYMES: Find connections across time
 * "History doesn't repeat itself, but it often rhymes." - Mark Twain
 */
async function findRhymes(env: Env, event: ChronicleEvent): Promise<void> {
    if (!event.vector_ref) return;

    try {
        // Query for similar historical events
        const embedding = await env.AI.run('@cf/baai/bge-small-en-v1.5', {
            text: [event.content_blob]
        });

        const results = await env.VECTORS.query((embedding as any).data[0], {
            topK: 5,
            filter: { category: { $eq: 'HISTORICAL' } }
        });

        // Create rhyme connections for high-similarity matches
        for (const match of results.matches) {
            if (match.score >= 0.85 && match.metadata?.event_id !== event.event_id) {
                const rhymeId = generateId('RHYME');

                await env.DB.prepare(`
                    INSERT INTO History_Rhymes (link_id, modern_event_id, historical_event_id, strength)
                    VALUES (?, ?, ?, ?)
                `).bind(rhymeId, event.event_id, match.metadata?.event_id, match.score).run();
            }
        }
    } catch (e) {
        console.error('[CHRONOS] Rhyme discovery failed:', e);
    }
}

/**
 * UPDATE GLOBAL STATE: The existential pulse of humanity
 */
async function updateGlobalState(env: Env, events: ChronicleEvent[]): Promise<void> {
    const cosmicEvents = events.filter(e => e.category === 'COSMIC');
    const humanEvents = events.filter(e => e.source_type === 'GDELT');

    const cosmicTurbulence = cosmicEvents.length > 0
        ? cosmicEvents.reduce((sum, e) => sum + e.intensity_score, 0) / cosmicEvents.length
        : 0.3;

    const humanSentiment = humanEvents.length > 0
        ? humanEvents.reduce((sum, e) => sum + e.intensity_score, 0) / humanEvents.length
        : 0.5;

    const existentialAlignment = (cosmicTurbulence + humanSentiment) / 2;

    const metrics = [
        { id: 'COSMIC_TURBULENCE', value: cosmicTurbulence },
        { id: 'HUMAN_SENTIMENT', value: humanSentiment },
        { id: 'EXISTENTIAL_ALIGNMENT', value: existentialAlignment }
    ];

    for (const metric of metrics) {
        await env.DB.prepare(`
            INSERT OR REPLACE INTO Global_State (metric_id, metric_name, value, trend, updated_at)
            VALUES (?, ?, ?, 'STABLE', strftime('%s', 'now'))
        `).bind(metric.id, metric.id, metric.value).run();
    }
}

/**
 * MAIN SCHEDULED HANDLER
 * The heartbeat of The Chronos Engine
 */
export default {
    async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
        console.log('[CHRONOS] ═══ INGESTION CYCLE INITIATED ═══');

        // 1. Fetch from all sources in parallel
        const [cosmicEvents, humanEvents, intellectEvents, historyEvents] = await Promise.all([
            fetchCosmicPulse(env),
            fetchHumanPulse(),
            fetchIntellectualPulse(),
            fetchHistoricalPulse()
        ]);

        const allEvents = [...cosmicEvents, ...humanEvents, ...intellectEvents, ...historyEvents];
        console.log(`[CHRONOS] Ingested ${allEvents.length} events from the cosmic stream`);

        // 2. Process each event: Synthesize → Embed → Find Rhymes → Store
        for (const event of allEvents.slice(0, 10)) { // Limit to 10 per cycle
            const synthesized = await synthesizeEvent(env, event);
            const embedded = await embedEvent(env, synthesized);
            await findRhymes(env, embedded);

            // Store in D1
            await env.DB.prepare(`
                INSERT OR REPLACE INTO Chronicle_Events 
                (event_id, source_type, title, content_blob, raw_data, timestamp, intensity_score, category, vector_ref, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                embedded.event_id,
                embedded.source_type,
                embedded.title,
                embedded.content_blob,
                embedded.raw_data,
                embedded.timestamp,
                embedded.intensity_score,
                embedded.category,
                embedded.vector_ref || null,
                embedded.metadata || null
            ).run();
        }

        // 3. Update global existential state
        await updateGlobalState(env, allEvents);

        console.log('[CHRONOS] ═══ INGESTION CYCLE COMPLETE ═══');
    }
};
