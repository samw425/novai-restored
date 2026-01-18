/**
 * THE CHRONOS SEEDER
 * 
 * Populates the D1 database with the "Historical Backbone" - 
 * the turning points of human civilization that modern events rhyme with.
 */

import type { Env, ChronicleEvent } from '../lib/types';

const HISTORICAL_TURNING_POINTS: Partial<ChronicleEvent>[] = [
    {
        title: "The Industrial Revolution",
        category: "HISTORICAL",
        content_blob: "The shift from agrarian economies to machine manufacturing, fundamentally altering humanity's relationship with energy, production, and the structure of society.",
        timestamp: -6000000000000, // Mid 18th century approx
        intensity_score: 1.0,
        metadata: JSON.stringify({ period: "1760-1840", region: "Britain/Global" })
    },
    {
        title: "The Fall of Rome",
        category: "HISTORICAL",
        content_blob: "The collapse of central authority in Western Europe, leading to a decentralized era of localized power and the preservation of knowledge in monastic enclaves.",
        timestamp: -47000000000000, // 476 AD approx
        intensity_score: 1.0,
        metadata: JSON.stringify({ event: "476 AD", region: "Western Europe" })
    },
    {
        title: "The Invention of the Printing Press",
        category: "HISTORICAL",
        content_blob: "Gutenberg's invention democratized knowledge, leading to the Reformation, the Enlightenment, and the rapid acceleration of human scientific progress.",
        timestamp: -16000000000000, // 1440 AD approx
        intensity_score: 0.9,
        metadata: JSON.stringify({ year: "1440", region: "Germany" })
    },
    {
        title: "The French Revolution",
        category: "HISTORICAL",
        content_blob: "A radical overhaul of social and political structures based on Enlightenment principles of liberty, equality, and fraternity.",
        timestamp: -5700000000000, // 1789 AD approx
        intensity_score: 0.95,
        metadata: JSON.stringify({ year: "1789", region: "France" })
    },
    {
        title: "The Great Depression",
        category: "HISTORICAL",
        content_blob: "A global economic collapse that redefined the role of government in managing markets and providing social safety nets.",
        timestamp: -1262304000000, // 1929 AD approx
        intensity_score: 0.9,
        metadata: JSON.stringify({ period: "1929-1939", region: "Global" })
    },
    {
        title: "The Moon Landing",
        category: "HISTORICAL",
        content_blob: "The first time humanity stepped off its homeworld, expanding the horizon of existence into the cosmic theater.",
        timestamp: -14299200000, // 1969 AD approx
        intensity_score: 1.0,
        metadata: JSON.stringify({ year: "1969", region: "Moon" })
    }
];

export async function seedHistoricalBackbone(env: Env) {
    console.log('[CHRONOS SEEDER] Planting the seeds of history...');

    for (const event of HISTORICAL_TURNING_POINTS) {
        try {
            const id = `HISTORICAL-SEED-${Math.random().toString(36).slice(2, 9)}`;
            console.log(`[CHRONOS SEEDER] Seeding: ${event.title}`);

            // 1. AI Embedding
            const embedding = await env.AI.run('@cf/baai/bge-small-en-v1.5', {
                text: [event.content_blob!]
            });
            if (!embedding) throw new Error('AI Embedding failed');

            const vectorId = `vec-${id}`;

            // 2. Vectorize
            console.log(`[CHRONOS SEEDER] Vectorizing: ${vectorId}`);
            await env.VECTORS.upsert([{
                id: vectorId,
                values: (embedding as any).data[0],
                metadata: {
                    event_id: id,
                    category: "HISTORICAL",
                    timestamp: event.timestamp!
                }
            }]);

            // 3. D1
            console.log(`[CHRONOS SEEDER] Writing to D1: ${id}`);
            await env.DB.prepare(`
                INSERT OR REPLACE INTO Chronicle_Events 
                (event_id, source_type, title, content_blob, timestamp, intensity_score, category, vector_ref, metadata)
                VALUES (?, 'SEED', ?, ?, ?, ?, 'HISTORICAL', ?, ?)
            `).bind(
                id,
                event.title,
                event.content_blob,
                event.timestamp,
                event.intensity_score,
                vectorId,
                event.metadata
            ).run();
        } catch (err: any) {
            console.error(`[CHRONOS SEEDER] Failed on ${event.title}:`, err.message);
            throw err;
        }
    }

    // 4. Force Global State Initialization
    console.log('[CHRONOS SEEDER] Initializing Global State...');
    await env.DB.prepare(`
        INSERT OR IGNORE INTO Global_State (id, cosmic_turbulence, human_sentiment, existential_alignment, updated_at)
        VALUES ('singleton', 0.5, 0.5, 0.5, ?)
    `).bind(Date.now()).run();

    console.log(`[CHRONOS SEEDER] Success: ${HISTORICAL_TURNING_POINTS.length} historical pillars established.`);
}
