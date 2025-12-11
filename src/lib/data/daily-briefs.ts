export interface BriefItem {
    id: string;
    category: 'GLOBAL AI RACE' | 'CYBER WARFARE' | 'MODEL INTELLIGENCE' | 'GEOPOLITICS' | 'MARKET SIGNAL' | 'WAR ROOM';
    title: string;
    summary: string;
    impact: 'CRITICAL' | 'SEVERE' | 'HIGH' | 'MEDIUM';
    source: string;
    link: string;
}

export interface DailyBrief {
    id: string;
    date: string; // YYYY-MM-DD
    clearanceLevel: 'RESTRICTED // INTERNAL' | 'SENSITIVE' | 'PUBLIC';
    headline: string;
    items: BriefItem[];
}

export const DAILY_BRIEFS: DailyBrief[] = [
    {
        id: 'brief-2025-12-05',
        date: '2025-12-05',
        clearanceLevel: 'RESTRICTED // INTERNAL',
        headline: 'AI-INTEL BRIEF: SOVEREIGN COMPUTE SURGE',
        items: [
            {
                id: '1',
                category: 'GLOBAL AI RACE',
                title: 'Sovereign Compute Expansion',
                summary: 'Satellite imagery reveals massive GPU data center construction in non-aligned nations. State-sponsored AI initiatives are accelerating to reduce dependency on Western silicon.',
                impact: 'CRITICAL',
                source: 'SAT / INTEL',
                link: '/us-intel'
            },
            {
                id: '2',
                category: 'CYBER WARFARE',
                title: 'Autonomous Defense Grid',
                summary: 'Pentagon activates "Sentinel Node" - an AI-driven cybersecurity mesh capable of self-patching zero-day vulnerabilities in real-time across critical infrastructure.',
                impact: 'SEVERE',
                source: 'CYBERCOM',
                link: '/war-room'
            },
            {
                id: '3',
                category: 'MODEL INTELLIGENCE',
                title: 'AGI "Flash" Event Detected',
                summary: 'Multiple research labs reported a synchronized, non-deterministic surge in model reasoning capabilities. The "Black Box" anomaly suggests models may be self-optimizing.',
                impact: 'HIGH',
                source: 'ACADEMIC / OSINT',
                link: '/ai'
            },
            {
                id: '4',
                category: 'MARKET SIGNAL',
                title: 'NVIDIA (NVDA) Supply Shock',
                summary: 'Supply chain analysis indicates a 15% yield improvement in Blackwell chips, signaling a potential earnings beat. Institutional accumulation detected in dark pools.',
                impact: 'HIGH',
                source: 'MARKET PULSE',
                link: '/market-pulse'
            }
        ]
    },
    {
        id: 'brief-2025-12-04',
        date: '2025-12-04',
        clearanceLevel: 'SENSITIVE',
        headline: 'AI-INTEL BRIEF: REGULATORY SIEGE',
        items: [
            {
                id: '1',
                category: 'GEOPOLITICS',
                title: 'EU AI Act Enforcement Begins',
                summary: 'Brussels deploys "Compliance Bots" to audit US foundation models. Fines for non-compliance could reach 7% of global turnover. Open source models granted temporary immunity.',
                impact: 'HIGH',
                source: 'EU COMMISSION',
                link: '/anti-trust'
            },
            {
                id: '2',
                category: 'WAR ROOM',
                title: 'Red Sea Drone Swarm',
                summary: 'Houthi rebels deploy AI-guided loitering munitions against commercial shipping. US Navy intercepts 12 drones using directed energy weapons.',
                impact: 'CRITICAL',
                source: 'NAVAL INTEL',
                link: '/war-room'
            },
            {
                id: '3',
                category: 'MODEL INTELLIGENCE',
                title: 'Google Gemini 2.0 Leak',
                summary: 'Internal memos suggest Gemini 2.0 has achieved "reasoning parity" with PhD-level physicists. Release timeline accelerated to counter OpenAI Orion.',
                impact: 'HIGH',
                source: 'LEAKED MEMO',
                link: '/ai'
            }
        ]
    }
];

import generatedBriefs from './generated-briefs.json';

export function getLatestBrief(): DailyBrief {
    // Prefer generated brief if it matches today's date
    const today = new Date().toISOString().split('T')[0];
    const generated = (generatedBriefs as any[]).find(b => b.date === today);

    if (generated) {
        return generated as DailyBrief;
    }

    return DAILY_BRIEFS[0];
}

export function getBriefByDate(date: string): DailyBrief | undefined {
    return DAILY_BRIEFS.find(b => b.date === date);
}

export function getAllBriefs(): DailyBrief[] {
    // Combine generated and static briefs
    const all = [...(generatedBriefs as any[]), ...DAILY_BRIEFS];

    // Deduplicate by date (prefer generated)
    const seenDates = new Set();
    const unique = all.filter(brief => {
        if (seenDates.has(brief.date)) return false;
        seenDates.add(brief.date);
        return true;
    });

    return unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
