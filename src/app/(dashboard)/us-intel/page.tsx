'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Shield,
    Globe,
    Zap,
    Activity,
    AlertTriangle,
    Search,
    Filter,
    ChevronRight,
    Lock,
    Eye,
    Radio,
    FileText,
    Siren,
    ArrowUpRight,
    Terminal,
    Cpu,
    Target,
    History,
    BrainCircuit,
    Loader2,
    ShieldAlert
} from 'lucide-react';
import { MonthlyIntelBrief } from '@/components/dashboard/MonthlyIntelBrief';

// --- TYPES ---
interface FeedItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    source: 'CIA' | 'FBI' | 'NSA' | 'DOD' | 'State Dept' | 'White House' | 'Treasury' | 'DHS' | 'Unknown';
    agency: string; // For display
    novai_analysis?: string; // AI generated context
}

interface AgencyProfile {
    name: string;
    acronym: string;
    founded: string;
    headquarters: string;
    director: string;
    budget: string;
    mission: string;
    mission_url: string;
    jurisdiction: string;
    special_units: string[];
    known_associates: string[];
    focus: string[];
    controversies: string[];
    ai_stance?: string; // New field for AI positioning
    active_directives?: { title: string; description: string; link?: string }[]; // New field for real links
    classified_annex?: {
        codename: string;
        shadow_budget: string;
        unacknowledged_projects: string[];
        deep_fact: string;
    };
}

// --- DATA ---
const AGENCY_PROFILES: Record<string, AgencyProfile> = {
    CIA: {
        name: 'Central Intelligence Agency',
        acronym: 'CIA',
        founded: '1947',
        headquarters: 'Langley, Virginia',
        director: 'William J. Burns',
        budget: '$32 Billion (Est.)',
        mission: 'Collect, analyze, evaluate, and disseminate foreign intelligence to assist the President and senior US government policymakers in making decisions relating to national security.',
        mission_url: 'https://www.cia.gov/about/mission-vision/',
        jurisdiction: 'Foreign Intelligence (No domestic police powers)',
        special_units: ['Special Activities Center (SAC)', 'Global Response Staff', 'Political Action Group'],
        known_associates: ['MI6', 'DGSE', 'Mossad', 'ASIS'],
        focus: ['Counterterrorism', 'Nonproliferation', 'Cyber Intelligence', 'Counterintelligence'],
        controversies: ['MKUltra', 'Iran-Contra Affair', 'Enhanced Interrogation Techniques', 'Bay of Pigs'],
        ai_stance: 'Aggressively integrating Generative AI for open-source intelligence (OSINT) analysis and pattern recognition in intercepted communications. Launching "Maisey" and other internal LLMs.',
        active_directives: [
            { title: 'China Mission Center', description: 'Dedicated unit to address the global challenge posed by the People\'s Republic of China.', link: 'https://www.cia.gov/stories/story/cia-announces-establishment-of-china-mission-center/' },
            { title: 'Transnational Technology Risk', description: 'Focusing on emerging technologies like AI and biotech that threaten US interests.', link: 'https://www.cia.gov/about/organization/transnational-and-technology-mission-center/' }
        ],
        classified_annex: {
            codename: 'JUPITER GARDEN',
            shadow_budget: '$4.2B (Black)',
            unacknowledged_projects: ['Sentient World Simulation', 'Project STARGATE II'],
            deep_fact: 'The CIA operates a venture capital firm called In-Q-Tel to fund startups that develop technology useful to the intelligence community.'
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
        jurisdiction: 'Domestic Intelligence & Federal Law Enforcement',
        special_units: ['Hostage Rescue Team (HRT)', 'Cyber Action Team', 'Behavioral Analysis Unit'],
        known_associates: ['DEA', 'ATF', 'DHS', 'Local Law Enforcement'],
        focus: ['Terrorism', 'Counterintelligence', 'Cyber Crime', 'Public Corruption', 'Civil Rights'],
        controversies: ['COINTELPRO', 'Ruby Ridge', 'Waco Siege', 'MLK Jr. Surveillance'],
        ai_stance: 'Utilizing AI for facial recognition (NGI system) and predictive policing algorithms. Heavy focus on combating AI-facilitated cyber crime and deepfakes.',
        active_directives: [
            { title: 'Cyber Strategy', description: 'Imposing risk and consequences on cyber adversaries.', link: 'https://www.fbi.gov/investigate/cyber/national-cyber-strategy' },
            { title: 'Election Security', description: 'Protecting democratic institutions from foreign influence.', link: 'https://www.fbi.gov/investigate/counterintelligence/foreign-influence/protected-voices' }
        ],
        classified_annex: {
            codename: 'IRON LEDGER',
            shadow_budget: '$1.1B (Black)',
            unacknowledged_projects: ['Carnivore v2', 'Magic Lantern AI'],
            deep_fact: 'The FBI maintains a massive biometric database called NGI (Next Generation Identification) which holds fingerprints, iris scans, and facial recognition data on millions of Americans.'
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
        jurisdiction: 'Signals Intelligence & Cybersecurity',
        special_units: ['Tailored Access Operations (TAO)', 'Equation Group', 'Cryptanalysis Unit'],
        known_associates: ['US Cyber Command', 'GCHQ', 'CSE', 'BND'],
        focus: ['SIGINT', 'Cybersecurity', 'Cryptanalysis', 'Network Warfare'],
        controversies: ['PRISM', 'Snowden Leaks', 'Warrantless Wiretapping', 'EternalBlue Exploit'],
        ai_stance: 'Pioneering AI in cryptanalysis and code-breaking. Developing autonomous cyber-defense systems and AI-driven signal processing to handle exabytes of data.',
        active_directives: [
            { title: 'AI Security Center', description: 'New entity to oversee the development and integration of AI capabilities within US national security systems.', link: 'https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/3541142/nsa-announces-new-artificial-intelligence-security-center/' },
            { title: 'Quantum Resistance', description: 'Preparing national security systems for the post-quantum cryptography era.', link: 'https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/' }
        ],
        classified_annex: {
            codename: 'STELLAR WIND',
            shadow_budget: '$8.5B (Black)',
            unacknowledged_projects: ['Utah Data Center Expansion', 'Quantum Decryption Initiative'],
            deep_fact: 'The NSA is the largest employer of mathematicians in the United States.'
        }
    },
    DOD: {
        name: 'Department of Defense',
        acronym: 'DOD',
        founded: '1947',
        headquarters: 'The Pentagon, Arlington, Virginia',
        director: 'Lloyd Austin (SecDef)',
        budget: '$842 Billion',
        mission: 'Provide the military forces needed to deter war and ensure our nation\'s security.',
        mission_url: 'https://www.defense.gov/Our-Story/',
        jurisdiction: 'Military Operations & National Defense',
        special_units: ['JSOC', 'DARPA', 'DIA', 'US Cyber Command'],
        known_associates: ['NATO', 'Five Eyes', 'CIA', 'NSA'],
        focus: ['Warfighting', 'Deterrence', 'Humanitarian Aid', 'Cyber Warfare'],
        controversies: ['Abu Ghraib', 'Drone Program', 'Pentagon Papers', 'Budget Audits'],
        ai_stance: 'Project Maven and Replicator Initiative: Integrating AI into weapons systems, logistics, and decision-making. Aiming for "algorithmic warfare" dominance.',
        active_directives: [
            { title: 'Replicator Initiative', description: 'Fielding thousands of autonomous systems across multiple domains.', link: 'https://www.defense.gov/News/News-Stories/Article/Article/3508936/hicks-announces-replicator-initiative-to-counter-chinas-military-buildup/' },
            { title: 'JADC2', description: 'Joint All-Domain Command and Control: Connecting sensors from all branches into a unified network.', link: 'https://www.defense.gov/News/News-Stories/Article/Article/2964002/dod-releases-jadc2-implementation-plan/' }
        ],
        classified_annex: {
            codename: 'SKYNET',
            shadow_budget: '$50B+ (Black)',
            unacknowledged_projects: ['TR-3B Aurora', 'Rod from God'],
            deep_fact: 'The DOD is the world\'s largest employer, with over 2.8 million employees.'
        }
    },
    DHS: {
        name: 'Department of Homeland Security',
        acronym: 'DHS',
        founded: '2002',
        headquarters: 'Washington, D.C.',
        director: 'Alejandro Mayorkas',
        budget: '$60 Billion',
        mission: 'Secure the nation from the many threats we face. This requires the dedication of more than 240,000 employees in jobs that range from aviation and border security to emergency response.',
        mission_url: 'https://www.dhs.gov/mission',
        jurisdiction: 'Domestic Security, Borders, Cybersecurity',
        special_units: ['Secret Service', 'ICE', 'TSA', 'CISA'],
        known_associates: ['FBI', 'Local Police', 'FEMA', 'Coast Guard'],
        focus: ['Counterterrorism', 'Border Security', 'Cybersecurity', 'Disaster Response'],
        controversies: ['Border Policies', 'Surveillance', 'TSA Screening'],
        ai_stance: 'Using AI for border surveillance, threat detection, and analyzing travel data. CISA leads the effort in protecting critical infrastructure from AI-enabled threats.',
        active_directives: [
            { title: 'AI Safety and Security Board', description: 'Advising on the safe and secure development and deployment of AI.', link: 'https://www.dhs.gov/news/2024/04/26/dhs-announces-establishment-artificial-intelligence-safety-and-security-board' },
            { title: 'Border Security Tech', description: 'Deploying autonomous surveillance towers and AI-driven biometric processing.', link: 'https://www.dhs.gov/science-and-technology/border-security-technology' }
        ],
        classified_annex: {
            codename: 'EAGLE EYE',
            shadow_budget: '$2.5B (Black)',
            unacknowledged_projects: ['Biometric Entry-Exit Program', 'Project HOSTILE INTENT'],
            deep_fact: 'DHS was created in response to the September 11 attacks and absorbed 22 different federal agencies.'
        }
    },
    'State Dept': {
        name: 'Department of State',
        acronym: 'DOS',
        founded: '1789',
        headquarters: 'Harry S Truman Building, D.C.',
        director: 'Antony Blinken',
        budget: '$58 Billion',
        mission: 'Protect and promote U.S. security, prosperity, and democratic values and shape an international environment in which all Americans can thrive.',
        mission_url: 'https://www.state.gov/about/',
        jurisdiction: 'Foreign Policy & Diplomacy',
        special_units: ['Diplomatic Security Service (DSS)', 'Bureau of Intelligence and Research (INR)'],
        known_associates: ['CIA', 'USAID', 'Foreign Ministries'],
        focus: ['Diplomacy', 'Foreign Aid', 'Counterterrorism', 'Human Rights'],
        controversies: ['Benghazi Attack', 'Email Server Scandal', 'WikiLeaks Cables'],
        ai_stance: 'Leveraging AI to analyze global sentiment, predict conflicts, and streamline visa processing. Establishing norms for responsible state behavior in cyberspace and AI.',
        active_directives: [
            { title: 'Enterprise AI Strategy', description: 'Harnessing AI to empower diplomacy and development.', link: 'https://www.state.gov/enterprise-artificial-intelligence-strategy-fy-2024-2025/' },
            { title: 'Cyber Diplomacy', description: 'Building international coalitions to promote an open, interoperable, secure, and reliable cyberspace.', link: 'https://www.state.gov/bureaus-offices/deputy-secretary-of-state/bureau-of-cyberspace-and-digital-policy/' }
        ],
        classified_annex: {
            codename: 'FOGGY BOTTOM',
            shadow_budget: '$500M (Black)',
            unacknowledged_projects: ['Embassy Spy Posts', 'Operation MOCKINGBIRD II'],
            deep_fact: 'The Bureau of Intelligence and Research (INR) is the State Department\'s own intelligence agency and is one of the smallest but most respected members of the IC.'
        }
    },
    'White House': {
        name: 'The White House (NSC)',
        acronym: 'NSC',
        founded: '1947',
        headquarters: '1600 Pennsylvania Avenue',
        director: 'Jake Sullivan (NSA)',
        budget: 'N/A (Executive Office)',
        mission: 'Advise and assist the President on national security and foreign policies.',
        mission_url: 'https://www.whitehouse.gov/nsc/',
        jurisdiction: 'National Security Policy Coordination',
        special_units: ['Situation Room', 'Cyber Directorate'],
        known_associates: ['All Agencies'],
        focus: ['Policy Strategy', 'Crisis Management', 'Interagency Coordination'],
        controversies: ['Iran-Contra', 'Watergate'],
        ai_stance: 'Setting the national agenda for AI safety, security, and trustworthiness. Issued Executive Order on Safe, Secure, and Trustworthy Artificial Intelligence.',
        active_directives: [
            { title: 'Executive Order on AI', description: 'Comprehensive directive to manage the risks of AI while seizing its promise.', link: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/' }
        ],
        classified_annex: {
            codename: 'CROWN JEWEL',
            shadow_budget: 'Classified',
            unacknowledged_projects: ['Presidential Emergency Action Documents (PEADs)'],
            deep_fact: 'The National Security Council is the President\'s principal forum for considering national security and foreign policy matters.'
        }
    },
    Treasury: {
        name: 'Department of the Treasury',
        acronym: 'USDT',
        founded: '1789',
        headquarters: 'Washington, D.C.',
        director: 'Janet Yellen',
        budget: '$16 Billion',
        mission: 'Maintain a strong economy and create economic and job opportunities by promoting the conditions that enable economic growth and stability at home and abroad.',
        mission_url: 'https://home.treasury.gov/about/role-of-the-treasury',
        jurisdiction: 'Finance, Tax, Sanctions',
        special_units: ['Office of Foreign Assets Control (OFAC)', 'FinCEN', 'IRS-CI'],
        known_associates: ['Federal Reserve', 'IMF', 'World Bank'],
        focus: ['Economic Sanctions', 'Terrorist Financing', 'Financial Intelligence'],
        controversies: ['2008 Bailouts', 'Sanctions Evasion'],
        ai_stance: 'Using AI to detect money laundering, fraud, and sanctions evasion. Monitoring the use of AI in the financial sector for stability risks.',
        active_directives: [
            { title: 'AI in Financial Services', description: 'Managing risks and opportunities of AI in the financial sector.', link: 'https://home.treasury.gov/news/press-releases/jy2429' }
        ],
        classified_annex: {
            codename: 'GOLDEN KEY',
            shadow_budget: '$300M (Black)',
            unacknowledged_projects: ['SWIFT Surveillance', 'Operation CHOKEPOINT'],
            deep_fact: 'The Treasury Department operates the Office of Terrorism and Financial Intelligence (TFI), which marshals the department\'s intelligence and enforcement functions.'
        }
    }
};

export default function USIntelPage() {
    const [activeAgency, setActiveAgency] = useState<string>('ALL');
    const [viewMode, setViewMode] = useState<'FEED' | 'DOSSIER'>('FEED');
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const observerTarget = useRef(null);

    // Derived State for Brief
    const topStories = feedItems.slice(0, 5);
    const briefArticles = useMemo(() => topStories.map(item => ({
        id: item.link,
        title: item.title,
        summary: item.contentSnippet,
        source: item.source,
        url: item.link,
        publishedAt: item.pubDate,
        category: 'intelligence' as const,
        topicSlug: 'us-intel',
        importanceScore: 10
    })), [topStories]);

    // Fetch Feed
    const fetchFeed = useCallback(async (pageNum: number, isInitial: boolean = false) => {
        // Allow initial load to proceed even if loading is true (since we init loading to true)
        if ((loading && !isInitial) || (!hasMore && !isInitial) || error) return;

        try {
            if (isInitial) {
                setLoading(true);
                setError(false);
            } else {
                setLoadingMore(true);
            }

            // In a real app, we would fetch from our API
            // const res = await fetch(`/api/feed/us-intel?agency=${activeAgency}&page=${pageNum}`);
            // const data = await res.json();

            // For now, simulating fetch with the existing API route logic or mock
            const res = await fetch(`/api/feed/us-intel?agency=${activeAgency}&page=${pageNum}&limit=15`);

            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();

            if (data.items) {
                if (isInitial) {
                    setFeedItems(data.items);
                } else {
                    setFeedItems(prev => [...prev, ...data.items]);
                }
                setHasMore(data.hasMore);
            }
        } catch (error) {
            console.error('Failed to fetch intel feed:', error);
            setHasMore(false);
            setError(true);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeAgency, loading, hasMore, error]);

    // Initial Load & Agency Change
    // Initial Load & Agency Change
    useEffect(() => {
        setPage(1);
        setFeedItems([]);
        setHasMore(true);
        setError(false);
        fetchFeed(1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeAgency]);

    // Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && !error) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchFeed(nextPage);
                        return nextPage;
                    });
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading, error, fetchFeed]);

    const activeProfile = activeAgency !== 'ALL' ? AGENCY_PROFILES[activeAgency] : null;

    // Filter top stories for alerts (mock logic for now, or derived from feed)
    const priorityAlerts = feedItems.filter(item =>
        item.title.toLowerCase().includes('alert') ||
        item.title.toLowerCase().includes('urgent') ||
        item.title.toLowerCase().includes('breaking') ||
        item.novai_analysis?.includes('CRITICAL')
    ).slice(0, 5);



    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-3">
                        <Shield size={32} className="text-blue-600" />
                        US INTELLIGENCE
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Real-time aggregation of open-source intelligence and official reports from major US national security agencies.
                    </p>
                </div>

                {/* AGENCY SELECTOR (Horizontal Segmented Control) */}
                {/* MAIN CONTENT GRID - 3 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px]">

                    {/* LEFT COLUMN: Agency Selector (Span 3) */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <Target size={14} className="text-blue-600" />
                                    Select Agency
                                </h3>
                            </div>
                            <div className="p-2 flex flex-col gap-1">
                                <button
                                    onClick={() => setActiveAgency('ALL')}
                                    className={`px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-between group ${activeAgency === 'ALL'
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Globe size={16} className={activeAgency === 'ALL' ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-600'} />
                                        <span>Global Wire</span>
                                    </div>
                                    {activeAgency === 'ALL' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                                </button>

                                <div className="h-px bg-slate-100 my-1 mx-2"></div>

                                {Object.entries(AGENCY_PROFILES).map(([key, profile]) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveAgency(key)}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${activeAgency === key
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'bg-transparent text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* We could add specific icons for agencies here if we had them */}
                                            <Shield size={16} className={activeAgency === key ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-600'} />
                                            <span>{profile.name}</span>
                                        </div>
                                        {activeAgency === key && <ChevronRight size={14} className="text-slate-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Warning / Context */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                            <div className="flex items-start gap-3">
                                <ShieldAlert size={16} className="text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-bold text-blue-900 mb-1">Data Classification: UNCLASSIFIED / OSINT</h4>
                                    <p className="text-[10px] text-blue-700 leading-relaxed">
                                        You are viewing a real-time aggregation of unclassified and declassified intelligence streams.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER COLUMN: Main Feed / Dossier (Span 6) */}
                    <div className="lg:col-span-6 flex flex-col gap-6">

                        {/* Monthly Brief (Top Stories) - Only show on Global Wire */}
                        {activeAgency === 'ALL' && topStories.length > 0 && (
                            <div className="mb-6">
                                {/* Brief removed as per user request until fixed */}
                            </div>
                        )}

                        {/* Content Header */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                {activeAgency === 'ALL' ? (
                                    <div className="flex items-center gap-2">
                                        <Radio size={18} className="text-red-600 animate-pulse" />
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                            Live Intelligence Stream
                                        </h2>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <FileText size={18} className="text-blue-600" />
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                            Agency Dossier & Live Feed: {AGENCY_PROFILES[activeAgency]?.name}
                                        </h2>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                LIVE
                            </div>
                        </div>

                        {/* Dossier View (Shown ABOVE feed when agency selected) */}
                        {activeAgency !== 'ALL' && activeProfile && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                                {/* Header */}
                                <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Shield className="text-white" size={20} />
                                        <h2 className="text-white font-bold tracking-wider uppercase text-sm">
                                            AGENCY DOSSIER: {activeProfile.name}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                                            {activeProfile.acronym}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Column: Core Stats */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mission</h3>
                                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                    {activeProfile.mission}
                                                </p>
                                                <a href={activeProfile.mission_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1">
                                                    Official Mission Statement <ArrowUpRight size={10} />
                                                </a>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Director</div>
                                                    <div className="text-xs font-bold text-slate-900">{activeProfile.director}</div>
                                                </div>
                                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Budget</div>
                                                    <div className="text-xs font-bold text-slate-900 font-mono">{activeProfile.budget}</div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Jurisdiction</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200">
                                                        {activeProfile.jurisdiction}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Deep Dive */}
                                        <div className="space-y-6">
                                            {/* AI Stance */}
                                            {activeProfile.ai_stance && (
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                    <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <BrainCircuit size={14} />
                                                        AI Stance & Strategy
                                                    </h3>
                                                    <p className="text-xs text-blue-900 leading-relaxed">
                                                        {activeProfile.ai_stance}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Active Directives (Real Links) */}
                                            {activeProfile.active_directives && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <Target size={14} />
                                                        Active Directives
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {activeProfile.active_directives.map((directive, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={directive.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block p-3 bg-white rounded border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                                                            >
                                                                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                                                                    {directive.title}
                                                                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                                                                    {directive.description}
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeAgency !== 'ALL' && activeProfile && (
                            <div className="bg-amber-50 rounded-xl border border-amber-100 p-6 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-amber-100 opacity-50 rotate-12">
                                    <Lock size={100} />
                                </div>
                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <Lock size={18} className="text-amber-600" />
                                    <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Classified Annex</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <div>
                                        <div className="text-[10px] font-bold text-amber-600 uppercase mb-1">Project Codename</div>
                                        <div className="font-mono text-lg font-bold text-amber-900">{activeProfile.classified_annex?.codename}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-amber-600 uppercase mb-1">Black Budget Estimate</div>
                                        <div className="font-mono text-lg font-bold text-amber-900">{activeProfile.classified_annex?.shadow_budget}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] font-bold text-amber-600 uppercase mb-1">Unacknowledged Projects</div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeProfile.classified_annex?.unacknowledged_projects.map(p => (
                                                <span key={p} className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Feed Content (ALWAYS SHOWN) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                            {loading && feedItems.length === 0 ? (
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
                                        <div key={`${item.link}-${i}`} className="p-6 hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.source === 'CIA' ? 'bg-blue-100 text-blue-700' :
                                                        item.source === 'FBI' ? 'bg-red-100 text-red-700' :
                                                            item.source === 'NSA' ? 'bg-emerald-100 text-emerald-700' :
                                                                item.source === 'DOD' ? 'bg-slate-800 text-white' :
                                                                    'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {item.source}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400">
                                                        {new Date(item.pubDate).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                {item.novai_analysis && (
                                                    <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 flex items-center gap-1">
                                                        <BrainCircuit size={10} />
                                                        NOVAI ANALYSIS
                                                    </span>
                                                )}
                                            </div>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group-hover:translate-x-1 transition-transform duration-300">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                    {item.contentSnippet}
                                                </p>
                                            </a>
                                        </div>
                                    ))}
                                    {/* Infinite Scroll Target */}
                                    <div ref={observerTarget} className="p-4 flex justify-center">
                                        {loadingMore && <Loader2 size={20} className="animate-spin text-slate-400" />}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Status & Brief (Span 3) */}
                    <div className="lg:col-span-3 flex flex-col gap-6">

                        {/* System Status */}
                        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="text-emerald-400" size={20} />
                                <span className="text-xs font-bold tracking-[0.2em] text-slate-400">SYSTEM STATUS</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-slate-400">UPLINK</span>
                                    <span className="text-xs font-bold text-emerald-400">ESTABLISHED</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-slate-400">UPDATE RATE</span>
                                    <span className="text-xs font-bold text-emerald-400">REAL-TIME</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-slate-400">ENCRYPTION</span>
                                    <span className="text-xs font-bold text-emerald-400">AES-256</span>
                                </div>
                            </div>
                        </div>

                        {/* Priority Alerts - Only show if there are alerts */}
                        {priorityAlerts.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Siren size={14} className="text-red-500" />
                                        Priority Alerts
                                    </h3>
                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">LIVE</span>
                                </div>
                                <div className="space-y-3">
                                    {priorityAlerts.map((alert, idx) => (
                                        <a key={idx} href={alert.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-red-50 rounded border border-red-100 hover:border-red-200 transition-colors">
                                            <div className="text-xs font-bold text-red-800 mb-1 line-clamp-2">{alert.title}</div>
                                            <div className="text-[10px] text-red-600 flex justify-between">
                                                <span>{alert.agency}</span>
                                                <span>{new Date(alert.pubDate).toLocaleTimeString()}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 30-Day Brief - Removed as per user request until fixed */}

                    </div>
                </div>
            </div>
        </div>
    );
}
