import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { RSS_FEEDS } from '@/config/rss-feeds';
import {
    fetchRSSFeed,
    categorizeArticle,
    calculateImportanceScore,
    type RSSArticle
} from '@/lib/rss-parser';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Verify authorization (simple API key check)
    const authHeader = request.headers.get('authorization');
    const expectedKey = process.env.CRON_SECRET || 'dev-secret-key';

    if (authHeader !== `Bearer ${expectedKey}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabase) {
        return NextResponse.json({
            error: 'Supabase not configured',
            message: 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
        }, { status: 500 });
    }

    const stats = {
        feedsProcessed: 0,
        articlesFound: 0,
        articlesInserted: 0,
        articlesDuplicate: 0,
        errors: [] as string[]
    };

    try {
        // Process each RSS feed
        for (const feed of RSS_FEEDS) {
            try {
                console.log(`Fetching ${feed.name}...`);

                // Fetch RSS articles
                const rssArticles = await fetchRSSFeed(feed.url);
                stats.articlesFound += rssArticles.length;

                // Process each article
                for (const article of rssArticles) {
                    try {
                        // Skip if no link
                        if (!article.link) continue;

                        // Categorize the article
                        const { category } = categorizeArticle(
                            article.title,
                            article.contentSnippet || '',
                            feed.category
                        );

                        // Calculate importance score
                        const importanceScore = calculateImportanceScore(feed, article);

                        // Generate topic slug from title
                        const topicSlug = article.title
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .substring(0, 50);

                        // Insert into Supabase (will skip if duplicate due to UNIQUE constraint on source_url)
                        const { error } = await supabase
                            .from('articles')
                            .insert({
                                title: article.title,
                                summary: article.contentSnippet || article.content?.substring(0, 500),
                                source: feed.name,
                                source_url: article.link,
                                published_at: article.pubDate,
                                category,
                                topic_slug: topicSlug,
                                importance_score: importanceScore
                            });

                        if (error) {
                            // Check if it's a duplicate (UNIQUE constraint violation)
                            if (error.code === '23505') {
                                stats.articlesDuplicate++;
                            } else {
                                stats.errors.push(`${feed.name}: ${error.message}`);
                            }
                        } else {
                            stats.articlesInserted++;
                        }
                    } catch (articleError: any) {
                        stats.errors.push(`${feed.name} article error: ${articleError.message}`);
                    }
                }

                // Update source table with last fetch status
                await supabase
                    .from('sources')
                    .update({
                        last_fetch_at: new Date().toISOString(),
                        last_fetch_status: 'success',
                        last_error_message: null
                    })
                    .eq('feed_url', feed.url);

                stats.feedsProcessed++;
            } catch (feedError: any) {
                stats.errors.push(`${feed.name}: ${feedError.message}`);

                // Update source table with error
                await supabase
                    .from('sources')
                    .update({
                        last_fetch_at: new Date().toISOString(),
                        last_fetch_status: 'error',
                        last_error_message: feedError.message
                    })
                    .eq('feed_url', feed.url);
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            stats,
            message: `Processed ${stats.feedsProcessed} feeds, inserted ${stats.articlesInserted} new articles`
        });

    } catch (error: any) {
        console.error('Ingestion error:', error);
        return NextResponse.json({
            error: 'Ingestion failed',
            message: error.message,
            stats
        }, { status: 500 });
    }
}
