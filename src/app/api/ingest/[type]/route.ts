
import { createClient } from '@supabase/supabase-js';
import { parseRSS } from '@/lib/rss-edge';
import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const FEEDS = {
    news: [
        { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
        { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
        { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/' },
    ],
    research: [
        { name: 'ArXiv AI', url: 'http://export.arxiv.org/rss/cs.AI' },
        { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml' },
    ],
    social: [
        { name: 'HackerNews Show', url: 'https://news.ycombinator.com/showrss' }
    ]
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;
    const targetFeeds = FEEDS[type as keyof typeof FEEDS];
    if (!targetFeeds) return NextResponse.json({ error: 'Invalid type' }, { status: 404 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

    const supabase = createClient(supabaseUrl, supabaseKey);
    let totalInserted = 0;

    for (const feed of targetFeeds) {
        try {
            const data = await parseRSS(feed.url);
            for (const item of data.items.slice(0, 5)) {
                const { error } = await supabase.from('articles').insert({
                    source: feed.name,
                    source_url: item.link || '',
                    title: item.title || 'Untitled',
                    summary: item.contentSnippet?.substring(0, 500) || '',
                    published_at: item.pubDate || new Date().toISOString(),
                    category: type,
                    importance_score: 50
                });
                if (!error) totalInserted++;
            }
        } catch (e) { }
    }

    return NextResponse.json({ success: true, inserted: totalInserted });
}
