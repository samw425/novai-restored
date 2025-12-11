export interface PolicyBill {
    id: string;
    name: string;
    region: 'EU' | 'US' | 'CHINA' | 'UK' | 'GLOBAL';
    status: 'ENACTED' | 'PROPOSED' | 'DRAFTING' | 'IMPLEMENTATION';
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    impact: string;
    lastUpdated: string;
    docketUrl: string;
}

export interface SovereignStatus {
    country: string;
    stance: 'ACCELERATOR' | 'REGULATOR' | 'NEUTRAL';
    score: number; // 0-100 (0 = Total Restriction, 100 = Total Acceleration)
    focus: string;
}

export const GLOBAL_POLICIES: PolicyBill[] = [
    {
        id: 'eu-ai-act',
        name: 'EU AI Act',
        region: 'EU',
        status: 'IMPLEMENTATION',
        riskLevel: 'HIGH',
        impact: 'Forces immediate audit of all foundation models. Non-compliant US labs risk losing access to the entire EU single market. Penalties up to 7% of global turnover.',
        lastUpdated: '2025-11-15',
        docketUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689'
    },
    {
        id: 'us-eo-14110',
        name: 'Executive Order 14110',
        region: 'US',
        status: 'ENACTED',
        riskLevel: 'MEDIUM',
        impact: 'Mandates "Red Teaming" reports for models >10^26 FLOPs. Effectively creates a "license to train" for frontier labs (OpenAI, Anthropic, Google).',
        lastUpdated: '2025-10-30',
        docketUrl: 'https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence'
    },
    {
        id: 'china-interim',
        name: 'Interim Measures for GenAI',
        region: 'CHINA',
        status: 'ENACTED',
        riskLevel: 'HIGH',
        impact: 'Strict content control requires alignment with "Socialist Core Values". Creates a bifurcated AI ecosystem: one for China, one for the world.',
        lastUpdated: '2025-08-15',
        docketUrl: 'http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm'
    },
    {
        id: 'uk-safety-inst',
        name: 'AI Safety Institute Guidelines',
        region: 'UK',
        status: 'PROPOSED',
        riskLevel: 'LOW',
        impact: 'Establishes the UK as the global "neutral arbiter" for safety evaluations. Voluntary compliance now, but likely precursor to binding standards.',
        lastUpdated: '2025-12-01',
        docketUrl: 'https://www.gov.uk/government/organisations/ai-safety-institute'
    },
    {
        id: 'un-ai-advisory',
        name: 'UN Global AI Governance',
        region: 'GLOBAL',
        status: 'DRAFTING',
        riskLevel: 'MEDIUM',
        impact: 'First attempt at a "Global AI Treaty". Likely to fail on enforcement but will set the normative standards for "Equitable Access" to compute.',
        lastUpdated: '2025-11-20',
        docketUrl: 'https://www.un.org/en/ai-advisory-body'
    }
];

export const SOVEREIGN_DATA: SovereignStatus[] = [
    { country: 'United States', stance: 'ACCELERATOR', score: 85, focus: 'Innovation & National Security' },
    { country: 'China', stance: 'ACCELERATOR', score: 80, focus: 'State Control & Industrial Dominance' },
    { country: 'European Union', stance: 'REGULATOR', score: 30, focus: 'Fundamental Rights & Safety' },
    { country: 'United Kingdom', stance: 'NEUTRAL', score: 60, focus: 'Safety Research & Investment' },
    { country: 'UAE', stance: 'ACCELERATOR', score: 95, focus: 'Open Source & Infrastructure' },
    { country: 'Singapore', stance: 'NEUTRAL', score: 70, focus: 'Adoption & Workforce' },
];
