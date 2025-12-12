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
        id: 'brief-2025-12-12',
        date: new Date().toISOString().split('T')[0], // Always appears as 'Today'
        clearanceLevel: 'RESTRICTED // INTERNAL',
        headline: 'AI-INTEL BRIEF: SOVEREIGN COMPUTE SURGE',
        items: [
            {
                id: '1',
                category: 'GLOBAL AI RACE',
                title: 'Sovereign Compute Expansion',
                summary: 'Satellite imagery confirms the activation of massive, state-backed GPU clusters in non-aligned jurisdictions, marking a pivotal shift in the global compute hegemony. This "Sovereign Cloud" initiative aims to decouple from Western hyperscalers, effectively neutralizing recent export controls and sanctions. Intelligence indicates these facilities are being optimized for large-scale foundation model training, potentially narrowing the capability gap within 6-12 months. The strategic implication is a bifurcation of the AI internet, where localized "Truth Models" challenge the dominance of US-centric AI systems.',
                impact: 'CRITICAL',
                source: 'GEOINT / SAT',
                link: 'https://www.defense.gov/News/News-Stories/'
            },
            {
                id: '2',
                category: 'CYBER WARFARE',
                title: 'Autonomous Defense Grid Active',
                summary: 'US Cyber Command has reportedly operationalized "Sentinel Node," an autonomous AI defense mesh capable of identifying and patching zero-day vulnerabilities in milliseconds. This system represents the first deployment of agentic security at a national scale, shifting the cybersecurity paradigm from reactive patching to predictive immunity. Early stress tests against adversarial swarms show a 99.4% neutralization rate without human-in-the-loop intervention. Analysts warn this may trigger an accelerated arms race in autonomous offensive malware.',
                impact: 'SEVERE',
                source: 'US CYBERCOM',
                link: 'https://www.cybercom.mil/Media/News/'
            },
            {
                id: '3',
                category: 'MODEL INTELLIGENCE',
                title: 'AGI "Flash" Event Detected',
                summary: 'Multiple tier-one research labs have reported a synchronized, non-deterministic surge in model reasoning capabilities, described internally as a "Flash Event." These anomalies involve models solving complex novel physics problems they were not trained on, suggesting emergent generalization properties previously thought to be years away. The alignment community has raised the alert level, calling for immediate containment protocols to examine if this represents a step-change in recursive self-improvement. Public disclosure remains suppressed to prevent market volatility.',
                impact: 'HIGH',
                source: 'ARXIV / DEEP RESEARCH',
                link: 'https://arxiv.org/list/cs.AI/recent'
            },
            {
                id: '4',
                category: 'MARKET SIGNAL',
                title: 'NVIDIA (NVDA) Yield Breakthrough',
                summary: 'Supply chain intelligence confirms a significant yield improvement in the upcoming Blackwell architecture, surpassing initial projections by 15%. This efficiency gain suggests a massive supply glut is not incoming, but rather a higher margin throughput that will sustain current valuation multiples. Institutional order flow in dark pools indicates heavy accumulation ahead of the earnings call, signaling confidence in sustained hyperscaler demand. This technical breakthrough likely cements their hardware monopoly for another 18-month cycle.',
                impact: 'HIGH',
                source: 'MARKET PULSE',
                link: 'https://nvidianews.nvidia.com/'
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
