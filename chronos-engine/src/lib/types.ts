/// <reference types="@cloudflare/workers-types" />

export interface Env {
    DB: D1Database;
    VECTORS: VectorizeIndex;
    AI: Ai;
    CACHE: KVNamespace;
    NASA_API_KEY: string;
    GDELT_ENABLED: string;
    ARXIV_ENABLED: string;
}

export interface ChronicleEvent {
    event_id: string;
    source_type: 'NASA' | 'GDELT' | 'ARXIV' | 'GUTENBERG';
    title: string;
    content_blob: string;
    raw_data: string;
    timestamp: number;
    intensity_score: number;
    category: 'COSMIC' | 'CONFLICT' | 'SCIENCE' | 'HISTORICAL';
    vector_ref?: string;
    metadata?: string;
    synthesis?: string;
}

export interface HistoryRhyme {
    link_id: string;
    modern_event_id: string;
    historical_event_id: string;
    logic_explanation: string;
    strength: number;
    synthesis?: string;
}

export interface GlobalState {
    cosmic_turbulence: number;
    human_sentiment: number;
    existential_alignment: number;
}

export interface NebulaNode extends ChronicleEvent {
    id: string; // Alias for event_id
    x: number;
    y: number;
    z: number;
    intensity: number; // Alias for intensity_score
}

export interface NebulaEdge {
    source: string;
    target: string;
    strength: number;
}

export interface DailyRhyme {
    modern: string;
    historical: string;
    explanation: string;
}

export interface NasaFlare {
    flrID: string;
    classType: string;
    peakTime: string;
    sourceLocation: string;
    instruments: { displayName: string }[];
}

export interface GdeltArticle {
    url: string;
    title: string;
    seendate: string;
    domain: string;
    language: string;
    sourcecountry: string;
    tone: number;
}

export interface ArxivEntry {
    id: string;
    title: string;
    summary: string;
    published: string;
    category: string;
    authors: string[];
}
