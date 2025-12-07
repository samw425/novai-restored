export interface ArchivedBrief {
    id: string;
    date: string;
    executiveSummary: string;
    themes: {
        title: string;
        synthesis: string;
        confidence: number;
        implications: string[];
        articles: {
            title: string;
            source: string;
            url: string;
            publishedAt: string;
        }[];
    }[];
}

export const BRIEF_ARCHIVE: ArchivedBrief[] = [
    {
        id: 'brief-2025-12-04',
        date: 'December 4, 2025',
        executiveSummary: `**1. The Lead Narrative**
Global markets are reacting to the surprise announcement of the "Sovereign Compute Alliance" between France, Germany, and the UAE. This move signals a definitive break from US-centric infrastructure reliance.

**2. Strategic Signal**
The decoupling of compute resources is accelerating. Expect increased fragmentation in model training standards and a potential "balkanization" of AI safety protocols.`,
        themes: [
            {
                title: "Sovereign Compute Alliance Formed",
                synthesis: "France, Germany, UAE announce joint $50B investment in non-US GPU clusters.",
                confidence: 92,
                implications: ["EU-based AI labs will gain preferential access to compute.", "Nvidia may face new export licensing complexities."],
                articles: [
                    { title: "France, Germany, UAE Announce $50B Compute Fund", source: "Financial Times", url: "https://ft.com", publishedAt: "2025-12-04T08:00:00Z" },
                    { title: "The End of US Compute Dominance?", source: "The Economist", url: "https://economist.com", publishedAt: "2025-12-04T10:30:00Z" }
                ]
            },
            {
                title: "Model Fragmentation Risk",
                synthesis: "New regional standards may make global model deployment significantly harder.",
                confidence: 85,
                implications: ["Global SaaS platforms will need region-specific model fine-tuning.", "Open weights models may face geofencing."],
                articles: [
                    { title: "EU AI Act 2.0: The Sovereignty Clause", source: "Politico EU", url: "https://politico.eu", publishedAt: "2025-12-04T09:15:00Z" }
                ]
            }
        ]
    },
    {
        id: 'brief-2025-12-03',
        date: 'December 3, 2025',
        executiveSummary: `**1. The Lead Narrative**
OpenAI's "Q*" project rumors have resurfaced with a leaked internal memo suggesting a breakthrough in mathematical reasoning.

**2. Strategic Signal**
If confirmed, this represents the first step towards "System 2" thinking in LLMs, moving beyond pattern matching to true logical deduction.`,
        themes: [
            {
                title: "Reasoning Breakthrough Rumors",
                synthesis: "Leaked documents suggest 99% accuracy on MATH benchmark.",
                confidence: 78,
                implications: ["Automated theorem proving becomes viable.", "Encryption standards may need review."],
                articles: [
                    { title: "Leaked Memo Hints at Q* Breakthrough", source: "The Information", url: "https://theinformation.com", publishedAt: "2025-12-03T14:00:00Z" },
                    { title: "OpenAI stays silent on 'System 2' rumors", source: "TechCrunch", url: "https://techcrunch.com", publishedAt: "2025-12-03T16:20:00Z" }
                ]
            },
            {
                title: "Safety Team Resignations",
                synthesis: "Two senior safety researchers departed OpenAI citing 'acceleration risk'.",
                confidence: 88,
                implications: ["Internal alignment debates are spilling into public view.", "Regulatory scrutiny on labs will increase."],
                articles: [
                    { title: "Top Safety Researchers Leave OpenAI", source: "New York Times", url: "https://nytimes.com", publishedAt: "2025-12-03T11:00:00Z" }
                ]
            }
        ]
    },
    {
        id: 'brief-2025-12-02',
        date: 'December 2, 2025',
        executiveSummary: `**1. The Lead Narrative**
Nvidia's Q3 earnings call shattered expectations, but the guidance warned of "supply constraints until 2027".

**2. Strategic Signal**
The hardware bottleneck is not easing. This will force model labs to optimize for efficiency (SLMs) rather than just scale.`,
        themes: [
            {
                title: "Nvidia Supply Shock",
                synthesis: "H200 lead times extend to 18 months.",
                confidence: 95,
                implications: ["Prices for H100 rentals will remain high.", "Custom silicon projects (Google Axion, Microsoft Maia) will accelerate."],
                articles: [
                    { title: "Nvidia Warns of 2027 Supply Constraints", source: "Bloomberg", url: "https://bloomberg.com", publishedAt: "2025-12-02T16:30:00Z" },
                    { title: "Jensen Huang: 'Demand is Insatiable'", source: "CNBC", url: "https://cnbc.com", publishedAt: "2025-12-02T17:00:00Z" }
                ]
            },
            {
                title: "Small Language Model Pivot",
                synthesis: "Mistral and Meta announce new efficient 7B models.",
                confidence: 90,
                implications: ["On-device AI becomes the primary growth vector for 2026.", "Edge compute providers see stock bumps."],
                articles: [
                    { title: "Meta Releases Llama 4-7B 'Edge'", source: "The Verge", url: "https://theverge.com", publishedAt: "2025-12-02T10:00:00Z" }
                ]
            }
        ]
    }
];
