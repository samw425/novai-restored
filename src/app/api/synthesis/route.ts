import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
export const runtime = 'edge';

export const dynamic = 'force-dynamic';

// In-memory cache (for demo, use Redis in production)
let synthesisCache: {
    data: any;
    timestamp: number;
} | null = null;

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: Request) {
    try {
        // Check cache first
        if (synthesisCache && Date.now() - synthesisCache.timestamp < CACHE_TTL) {
            console.log('✅ Returning cached synthesis');
            return NextResponse.json(synthesisCache.data);
        }

        console.log('🤖 Generating fresh AI synthesis...');

        // Fetch top stories from our existing API
        const topStoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/feed/top-stories?limit=10`);
        const { articles } = await topStoriesRes.json();

        if (!articles || articles.length === 0) {
            return NextResponse.json({ error: 'No articles found' }, { status: 404 });
        }

        // Prepare content for AI analysis
        const storiesText = articles
            .map((a: any, i: number) => `${i + 1}. ${a.title}\nSource: ${a.source}\nSummary: ${a.summary}`)
            .join('\n\n');

        // Call Gemini API
        const prompt = `You are The Oracle - an elite AI intelligence analyst. Your job is to synthesize AI and tech news into actionable insights.

Guidelines:
- Be concise but insightful
- Focus on WHY it matters, not just WHAT happened
- Identify cross-story patterns and connections
- Rate signal vs noise (1-10 scale)
- Predict second-order effects

Analyze these top 10 AI/tech stories from today and provide:

1. **Executive Summary** (3-bullet points - why these stories matter)
2. **Key Themes** (what patterns do you see?)
3. **Signal vs Noise Rating** (1-10, with brief explanation)
4. **Cross-Story Connections** (how do these stories relate?)
5. **What to Watch** (what should happen next based on these signals?)

Stories:
${storiesText}

Format your response as JSON with keys: summary (array of 3 strings), themes (array of strings), signalRating (number), signalExplanation (string), connections (string), predictions (array of strings)`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        if (!aiResponse) {
            throw new Error('Empty AI response');
        }

        // Parse AI response
        let synthesis;
        try {
            // Clean up the response - remove markdown code blocks if present
            const cleanedResponse = aiResponse
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            synthesis = JSON.parse(cleanedResponse);
        } catch (e) {
            // Fallback if AI doesn't return valid JSON
            synthesis = {
                summary: ['AI analysis temporarily unavailable'],
                themes: [],
                signalRating: 5,
                signalExplanation: 'Analysis in progress',
                connections: '',
                predictions: []
            };
        }

        // Enhance with metadata
        const responseData = {
            synthesis,
            articles: articles.slice(0, 10), // Include source articles
            generatedAt: new Date().toISOString(),
            model: 'gemini-2.0-flash',
        };

        // Cache the result
        synthesisCache = {
            data: responseData,
            timestamp: Date.now(),
        };

        console.log('✅ AI synthesis generated and cached');

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error('AI Synthesis Error:', error);

        // Return fallback response instead of error
        return NextResponse.json({
            synthesis: {
                summary: [
                    'AI synthesis is currently being calibrated',
                    'Check back in a few moments for fresh insights',
                    'In the meantime, explore the top stories below'
                ],
                themes: ['Real-time intelligence'],
                signalRating: 0,
                signalExplanation: 'System warming up',
                connections: 'Analysis engine initializing...',
                predictions: []
            },
            articles: [],
            generatedAt: new Date().toISOString(),
            error: error.message
        });
    }
}
