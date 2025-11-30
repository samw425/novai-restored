import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const parser = new Parser();

const ARXIV_FEEDS = [
    { name: 'arXiv AI', url: 'http://export.arxiv.org/rss/cs.AI' },
    { name: 'arXiv ML', url: 'http://export.arxiv.org/rss/cs.LG' },
    { name: 'arXiv CL', url: 'http://export.arxiv.org/rss/cs.CL' },
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

        for (const feed of ARXIV_FEEDS) {
            try {
                const data = await parser.parseURL(feed.url);

                for (const item of data.items.slice(0, 10)) {
                    const { error } = await supabase
                        .from('articles')
                        .insert({
                            source: feed.name,
                            source_url: item.link || '',
                            title: item.title || 'Untitled',
                            summary: item.contentSnippet?.substring(0, 500) || '',
                            published_at: item.pubDate || new Date().toISOString(),
                            category: 'research',
                            importance_score: 70,
                            created_at: new Date().toISOString()
                        });

                    if (!error) totalInserted++;
                }
            } catch (feedError) {
                console.error(`Error fetching ${feed.name}:`, feedError);
            }
        }

        return NextResponse.json({
            success: true,
            inserted: totalInserted,
            message: `Ingested ${totalInserted} papers from arXiv`
        });

    } catch (error: any) {
        console.error('Research Ingestion Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
