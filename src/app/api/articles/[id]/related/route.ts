import { NextResponse } from 'next/server';
export const runtime = 'edge';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Mock related articles
    const relatedItems = [
        {
            id: 'rel-1',
            title: 'Understanding the implications of this breakthrough',
            source: 'DeepMind Blog',
            url: '#'
        },
        {
            id: 'rel-2',
            title: 'Previous research on similar architectures',
            source: 'Arxiv',
            url: '#'
        }
    ];

    return NextResponse.json({ items: relatedItems });
}
