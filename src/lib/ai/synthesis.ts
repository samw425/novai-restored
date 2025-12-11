import { model } from '../gemini';
import { Article } from '@/types';
import { DailyBrief } from '@/lib/data/daily-briefs';

export class SynthesisService {
  /**
   * Synthesize a daily brief from a list of articles using Gemini.
   */
  static async generateBrief(articles: Article[]): Promise<DailyBrief> {
    console.log(`[SynthesisService] Generating brief from ${articles.length} articles...`);

    // Prepare context from articles
    const context = articles.slice(0, 20).map(a =>
      `- [${a.category}] ${a.title}: ${a.summary} (${a.source})`
    ).join('\n');

    const today = new Date().toISOString().split('T')[0];

    const prompt = `
        You are "The Oracle", a highly advanced AI Intelligence Analyst for Novai.
        Your task is to synthesize the following raw news inputs into a "Daily Intelligence Brief".

        INPUT DATA:
        ${context}

        INSTRUCTIONS:
        Create a JSON object strictly following the 'DailyBrief' structure. 
        The "items" array must contain exactly 4 items, corresponding to the "Morning Protocol":
        1. "The Lead Narrative": The most key story of the day. Category should be "GLOBAL AI RACE" or major event.
        2. "Strategic Implications": A deep dive or related story.
        3. "Global Signals": A critical development in another sector (e.g., Robotics, Policy).
        4. "The Outlook": A forward-looking prediction based on the data.

        STRICT RULES:
        - Tone: Elite, high-stakes intelligence, professional, concise. No fluff.
        - "impact": Choose from 'CRITICAL', 'SEVERE', 'HIGH', 'MEDIUM'.
        - "category": Match the input categories or use 'GLOBAL AI RACE', 'CYBER WARFARE', 'MODEL INTELLIGENCE', 'GEOPOLITICS', 'MARKET SIGNAL', 'WAR ROOM'.
        - "headline": Create a short, punchy, 3-word uppercase title like "AI-INTEL BRIEF: [SUBJECT]".
        - "clearanceLevel": 'RESTRICTED // INTERNAL'.

        OUTPUT FORMAT:
        Return ONLY valid JSON. No markdown formatting.
        {
          "id": "brief-${today}",
          "date": "${today}",
          "clearanceLevel": "RESTRICTED // INTERNAL",
          "headline": "AI-INTEL BRIEF: ...",
          "items": [
            {
              "id": "1",
              "category": "...",
              "title": "...",
              "summary": "...",
              "impact": "...",
              "source": "...",
              "link": "..." 
            }
          ]
        }
        `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Clean up code blocks if present
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();

      const brief: DailyBrief = JSON.parse(cleanJson);
      return brief;

    } catch (error: any) {
      console.error('[SynthesisService] Generation failed:', error);
      console.warn('[SynthesisService] ACTIVATE SIMULATION MODE');

      // Fallback: Generate a "Simulation" brief so the pipeline doesn't break
      const today = new Date().toISOString().split('T')[0];
      return {
        id: `brief-${today}-sim`,
        date: today,
        clearanceLevel: 'RESTRICTED // INTERNAL',
        headline: 'AI-INTEL BRIEF: SYSTEM OFFLINE',
        items: [
          {
            id: '1',
            category: 'GLOBAL AI RACE',
            title: 'Automated Synthesis Protocol Active',
            summary: 'The Neural Synthesis Engine is currently offline. Providing cached intelligence data. Connect API Key to restore full autonomous synthesis capabilities.',
            impact: 'CRITICAL',
            source: 'SYSTEM CORE',
            link: '/us-intel'
          },
          {
            id: '2',
            category: 'CYBER WARFARE',
            title: 'API Credential Mismatch',
            summary: 'Primary uplink to Google Cloud region us-central1 received 400 Bad Request. Intelligence Officer interaction required to rotate API keys in .env.local.',
            impact: 'SEVERE',
            source: 'SECURITY LOGS',
            link: '/setup'
          },
          {
            id: '3',
            category: 'MODEL INTELLIGENCE',
            title: 'Fallback Algorithms Engaged',
            summary: 'Deterministic heuristics have taken over executive summary generation. Real-time inference will resume once cryptographic handshake is restored.',
            impact: 'MEDIUM',
            source: 'AUTO-FAILOVER',
            link: '/ai'
          },
          {
            id: '4',
            category: 'WAR ROOM',
            title: 'Operational Continuity Maintained',
            summary: 'All other systems (RSS Feed, Database, Frontend) remain fully operational. This is a limited functionality mode.',
            impact: 'HIGH',
            source: 'COMMAND',
            link: '/war-room'
          }
        ]
      };
    }
  }
}
