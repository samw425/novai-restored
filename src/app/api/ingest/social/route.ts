import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
export const runtime = 'edge';


export const dynamic = 'force-dynamic';

const SUBREDDITS = [
    'LocalLLaMA', 'singularity', 'ArtificialIntelligence', 'OpenAI',
    'MachineLearning', 'StableDiffusion', 'ChatGPT', 'midjourney',
    'ClaudeAI', 'Bard', 'Futurology', 'technology'
];

async function fetchReddit(subreddit: string) {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`, {
        headers: { 'User-Agent': 'Novai/1.0' }
    });
    const json = await response.json();
    return json.data.children.map((child: any) => child.data);
}

async function fetchHackerNews() {
    const topStories = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await topStories.json();

    const items = [];
    for (const id of ids.slice(0, 10)) {
        const item = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        items.push(await item.json());
    }
    return items;
}

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
        let totalInserted = 0;

        // Reddit
        for (const subreddit of SUBREDDITS) {
            try {
                const posts = await fetchReddit(subreddit);

                for (const post of posts) {
                    const { error } = await supabase
                        .from('articles')
                        .insert({
                            source: `r/${subreddit}`,
                            source_url: `https://reddit.com${post.permalink}`,
                            title: post.title,
                            summary: post.selftext?.substring(0, 500) || post.title,
                            published_at: new Date(post.created_utc * 1000).toISOString(),
                            category: 'general',
                            importance_score: Math.min(100, post.ups / 10),
                            created_at: new Date().toISOString()
                        });

                    if (!error) totalInserted++;
                }
            } catch (err) {
                console.error(`Error fetching r/${subreddit}:`, err);
            }
        }

        // Hacker News
        try {
            const items = await fetchHackerNews();

            for (const item of items) {
                if (!item.title) continue;

                const { error } = await supabase
                    .from('articles')
                    .insert({
                        source: 'Hacker News',
                        source_url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
                        title: item.title,
                        summary: item.title,
                        published_at: new Date(item.time * 1000).toISOString(),
                        category: 'general',
                        importance_score: Math.min(100, (item.score || 0) / 5),
                        created_at: new Date().toISOString()
                    });

                if (!error) totalInserted++;
            }
        } catch (err) {
            console.error('Error fetching Hacker News:', err);
        }

        return NextResponse.json({
            success: true,
            inserted: totalInserted,
            message: `Ingested ${totalInserted} articles from social sources`
        });

    } catch (error: any) {
        console.error('Social Ingestion Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
