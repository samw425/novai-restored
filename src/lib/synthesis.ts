/**
 * NovAI Intelligence - Synthesis Engine
 * 
 * Powered by Gemini 2.0 Flash for real-time AI-driven news clustering,
 * Signal Score calculation, and "Bottom Line" insight generation.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Article } from '@/types';

// Initialize Gemini
const getGeminiModel = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        console.warn('[Synthesis] No Gemini API key found, using fallback mode');
        return null;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

// ============================================================================
// SIGNAL SCORE CALCULATION
// ============================================================================

/**
 * Calculate a Signal Score (1-100) for an article based on multiple factors.
 * This is a lightweight, deterministic version for when AI isn't available.
 */
export function calculateSignalScore(article: Article): number {
    let score = 50; // Base score

    // Factor 1: Source Authority (known high-signal sources)
    const highAuthoritySources = [
        'Reuters', 'Associated Press', 'Bloomberg', 'WSJ', 'The Verge',
        'TechCrunch', 'Wired', 'ArsTechnica', 'MIT Technology Review',
        'OpenAI', 'DeepMind', 'Anthropic', 'Google AI', 'Meta AI',
        'Defense One', 'War on the Rocks', 'The Information'
    ];
    if (highAuthoritySources.some(s => article.source?.toLowerCase().includes(s.toLowerCase()))) {
        score += 15;
    }

    // Factor 2: Title Keywords (high-impact signals)
    const impactKeywords = [
        'breaking', 'exclusive', 'first', 'new', 'launches', 'announces',
        'billion', 'million', 'funding', 'acquisition', 'antitrust', 'lawsuit',
        'regulation', 'GPT-5', 'o1', 'o3', 'breakthrough', 'AGI', 'safety',
        'war', 'conflict', 'attack', 'hack', 'breach', 'critical'
    ];
    const titleLower = article.title?.toLowerCase() || '';
    const keywordHits = impactKeywords.filter(k => titleLower.includes(k)).length;
    score += Math.min(keywordHits * 5, 20); // Cap at 20 points

    // Factor 3: Recency (newer = higher signal)
    const publishedDate = new Date(article.publishedAt);
    const hoursAgo = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 2) score += 10;
    else if (hoursAgo < 6) score += 5;
    else if (hoursAgo > 48) score -= 10;

    // Factor 4: Content Length (longer = more substantive)
    const summaryLength = article.summary?.length || 0;
    if (summaryLength > 300) score += 5;
    if (summaryLength < 50) score -= 5;

    // Clamp to 1-100
    return Math.max(1, Math.min(100, score));
}

// ============================================================================
// AI-POWERED SYNTHESIS (Bottom Line Generation)
// ============================================================================

export interface SynthesisResult {
    bottomLine: string[];         // 3 bullet points on "Why This Matters"
    sentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Crisis';
    themes: string[];             // Key themes identified
    signalScore: number;          // Overall day's signal quality
    signalExplanation: string;    // Why this score
    predictions: string[];        // What to watch
    generatedAt: string;
}

/**
 * Generate AI-powered synthesis from a set of articles.
 * Uses Gemini 2.0 Flash for speed and cost-effectiveness.
 */
export async function generateSynthesis(articles: Article[]): Promise<SynthesisResult> {
    const model = getGeminiModel();

    // Fallback if no API key
    if (!model || articles.length === 0) {
        return createFallbackSynthesis(articles);
    }

    const articlesContext = articles.slice(0, 15).map((a, i) =>
        `${i + 1}. [${a.category || 'AI'}] ${a.title}\n   Source: ${a.source} | Score: ${calculateSignalScore(a)}/100\n   Summary: ${a.summary || 'No summary.'}`
    ).join('\n\n');

    const prompt = `
You are the Neural Sentinel - NovAI's elite AI synthesis engine. Analyze today's intelligence feed and provide actionable insights.

TODAY'S INTELLIGENCE STREAM:
${articlesContext}

MISSION:
Generate a concise intelligence synthesis for decision-makers who need to know "Why This Matters" instantly.

OUTPUT FORMAT (JSON ONLY):
{
  "bottomLine": [
    "First key insight (1 sentence, starts with action verb)",
    "Second key insight (1 sentence)",
    "Third key insight (1 sentence)"
  ],
  "sentiment": "Bullish" | "Bearish" | "Neutral" | "Crisis",
  "themes": ["Theme 1", "Theme 2", "Theme 3"],
  "signalScore": 75,
  "signalExplanation": "One sentence explaining the day's signal quality",
  "predictions": [
    "What to watch #1",
    "What to watch #2"
  ]
}

RULES:
- "bottomLine" should NOT summarize news. It should explain IMPLICATIONS.
- "sentiment" reflects overall market/industry mood from the signals.
- Be concise. Every word must add value.
- Return ONLY valid JSON. No markdown.
`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);

        return {
            bottomLine: data.bottomLine || ['Analysis in progress...'],
            sentiment: data.sentiment || 'Neutral',
            themes: data.themes || [],
            signalScore: data.signalScore || 50,
            signalExplanation: data.signalExplanation || 'Processing signals...',
            predictions: data.predictions || [],
            generatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('[Synthesis] Gemini generation failed:', error);
        return createFallbackSynthesis(articles);
    }
}

/**
 * Create a fallback synthesis when AI is unavailable.
 */
function createFallbackSynthesis(articles: Article[]): SynthesisResult {
    const avgScore = articles.length > 0
        ? Math.round(articles.reduce((sum, a) => sum + calculateSignalScore(a), 0) / articles.length)
        : 50;

    return {
        bottomLine: [
            'Real-time intelligence processing is active.',
            'Neural filters are scanning 109+ global sources.',
            'Check back shortly for AI-synthesized insights.'
        ],
        sentiment: 'Neutral',
        themes: ['AI Intelligence', 'Real-Time Monitoring'],
        signalScore: avgScore,
        signalExplanation: 'System calibrating signal quality.',
        predictions: ['Monitor high-impact sources for breaking developments.'],
        generatedAt: new Date().toISOString()
    };
}

// ============================================================================
// DAILY BRIEF GENERATION
// ============================================================================

export interface DailyBriefSynthesis {
    date: string;
    headline: string;
    briefingItems: {
        title: string;
        category: string;
        bottomLine: string;
        signalScore: number;
        source: string;
        url: string;
    }[];
    overallSentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Crisis';
    statOfTheDay: { value: string; label: string };
}

/**
 * Generate a full Daily Brief for the Global Feed hero section.
 */
export async function generateDailyBrief(articles: Article[]): Promise<DailyBriefSynthesis> {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Get top articles with scores
    const scoredArticles = articles.map(a => ({
        ...a,
        signalScore: calculateSignalScore(a)
    })).sort((a, b) => b.signalScore - a.signalScore);

    const topArticles = scoredArticles.slice(0, 5);

    // Calculate overall sentiment based on keyword analysis
    const allTitles = articles.map(a => a.title?.toLowerCase() || '').join(' ');
    let sentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Crisis' = 'Neutral';

    const crisisKeywords = ['war', 'attack', 'crash', 'crisis', 'breach', 'hack'];
    const bearishKeywords = ['decline', 'fall', 'drop', 'layoff', 'cut', 'regulation', 'lawsuit'];
    const bullishKeywords = ['growth', 'launch', 'funding', 'breakthrough', 'record', 'partnership'];

    const crisisCount = crisisKeywords.filter(k => allTitles.includes(k)).length;
    const bearishCount = bearishKeywords.filter(k => allTitles.includes(k)).length;
    const bullishCount = bullishKeywords.filter(k => allTitles.includes(k)).length;

    if (crisisCount >= 2) sentiment = 'Crisis';
    else if (bearishCount > bullishCount + 2) sentiment = 'Bearish';
    else if (bullishCount > bearishCount + 2) sentiment = 'Bullish';

    return {
        date: today,
        headline: `Intelligence Brief: ${today}`,
        briefingItems: topArticles.map(a => ({
            title: a.title,
            category: a.category || 'AI',
            bottomLine: a.summary?.substring(0, 150) + '...' || 'Signal detected.',
            signalScore: a.signalScore,
            source: a.source,
            url: a.url
        })),
        overallSentiment: sentiment,
        statOfTheDay: {
            value: `${topArticles.length}`,
            label: 'High-Signal Stories Today'
        }
    };
}
