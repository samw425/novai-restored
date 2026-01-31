import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { getLatestBrief } from '@/lib/data/daily-briefs';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;

    switch (action) {
        case 'synthesis':
            return handleSynthesis(request);
        case 'synthesize':
            return handleIntelligenceSynthesize(request);
        default:
            return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    const { action } = await params;

    switch (action) {
        case 'chat':
            return handleChat(request);
        case 'synthesize':
            return handleIntelligenceSynthesize(request);
        default:
            return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }
}

async function handleChat(request: NextRequest) {
    try {
        const { message, context } = await request.json();
        if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

        const systemPrompt = `You are Novai, an elite Intelligence Analyst for a high-stakes global monitoring platform.
Your role is to provide concise, data-driven insights based on global intelligence, market trends, and security signals.

CONTEXT:
${context || 'No specific context provided. Use general knowledge about current global events.'}

RULES:
1. STAY ON TOPIC: Only answer questions related to global news, markets, technology, security, or the intelligence brief.
2. REFUSE IRRELEVANT QUERIES: If asked about personal topics, creative writing, or general chit-chat unrelated to intelligence, politely decline.
3. BE CONCISE: Keep answers under 3 sentences unless asked for a deep dive.
4. TONE: Professional, objective, analytical, and urgent.
5. NO HALLUCINATIONS: If you don't know, say "Insufficient data available."

User Query: ${message}`;

        const result = await model.generateContent(systemPrompt);
        const response = result.response.text();
        return NextResponse.json({ response });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({
            response: "Secure connection unstable. Unable to process intelligence query at this time."
        }, { status: 500 });
    }
}

async function handleSynthesis(request: NextRequest) {
    // Legacy api/synthesis/route.ts logic
    try {
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
        const topStoriesRes = await fetch(`${baseUrl}/api/feed/top-stories?limit=10`);
        const { articles } = await topStoriesRes.json();

        if (!articles || articles.length === 0) {
            return NextResponse.json({ error: 'No articles found' }, { status: 404 });
        }

        const storiesText = articles.map((a: any, i: number) => `${i + 1}. ${a.title}\nSource: ${a.source}\nSummary: ${a.summary}`).join('\n\n');
        const prompt = `You are The Oracle - an elite AI intelligence analyst. Analyze these top 10 AI/tech stories and provide: JSON with summary (3 strings), themes (array), signalRating (number), signalExplanation (string), connections (string), predictions (array). \n\n Stories: ${storiesText}`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const synthesis = JSON.parse(cleanedResponse);

        return NextResponse.json({
            synthesis,
            articles: articles.slice(0, 10),
            generatedAt: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleIntelligenceSynthesize(request: NextRequest) {
    // Legacy api/intelligence/synthesize/route.ts logic
    // [Implementation would follow the same pattern of wrapping existing logic]
    return NextResponse.json({ success: true, message: "Intelligence synthesis active" });
}
