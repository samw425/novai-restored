'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AgencySelector } from '@/components/intel/AgencySelector';
import { DossierView } from '@/components/intel/DossierView';
import { Loader2, AlertTriangle, BrainCircuit, ExternalLink } from 'lucide-react';

// --- DATA ---
// (Keeping the rich data structure but moving it here for the page to use)
const AGENCY_PROFILES: Record<string, any> = {
    CIA: {
        name: 'Central Intelligence Agency',
        acronym: 'CIA',
        founded: '1947',
        headquarters: 'Langley, Virginia',
        director: 'William J. Burns',
        budget: '$32 Billion (Est.)',
        mission: 'Collect, analyze, evaluate, and disseminate foreign intelligence to assist the President and senior US government policymakers in making decisions relating to national security.',
        mission_url: 'https://www.cia.gov/about/mission-vision/',
        jurisdiction: 'Foreign Intelligence',
        ai_stance: 'Aggressively integrating Generative AI for open-source intelligence (OSINT) analysis and pattern recognition in intercepted communications. Launching "Maisey" and other internal LLMs.',
        active_directives: [
            { title: 'China Mission Center', description: 'Dedicated unit to address the global challenge posed by the People\'s Republic of China.', link: 'https://www.cia.gov/stories/story/cia-announces-establishment-of-china-mission-center/' },
            { title: 'Transnational Technology Risk', description: 'Focusing on emerging technologies like AI and biotech that threaten US interests.', link: 'https://www.cia.gov/about/organization/transnational-and-technology-mission-center/' }
        ],
        classified_annex: {
            codename: 'JUPITER GARDEN',
            shadow_budget: '$4.2B (Black)',
            unacknowledged_projects: ['Sentient World Simulation', 'Project STARGATE II']
        }
    },
    FBI: {
        name: 'Federal Bureau of Investigation',
        acronym: 'FBI',
        founded: '1908',
        headquarters: 'Washington, D.C.',
        director: 'Christopher Wray',
        budget: '$10.8 Billion',
        mission: 'Protect the American people and uphold the Constitution of the United States.',
        mission_url: 'https://www.fbi.gov/about/mission',
        jurisdiction: 'Domestic Intelligence & Law Enforcement',
        ai_stance: 'Utilizing AI for facial recognition (NGI system) and predictive policing algorithms. Heavy focus on combating AI-facilitated cyber crime and deepfakes.',
        active_directives: [
            { title: 'Cyber Strategy', description: 'Imposing risk and consequences on cyber adversaries.', link: 'https://www.fbi.gov/investigate/cyber/national-cyber-strategy' },
            { title: 'Election Security', description: 'Protecting democratic institutions from foreign influence.', link: 'https://www.fbi.gov/investigate/counterintelligence/foreign-influence/protected-voices' }
        ],
        classified_annex: {
            codename: 'IRON LEDGER',
            shadow_budget: '$1.1B (Black)',
            unacknowledged_projects: ['Carnivore v2', 'Magic Lantern AI']
        }
    },
    NSA: {
        name: 'National Security Agency',
        acronym: 'NSA',
        founded: '1952',
        headquarters: 'Fort Meade, Maryland',
        director: 'Gen. Timothy Haugh',
        budget: '$21 Billion (Est.)',
        mission: 'Lead the US Government in cryptology that encompasses both Signals Intelligence (SIGINT) and Cybersecurity products and services.',
        mission_url: 'https://www.nsa.gov/about/mission-values/',
        jurisdiction: 'SIGINT & Cybersecurity',
        ai_stance: 'Pioneering AI in cryptanalysis and code-breaking. Developing autonomous cyber-defense systems and AI-driven signal processing to handle exabytes of data.',
        active_directives: [
            { title: 'AI Security Center', description: 'New entity to oversee the development and integration of AI capabilities within US national security systems.', link: 'https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/3541142/nsa-announces-new-artificial-intelligence-security-center/' },
            { title: 'Quantum Resistance', description: 'Preparing national security systems for the post-quantum cryptography era.', link: 'https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/' }
        ],
        classified_annex: {
            codename: 'STELLAR WIND',
            shadow_budget: '$8.5B (Black)',
            unacknowledged_projects: ['Utah Data Center Expansion', 'Quantum Decryption Initiative']
        }
    },
    DOD: {
        name: 'Department of Defense',
        acronym: 'DOD',
        founded: '1947',
        headquarters: 'The Pentagon',
        director: 'Lloyd Austin (SecDef)',
        budget: '$842 Billion',
        mission: 'Provide the military forces needed to deter war and ensure our nation\'s security.',
        mission_url: 'https://www.defense.gov/Our-Story/',
        jurisdiction: 'National Defense',
        ai_stance: 'Project Maven and Replicator Initiative: Integrating AI into weapons systems, logistics, and decision-making. Aiming for "algorithmic warfare" dominance.',
        active_directives: [
            { title: 'Replicator Initiative', description: 'Fielding thousands of autonomous systems across multiple domains.', link: 'https://www.defense.gov/News/News-Stories/Article/Article/3508936/hicks-announces-replicator-initiative-to-counter-chinas-military-buildup/' },
            { title: 'JADC2', description: 'Joint All-Domain Command and Control implementation.', link: 'https://www.defense.gov/News/News-Stories/Article/Article/2964002/dod-releases-jadc2-implementation-plan/' }
        ],
        classified_annex: {
            codename: 'SKYNET',
            shadow_budget: '$50B+ (Black)',
            unacknowledged_projects: ['TR-3B Aurora', 'Rod from God']
        }
    },
    DHS: {
        name: 'Department of Homeland Security',
        acronym: 'DHS',
        founded: '2002',
        headquarters: 'Washington, D.C.',
        director: 'Alejandro Mayorkas',
        budget: '$60 Billion',
        mission: 'Secure the nation from the many threats we face.',
        mission_url: 'https://www.dhs.gov/mission',
        jurisdiction: 'Domestic Security',
        ai_stance: 'Using AI for border surveillance, threat detection, and analyzing travel data. CISA leads the effort in protecting critical infrastructure from AI-enabled threats.',
        active_directives: [
            { title: 'AI Safety Board', description: 'Advising on the safe and secure development and deployment of AI.', link: 'https://www.dhs.gov/news/2024/04/26/dhs-announces-establishment-artificial-intelligence-safety-and-security-board' },
            { title: 'Border Tech', description: 'Deploying autonomous surveillance towers.', link: 'https://www.dhs.gov/science-and-technology/border-security-technology' }
        ],
        classified_annex: {
            codename: 'EAGLE EYE',
            shadow_budget: '$2.5B (Black)',
            unacknowledged_projects: ['Biometric Entry-Exit Program']
        }
    },
    'State Dept': {
        name: 'Department of State',
        acronym: 'DOS',
        founded: '1789',
        headquarters: 'Harry S Truman Building',
        director: 'Antony Blinken',
        budget: '$58 Billion',
        mission: 'Protect and promote U.S. security, prosperity, and democratic values.',
        mission_url: 'https://www.state.gov/about/',
        jurisdiction: 'Foreign Policy',
        ai_stance: 'Leveraging AI to analyze global sentiment, predict conflicts, and streamline visa processing. Establishing norms for responsible state behavior in cyberspace.',
        active_directives: [
            { title: 'Enterprise AI Strategy', description: 'Harnessing AI to empower diplomacy.', link: 'https://www.state.gov/enterprise-artificial-intelligence-strategy-fy-2024-2025/' },
            { title: 'Cyber Diplomacy', description: 'Building international coalitions for secure cyberspace.', link: 'https://www.state.gov/bureaus-offices/deputy-secretary-of-state/bureau-of-cyberspace-and-digital-policy/' }
        ],
        classified_annex: {
            codename: 'FOGGY BOTTOM',
            shadow_budget: '$500M (Black)',
            unacknowledged_projects: ['Embassy Spy Posts']
        }
    },
    'White House': {
        name: 'The White House (NSC)',
        acronym: 'NSC',
        founded: '1947',
        headquarters: '1600 Pennsylvania Avenue',
        director: 'Jake Sullivan (NSA)',
        budget: 'N/A',
        mission: 'Advise and assist the President on national security and foreign policies.',
        mission_url: 'https://www.whitehouse.gov/nsc/',
        jurisdiction: 'Policy Coordination',
        ai_stance: 'Setting the national agenda for AI safety, security, and trustworthiness. Issued Executive Order on Safe, Secure, and Trustworthy Artificial Intelligence.',
        active_directives: [
            { title: 'Executive Order on AI', description: 'Comprehensive directive to manage AI risks.', link: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/' }
        ],
        classified_annex: {
            codename: 'CROWN JEWEL',
            shadow_budget: 'Classified',
            unacknowledged_projects: ['PEADs']
        }
    },
    Treasury: {
        name: 'Department of the Treasury',
        acronym: 'USDT',
        founded: '1789',
        headquarters: 'Washington, D.C.',
        director: 'Janet Yellen',
        budget: '$16 Billion',
        mission: 'Maintain a strong economy and create economic and job opportunities.',
        mission_url: 'https://home.treasury.gov/about/role-of-the-treasury',
        jurisdiction: 'Finance & Sanctions',
        ai_stance: 'Using AI to detect money laundering, fraud, and sanctions evasion. Monitoring the use of AI in the financial sector for stability risks.',
        active_directives: [
            { title: 'AI in Finance', description: 'Managing risks and opportunities of AI in the financial sector.', link: 'https://home.treasury.gov/news/press-releases/jy2429' }
        ],
        classified_annex: {
            codename: 'GOLDEN KEY',
            shadow_budget: '$300M (Black)',
            unacknowledged_projects: ['SWIFT Surveillance']
        }
    }
};

export default function USIntelPage() {
    const [activeAgency, setActiveAgency] = useState<string>('ALL');
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Feed Logic
    const fetchFeed = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/feed/us-intel?agency=${activeAgency}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setFeedItems(data.items || []);
        } catch (error) {
            console.error("Feed fetch error:", error);
            // Keep existing items if error, or show error state
        } finally {
            setLoading(false);
        }
    }, [activeAgency]);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Agency Selector - Sticky Top */}
            <AgencySelector
                activeAgency={activeAgency}
                onSelect={setActiveAgency}
                agencies={AGENCY_PROFILES}
            />

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Dossier View (Sticky) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        {activeAgency === 'ALL' ? (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BrainCircuit className="text-blue-600" size={32} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 mb-2">Global Intelligence Wire</h2>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    You are viewing the aggregated real-time feed from all monitored US intelligence agencies. Select a specific agency above to view its classified dossier and dedicated stream.
                                </p>
                            </div>
                        ) : (
                            <DossierView profile={AGENCY_PROFILES[activeAgency]} />
                        )}
                    </div>

                    {/* RIGHT COLUMN: Live Feed */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    Live Wire: {activeAgency === 'ALL' ? 'All Sources' : AGENCY_PROFILES[activeAgency]?.acronym}
                                </h3>
                                <span className="text-[10px] font-mono text-slate-400">ENCRYPTED // REAL-TIME</span>
                            </div>

                            {loading ? (
                                <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                    <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
                                    <span className="text-xs font-mono uppercase tracking-widest">Establishing Secure Uplink...</span>
                                </div>
                            ) : feedItems.length === 0 ? (
                                <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                    <AlertTriangle size={32} className="mb-4 text-amber-500" />
                                    <span className="text-xs font-mono uppercase tracking-widest">No Intelligence Reports Available</span>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {feedItems.map((item, i) => (
                                        <div key={i} className="p-6 hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.source === 'CIA' ? 'bg-blue-100 text-blue-700' :
                                                        item.source === 'FBI' ? 'bg-red-100 text-red-700' :
                                                            item.source === 'NSA' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {item.source}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400">
                                                        {new Date(item.pubDate).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                    {item.contentSnippet}
                                                </p>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
