import { NextResponse } from 'next/server';
import { getTopStories } from '@/lib/data/top-stories-30d';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'All';

    try {
        const articles = getTopStories(category);

        return NextResponse.json({
            articles,
            count: articles.length
        });
    } catch (error: any) {
        console.error('Top Stories API Error:', error);
        return NextResponse.json({
            articles: [],
            error: error.message
        }, { status: 500 });
    }
}
