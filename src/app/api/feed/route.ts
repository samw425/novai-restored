import { NextResponse } from 'next/server';
import { fetchArticles } from '@/lib/api';
// export const runtime = 'edge';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || undefined;

    try {
        const articles = await fetchArticles(limit);

        return NextResponse.json({
            items: articles,
            nextCursor: null // Golden Master has no cursor
        });
    } catch (error) {
        console.error('Feed API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
    }
}
