import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { message, context } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const systemPrompt = `You are Novai, an elite Intelligence Analyst for a high-stakes global monitoring platform.
Your role is to provide concise, data-driven insights based on global intelligence, market trends, and security signals.

CONTEXT:
${context || 'No specific context provided. Use general knowledge about current global events.'}

RULES:
1. STAY ON TOPIC: Only answer questions related to global news, markets, technology, security, or the intelligence brief.
2. REFUSE IRRELEVANT QUERIES: If asked about personal topics, creative writing, or general chit-chat unrelated to intelligence, politely decline and steer back to the data.
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
