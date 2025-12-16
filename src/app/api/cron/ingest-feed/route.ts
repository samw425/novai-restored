import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { RSS_FEEDS } from '@/config/rss-feeds';

// ----------------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------------
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Allow 60s for ingestion

// ----------------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------------
function cleanText(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&[a-z]+;/gi, '')
        .substring(0, 300); // Slightly longer summary for DB
}

// Strict AI Filter (Shared Logic)
function isRelevantToAI(title: string, summary: string, category: string): boolean {
    const text = (title + ' ' + summary).toLowerCase();

    // 1. HARD BLOCKS
    const hardKeywords = ['anime', 'manga', 'k-pop', 'concert', 'festival', 'fashion', 'sports', 'soccer', 'football', 'recipe', 'cooking', 'travel', 'tourism'];
    if (hardKeywords.some(k => text.includes(k))) return false;

    // 2. STRONG SIGNALS (Need 1)
    const strongSignals = [
        'ai', 'artificial intelligence', 'machine learning', 'llm', 'gpt', 'chatgpt', 'openai', 'anthropic', 'deepmind', 'nvidia', 'gpu',
        'robot', 'robotics', 'autonomous', 'drone', 'neural', 'transformer', 'generative', 'diffusion', 'copilot', 'gemini', 'claude', 'llama'
    ];

    // 3. CONTEXT SIGNALS (Need Strong + Context or 2 Strong)
    if (strongSignals.some(s => text.includes(s))) return true;

    // 4. CATEGORY OVERRIDES
    if (['robotics', 'research', 'code'].includes(category)) return true;

    return false;
}

// ----------------------------------------------------------------------------
// MAIN
// ----------------------------------------------------------------------------
export async function GET(request: Request) {
    console.log('[Cron/Ingest] Starting feed ingestion...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const parser = new Parser();

    let newArticlesCount = 0;
    const errors: string[] = [];

    // Parallel Fetch
    const feedPromises = RSS_FEEDS.map(async (source: any) => {
        try {
            const feed = await parser.parseURL(source.url);

            // Process latest 5 items per feed
            const items = feed.items.slice(0, 5);

            for (const item of items) {
                const title = item.title || 'Untitled';
                const summary = cleanText(item.contentSnippet || item.description || '');
                const url = item.link || '';
                const date = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
                const category = source.category.toLowerCase();

                // FILTER
                if (!isRelevantToAI(title, summary, category)) continue;

                // SAVE TO DB
                const { error } = await supabase
                    .from('articles')
                    .upsert({
                        title,
                        summary,
                        url,
                        source: source.name,
                        published_at: date,
                        category,
                        image_url: null, // RSS rarely has good images, handle later if needed
                        relevance_score: source.priority * 10
                    }, {
                        onConflict: 'url', // Dedupe by URL
                        ignoreDuplicates: true
                    });

                if (!error) newArticlesCount++;
            }
        } catch (err: any) {
            console.error(`Failed to fetch ${source.name}: ${err.message}`);
            errors.push(`${source.name}: ${err.message}`);
        }
    });

    await Promise.all(feedPromises);

    console.log(`[Cron/Ingest] Finished. Inserted ${newArticlesCount} new articles.`);

    return NextResponse.json({
        success: true,
        newArticles: newArticlesCount,
        errors: errors.slice(0, 5) // Return top 5 errors
    });
}
