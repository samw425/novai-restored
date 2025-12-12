// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { NextResponse } from 'next/server';
export const runtime = 'edge';


export const dynamic = 'force-dynamic';

const parser = new Parser();

const FEEDS = [
    { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
    { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
    { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/' },
    { name: 'Ars Technica AI', url: 'https://arstechnica.com/tag/ai/feed/' },
    { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai/index.xml' },
];

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
        let totalInserted = 0;

        for (const feed of FEEDS) {
            try {
                const data = await parser.parseURL(feed.url);

                for (const item of data.items.slice(0, 10)) {
                    const { error } = await supabase
                        .from('articles')
                        .insert({
                            source: feed.name,
                            source_url: item.link || '',
                            title: item.title || 'Untitled',
                            summary: item.contentSnippet?.substring(0, 500) || item.title || '',
                            published_at: item.pubDate || new Date().toISOString(),
                            category: 'general',
                            importance_score: 50,
                            created_at: new Date().toISOString()
                        })
                        .select()
                        .single();

                    if (!error) totalInserted++;
                }
            } catch (feedError) {
                console.error(`Error fetching ${feed.name}:`, feedError);
            }
        }

        return NextResponse.json({
            success: true,
            inserted: totalInserted,
            message: `Ingested ${totalInserted} articles from RSS feeds`
        });

    } catch (error: any) {
        console.error('News Ingestion Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
