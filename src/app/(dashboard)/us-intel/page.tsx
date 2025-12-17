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
        director: 'John Ratcliffe',
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
        },
        education_dossier: `The Central Intelligence Agency (CIA) is the civilian foreign intelligence service of the federal government of the United States, officially tasked with gathering, processing, and analyzing national security information from around the world, primarily through the use of human intelligence (HUMINT).

        Established in 1947 with the signing of the National Security Act by President Harry S. Truman, the CIA grew out of the World War II-era Office of Strategic Services (OSS). It is the only agency authorized by law to carry out covert action at the behest of the President.

        The agency is organized into five main directorates:
        • **Directorate of Operations (DO):** Responsible for the clandestine collection of foreign intelligence.
        • **Directorate of Analysis (DA):** Responsible for analyzing and interpreting intelligence.
        • **Directorate of Science and Technology (DS&T):** Creates and applies innovative technology.
        • **Directorate of Support (DS):** Provides administrative and logistical support.
        • **Directorate of Digital Innovation (DDI):** Focused on cyber intelligence and digital threats.`,
        official_links: [
            { title: 'CIA News & Statements', url: 'https://www.cia.gov/stories/', description: 'Official agency updates and stories.' },
            { title: 'Freedom of Information Act (FOIA)', url: 'https://www.cia.gov/readingroom/home', description: 'Declassified documents archive.' },
            { title: 'Center for the Study of Intelligence', url: 'https://www.cia.gov/resources/csi/', description: 'Historical analysis and lessons learned.' }
        ],
        issues_discrepancies: `**Historical Controversies:**
        The CIA has been involved in numerous controversial activities, including the 1953 Iranian coup d'état, the 1954 Guatemalan coup, and the MKUltra mind control program.

        **Modern Concerns:**
        • **Enhanced Interrogation Techniques:** Post-9/11 programs drew significant criticism and legal challenges regarding the use of torture.
        • **Drone Warfare:** The targeted killing program has faced scrutiny over civilian casualties and due process.
        • **Surveillance:** Allegations of domestic surveillance, though officially outside its charter, continue to surface in debates about privacy and security.`,
        novai_analysis: [
            {
                title: 'Shift to Great Power Competition',
                date: '2025-11-15',
                type: 'Strategic Shift',
                content: 'The agency is fundamentally restructuring its human intelligence networks to pivot from counter-terrorism to hard target penetration in China and Russia. This involves a massive recruitment drive for Mandarin and Russian speakers and a new focus on technological espionage.'
            },
            {
                title: 'The "Maisey" LLM Initiative',
                date: '2025-10-02',
                type: 'Tech Intel',
                content: 'Internal reports suggest the CIA\'s custom LLM "Maisey" has achieved a breakthrough in cross-referencing disjointed OSINT data points, successfully predicting three major geopolitical shifts in the last quarter before they occurred.'
            }
        ]
    },
    FBI: {
        name: 'Federal Bureau of Investigation',
        acronym: 'FBI',
        founded: '1908',
        headquarters: 'Washington, D.C.',
        director: 'Kash Patel',
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
        },
        education_dossier: `The Federal Bureau of Investigation (FBI) is the domestic intelligence and security service of the United States and its principal federal law enforcement agency. It operates under the jurisdiction of the Department of Justice.

        Founded in 1908 as the Bureau of Investigation, the FBI has evolved from a small force of special agents to a massive organization with jurisdiction over more than 200 categories of federal crimes.

        **Dual Mission:**
        Unlike the CIA, the FBI has both intelligence and law enforcement responsibilities. It works to protect the U.S. from terrorism, espionage, and cyber attacks, while also combating significant violent crime and public corruption.

        **Key Capabilities:**
        • **Criminal Justice Information Services (CJIS):** The largest division, providing data and analytics to law enforcement.
        • **Laboratory Division:** One of the largest and most comprehensive crime labs in the world.
        • **Critical Incident Response Group (CIRG):** Handles crisis management, hostage rescue, and behavioral analysis.`,
        official_links: [
            { title: 'FBI Most Wanted', url: 'https://www.fbi.gov/wanted', description: 'Fugitives and missing persons.' },
            { title: 'Internet Crime Complaint Center (IC3)', url: 'https://www.ic3.gov/', description: 'Report cyber crime and fraud.' },
            { title: 'Uniform Crime Reporting (UCR)', url: 'https://ucr.fbi.gov/', description: 'National crime statistics and data.' }
        ],
        issues_discrepancies: `**Surveillance & Privacy:**
        The FBI has faced criticism for its use of FISA warrants and the surveillance of U.S. citizens. The "Section 702" debate highlights the tension between national security and privacy rights.

        **Historical Legacy:**
        Under J. Edgar Hoover, the COINTELPRO program targeted domestic political organizations, leaving a legacy of mistrust among civil rights groups.

        **Politicization Allegations:**
        In recent years, the Bureau has faced accusations of political bias in its investigations, challenging its reputation for neutrality.`,
        novai_analysis: [
            {
                title: 'Quantum-Resistant Encryption Standards',
                date: '2025-12-01',
                type: 'Cyber Defense',
                content: 'The FBI is coordinating with NIST to enforce new quantum-resistant cryptographic standards across all federal law enforcement databases, anticipating "Q-Day" (the day quantum computers break current encryption) within the decade.'
            },
            {
                title: 'AI-Enhanced Biometrics Rollout',
                date: '2025-09-20',
                type: 'Surveillance',
                content: 'The Next Generation Identification (NGI) system is receiving a controversial upgrade. New AI algorithms claim to identify suspects from partial face data in low-resolution CCTV footage with 99.8% accuracy, raising significant privacy concerns.'
            }
        ]
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
        },
        education_dossier: `The National Security Agency (NSA) is a national-level intelligence agency of the United States Department of Defense, under the authority of the Director of National Intelligence. The NSA is responsible for global monitoring, collection, and processing of information and data for foreign and domestic intelligence and counterintelligence purposes, specializing in a discipline known as signals intelligence (SIGINT).

        **Core Missions:**
        • **Signals Intelligence (SIGINT):** Intercepting and analyzing foreign communications.
        • **Cybersecurity:** Protecting U.S. government communications and information systems.

        **Technological Leadership:**
        The NSA is the largest employer of mathematicians in the United States and possesses some of the world's most powerful supercomputers. It plays a critical role in the development of cryptographic standards and cyber defense strategies.`,
        official_links: [
            { title: 'NSA Research', url: 'https://www.nsa.gov/Research/', description: 'Innovations in math and cyber.' },
            { title: 'National Cryptologic Museum', url: 'https://www.nsa.gov/museum/', description: 'History of codebreaking.' },
            { title: 'Central Security Service (CSS)', url: 'https://www.nsa.gov/About/CSS/', description: 'Combat support arm.' }
        ],
        issues_discrepancies: `**Mass Surveillance:**
        The 2013 disclosures by Edward Snowden revealed the extent of the NSA's global surveillance programs, including PRISM and the collection of metadata on U.S. citizens, sparking a worldwide debate on privacy.

        **Encryption Backdoors:**
        The agency has been criticized for allegedly attempting to weaken encryption standards to facilitate surveillance, which critics argue undermines global internet security.`,
        novai_analysis: [
            {
                title: 'Post-Quantum Cryptography Breakthrough',
                date: '2025-11-30',
                type: 'Cryptography',
                content: 'NSA mathematicians have released a new suite of public-key algorithms designed to secure classified networks against future quantum computer attacks. This move signals a high confidence in the imminence of quantum decryption capabilities.'
            },
            {
                title: 'Zero-Trust Architecture Mandate',
                date: '2025-10-15',
                type: 'Policy',
                content: 'The NSA is aggressively pushing a "Zero Trust" security model across the DOD, assuming that no network perimeter is secure and requiring continuous verification for every user and device.'
            }
        ]
    },
    DOD: {
        name: 'Department of Defense',
        acronym: 'DOD',
        founded: '1947',
        headquarters: 'The Pentagon',
        director: 'Pete Hegseth (SecDef)',
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
        },
        education_dossier: `The Department of Defense (DOD) is an executive branch department of the federal government charged with coordinating and supervising all agencies and functions of the government directly related to national security and the United States Armed Forces.

        **Structure:**
        Headquartered at the Pentagon, the DOD is the largest employer in the world. It oversees the Army, Navy, Marine Corps, Air Force, and Space Force.

        **Command Structure:**
        • **The Secretary of Defense:** The principal defense policy advisor to the President.
        • **The Joint Chiefs of Staff:** The highest-ranking military officers who advise the President and Secretary.
        • **Unified Combatant Commands:** 11 geographic or functional commands (e.g., CENTCOM, CYBERCOM) that conduct military operations.`,
        official_links: [
            { title: 'Defense.gov News', url: 'https://www.defense.gov/News/', description: 'Official news and press releases.' },
            { title: 'Joint Chiefs of Staff', url: 'https://www.jcs.mil/', description: 'Senior military leadership.' },
            { title: 'DARPA', url: 'https://www.darpa.mil/', description: 'Defense Advanced Research Projects Agency.' }
        ],
        issues_discrepancies: `**Financial Accountability:**
        The DOD has famously failed multiple independent financial audits, with trillions of dollars in assets and spending often unaccounted for or difficult to track.

        **Procurement Controversies:**
        Major weapons programs, such as the F-35 Lightning II, have faced criticism for massive cost overruns and technical delays.

        **The "Revolving Door":**
        Critics point to the seamless movement of high-ranking officials between the Pentagon and major defense contractors as a potential conflict of interest.`,
        novai_analysis: [
            {
                title: 'Replicator Initiative Acceleration',
                date: '2025-11-10',
                type: 'Autonomous Warfare',
                content: 'The "Replicator" program, aimed at fielding thousands of cheap, autonomous drones, has entered Phase 2. The focus is now on "swarm intelligence," allowing these systems to coordinate attacks without human intervention.'
            },
            {
                title: 'Space Force Integration',
                date: '2025-08-22',
                type: 'Space Domain',
                content: 'DOD is finalizing the integration of Space Force assets into the JADC2 network, ensuring that satellite data can be fed directly to tactical units on the ground in real-time.'
            }
        ]
    },
    DHS: {
        name: 'Department of Homeland Security',
        acronym: 'DHS',
        founded: '2002',
        headquarters: 'Washington, D.C.',
        director: 'Kristi Noem',
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
        },
        education_dossier: `The Department of Homeland Security (DHS) was created in response to the September 11 attacks, integrating 22 different federal departments and agencies into a unified cabinet agency.

        **Mission Scope:**
        DHS has a broad mandate that includes border security, customs, emergency management, and cybersecurity.

        **Key Components:**
        • **Customs and Border Protection (CBP):** Secures the border and facilitates trade.
        • **Immigration and Customs Enforcement (ICE):** Enforces immigration laws within the U.S.
        • **Cybersecurity and Infrastructure Security Agency (CISA):** Protects critical infrastructure from physical and cyber threats.
        • **Transportation Security Administration (TSA):** Secures the nation's transportation systems.`,
        official_links: [
            { title: 'CISA Alerts', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories', description: 'Critical cyber warnings.' },
            { title: 'FEMA', url: 'https://www.fema.gov/', description: 'Emergency management.' },
            { title: 'Ready.gov', url: 'https://www.ready.gov/', description: 'Disaster preparedness.' }
        ],
        issues_discrepancies: `**Border Management:**
        DHS faces constant political and logistical challenges regarding the management of the southern border and the treatment of migrants.

        **Civil Liberties:**
        Agencies like TSA and ICE have faced criticism over invasive screening procedures and detention practices.`,
        novai_analysis: [
            {
                title: 'Biometric Entry/Exit Expansion',
                date: '2025-11-05',
                type: 'Surveillance',
                content: 'DHS is expanding its facial recognition program to 20 new international airports. The goal is to have 97% of all air travelers scanned biometrically by 2026, eliminating the need for physical boarding passes.'
            },
            {
                title: 'AI-Driven Threat Detection',
                date: '2025-09-12',
                type: 'Homeland Security',
                content: 'CISA has deployed a new AI system to monitor critical infrastructure for "pre-attack indicators." The system analyzes patterns in power grid fluctuations and water system data to detect cyber-physical attacks.'
            }
        ]
    },
    'State Dept': {
        name: 'Department of State',
        acronym: 'DOS',
        founded: '1789',
        headquarters: 'Harry S Truman Building',
        director: 'Marco Rubio',
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
        },
        education_dossier: `The Department of State (DOS) is the oldest executive department, responsible for the nation's foreign policy and international relations. It represents the U.S. at the United Nations and operates embassies and consulates worldwide.

        **Diplomatic Functions:**
        • **Foreign Service:** Corps of diplomats who represent U.S. interests abroad.
        • **Visa & Passport Services:** Managing travel documents for citizens and visitors.
        • **Treaty Negotiation:** Crafting international agreements on trade, arms control, and human rights.`,
        official_links: [
            { title: 'Travel Advisories', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html/', description: 'Safety ratings for every country.' },
            { title: 'Foreign Service Institute', url: 'https://www.state.gov/bureaus-offices/under-secretary-for-management/foreign-service-institute/', description: 'Diplomatic training.' },
            { title: 'ShareAmerica', url: 'https://share.america.gov/', description: 'Public diplomacy platform.' }
        ],
        issues_discrepancies: `**Security Failures:**
        The 2012 Benghazi attack remains a significant point of controversy regarding the security of diplomatic outposts.

        **Bureaucracy:**
        The department is often criticized for its slow-moving bureaucracy and resistance to rapid policy shifts.`,
        novai_analysis: [
            {
                title: 'Digital Diplomacy Corps',
                date: '2025-10-30',
                type: 'Soft Power',
                content: 'State is launching a new "Digital Diplomacy" office tasked with countering disinformation campaigns on social media in real-time. This team will use AI to detect and flag state-sponsored narratives.'
            },
            {
                title: 'Arctic Strategy Update',
                date: '2025-07-14',
                type: 'Geopolitics',
                content: 'With the opening of new shipping lanes, the State Department is increasing its diplomatic presence in the Arctic Council to counter growing Russian and Chinese influence in the region.'
            }
        ]
    },
    'White House': {
        name: 'The White House (NSC)',
        acronym: 'NSC',
        founded: '1947',
        headquarters: '1600 Pennsylvania Avenue',
        director: 'Mike Waltz (NSA)',
        budget: 'N/A',
        mission: 'Advise and assist the President on national security and foreign policies.',
        mission_url: 'https://www.whitehouse.gov/nsc/',
        jurisdiction: 'Policy Coordination',
        ai_stance: 'Setting the national agenda for AI safety, security, and trustworthiness. Issued Executive Order on Safe, Secure, and Trustworthy Artificial Intelligence.',
        active_directives: [
            { title: 'Executive Order 14179', description: 'Removing Barriers to American Leadership in Artificial Intelligence.', link: 'https://www.federalregister.gov/presidential-documents/executive-orders' }
        ],
        classified_annex: {
            codename: 'CROWN JEWEL',
            shadow_budget: 'Classified',
            unacknowledged_projects: ['PEADs']
        },
        education_dossier: `The National Security Council (NSC) is the President's principal forum for considering national security and foreign policy matters with senior national security advisors and cabinet officials.

        **Role & Function:**
        The NSC advises the President on the integration of domestic, foreign, and military policies relating to national security. It also facilitates cooperation between various government agencies.

        **The Situation Room:**
        Located in the West Wing, this intelligence management center is where the President monitors crises and conducts secure communications.`,
        official_links: [
            { title: 'White House Administration', url: 'https://www.whitehouse.gov/administration/', description: 'Council structure and leadership.' },
            { title: 'Executive Orders', url: 'https://www.federalregister.gov/presidential-documents/executive-orders', description: 'Presidential directives.' },
            { title: 'National Security Strategy', url: 'https://history.state.gov/milestones/1945-1952/nsc', description: 'Historical context and strategy.' }
        ],
        issues_discrepancies: `**Concentration of Power:**
        Critics argue that the NSC has grown too powerful, often bypassing the State Department and Defense Department in policy formulation ("The Imperial Presidency").

        **Lack of Oversight:**
        Unlike Cabinet officials, the National Security Advisor and NSC staff are not subject to Senate confirmation, raising accountability concerns.`,
        novai_analysis: [
            {
                title: 'AI Executive Order Implementation',
                date: '2025-11-20',
                type: 'Policy',
                content: 'The NSC is leading the interagency review of the AI Executive Order. Early drafts suggest strict new reporting requirements for any AI model that exceeds a certain compute threshold.'
            },
            {
                title: 'Pivot to the Pacific',
                date: '2025-08-05',
                type: 'Grand Strategy',
                content: 'A classified NSC memo outlines a 5-year plan to strengthen alliances in the Indo-Pacific. The strategy emphasizes "integrated deterrence" combining military, economic, and technological capabilities.'
            }
        ]
    },
    Treasury: {
        name: 'Department of the Treasury',
        acronym: 'USDT',
        founded: '1789',
        headquarters: 'Washington, D.C.',
        director: 'Scott Bessent',
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
        },
        education_dossier: `The Department of the Treasury plays a critical role in national security through its Office of Terrorism and Financial Intelligence (TFI). It leverages the U.S. financial system to combat rogue states, terrorist financiers, and proliferators of WMDs.

        **Financial Warfare:**
        • **Office of Foreign Assets Control (OFAC):** Administers and enforces economic and trade sanctions.
        • **FinCEN:** Combats money laundering and terrorist financing.

        **Economic Statecraft:**
        The Treasury uses the dominance of the U.S. dollar to impose crippling costs on adversaries without firing a shot.`,
        official_links: [
            { title: 'Sanctions List (SDN)', url: 'https://sanctionssearch.ofac.treas.gov/', description: 'Search blocked persons and entities.' },
            { title: 'FinCEN', url: 'https://www.fincen.gov/', description: 'Financial Crimes Enforcement Network.' },
            { title: 'Treasury International Capital', url: 'https://home.treasury.gov/data/treasury-international-capital-tic-system', description: 'Cross-border financial data.' }
        ],
        issues_discrepancies: `**Sanctions Impact:**
        There is ongoing debate about the humanitarian impact of broad economic sanctions on civilian populations in targeted countries.

        **Dollar Weaponization:**
        Aggressive use of financial sanctions has led some nations to seek alternatives to the U.S. dollar, potentially threatening its status as the global reserve currency.`,
        novai_analysis: [
            {
                title: 'Crypto-Sanctions Enforcement',
                date: '2025-12-02',
                type: 'Financial Intel',
                content: 'Treasury\'s OFAC has sanctioned three major cryptocurrency mixers used by North Korean hackers. This marks a significant escalation in the effort to cut off illicit revenue streams for rogue states.'
            },
            {
                title: 'Digital Dollar Pilot',
                date: '2025-09-18',
                type: 'Economic Policy',
                content: 'The Federal Reserve and Treasury are quietly advancing a pilot program for a Central Bank Digital Currency (CBDC). The goal is to maintain the dollar\'s dominance in an increasingly digitized global economy.'
            }
        ]
    },
    ODNI: {
        name: 'Office of the Director of National Intelligence',
        acronym: 'ODNI',
        founded: '2005',
        headquarters: 'McLean, Virginia',
        director: 'Tulsi Gabbard',
        budget: '$70 Billion (NIP)',
        mission: 'Lead and integrate the Intelligence Community to deliver the most insightful intelligence possible.',
        mission_url: 'https://www.dni.gov/index.php/who-we-are/mission-vision',
        jurisdiction: 'Intelligence Integration',
        ai_stance: 'Orchestrating the IC-wide adoption of AI. Focusing on "Augmented Intelligence" to handle the deluge of sensor data.',
        active_directives: [
            { title: 'IC Data Strategy', description: 'Unifying data architecture across all 18 agencies.', link: 'https://www.dni.gov/index.php/newsroom/reports-publications/reports-publications-2023/item/2386-ic-data-strategy-2023-2025' },
            { title: 'Election Security', description: 'Coordinating efforts to protect the integrity of democratic processes.', link: 'https://www.dni.gov/index.php/cyber-monitor' }
        ],
        classified_annex: {
            codename: 'OVERWATCH',
            shadow_budget: 'Classified',
            unacknowledged_projects: ['Project SENTINEL']
        },
        education_dossier: `The Director of National Intelligence (DNI) serves as the head of the U.S. Intelligence Community, overseeing and directing the implementation of the National Intelligence Program. The DNI acts as the principal intelligence advisor to the President, the National Security Council, and the Homeland Security Council.
        
        **Role:**
        The ODNI was established after 9/11 to coordinate information sharing among all intelligence agencies and prevent "intelligence failures" due to siloing.`,
        official_links: [
            { title: 'Annual Threat Assessment', url: 'https://www.dni.gov/index.php/newsroom/reports-publications', description: 'Top-level strategic analysis.' },
            { title: 'IC on the Record', url: 'https://icontherecord.tumblr.com/', description: 'Transparency initiative.' }
        ],
        issues_discrepancies: `**Bureaucratic Bloat:**
        Critics argue that the ODNI adds another layer of bureaucracy without operational control.
        
        **Politicization:**
        The role of the DNI has been scrutinized for potential politicization of intelligence assessments.`,
        novai_analysis: [
            {
                title: 'Declassification Push',
                date: '2025-12-15',
                type: 'Policy',
                content: 'DNI Gabbard has ordered a sweeping review of classification standards, aiming to "restore public trust" by releasing historical files on controversial programs.'
            },
            {
                title: 'IC Integration Audit',
                date: '2025-11-01',
                type: 'Reform',
                content: 'A new directive requires all agencies to share raw intelligence data in real-time, eliminating the "need-to-know" silos that previously hindered cooperation.'
            }
        ]
    },
    DOJ: {
        name: 'Department of Justice',
        acronym: 'DOJ',
        founded: '1870',
        headquarters: 'Robert F. Kennedy Building',
        director: 'Pam Bondi',
        budget: '$37 Billion',
        mission: 'Enforce the law and defend the interests of the United States according to the law.',
        mission_url: 'https://www.justice.gov/about',
        jurisdiction: 'Federal Law Enforcement',
        ai_stance: 'Aggressively monitoring AI monopolies. The Antitrust Division is using AI tools to analyze market concentration and algorithmic collusion.',
        active_directives: [
            { title: 'Project Breakwater', description: 'Major antitrust initiative targeting Big Tech monopolies.', link: 'https://www.justice.gov/atr' },
            { title: 'Algorithmic Accountability', description: 'Prosecuting companies using pricing algorithms to fix markets.', link: 'https://www.justice.gov/opa/pr/justice-department-sues-realpage-algorithmic-pricing-scheme' }
        ],
        classified_annex: {
            codename: 'GAVEL STRIKE',
            shadow_budget: '$150M (Grey)',
            unacknowledged_projects: ['Operation Clean Sweep']
        },
        education_dossier: `The Department of Justice (DOJ) is the federal executive department of the United States government tasked with the enforcement of federal law and administration of justice in the United States.

        **Antitrust Division:**
        The tip of the spear in the administration's war on corporate monopolies. The division has been significantly empowered to break up conglomerates that stifle innovation.

        **Key Components:**
        • **Federal Bureau of Investigation (FBI):** Operates under DOJ jurisdiction (though listed separately for Intel purposes).
        • **Drug Enforcement Administration (DEA):** Combats drug smuggling and distribution.
        • **U.S. Marshals Service:** Protects the judiciary and apprehends fugitives.`,
        official_links: [
            { title: 'Antitrust Division', url: 'https://www.justice.gov/atr', description: 'Promoting economic competition.' },
            { title: 'Press Releases', url: 'https://www.justice.gov/news', description: 'Official DOJ news.' },
            { title: 'Office of Legal Counsel', url: 'https://www.justice.gov/olc', description: 'Legal advice to the President.' }
        ],
        issues_discrepancies: `**Politicization Concerns:**
        Critics argue that the DOJ is being used as a weapon against political opponents, citing recent high-profile indictments.

        **Overreach:**
        Debates continue regarding the scope of federal law enforcement versus state sovereignty.`,
        novai_analysis: [
            {
                title: 'Big Tech Breakup Imminent',
                date: '2025-12-10',
                type: 'Antitrust',
                content: 'Sources indicate the DOJ is finalizing a landmark lawsuit aimed at breaking up a major AI conglomerate, citing "monopolization of compute resources."'
            },
            {
                title: 'RICO for Cartels',
                date: '2025-11-05',
                type: 'Law Enforcement',
                content: 'The AG has authorized the use of RICO statutes to target transnational criminal organizations involved in human trafficking, signaling a more aggressive posture.'
            }
        ]
    }
};

export default function USIntelPage() {
    const [activeAgency, setActiveAgency] = useState<string>('ALL');
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    // Infinite Scroll Observer
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Fetch Feed Logic
    const fetchFeed = useCallback(async (pageNum: number, isPolling = false) => {
        if (!isPolling) setLoading(true);
        try {
            const res = await fetch(`/api/feed/us-intel?agency=${activeAgency}&page=${pageNum}&limit=20`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            setFeedItems(prev => {
                if (pageNum === 1) {
                    // If polling (page 1), merge new items at the top
                    if (isPolling) {
                        const newItems = data.items.filter((newItem: any) =>
                            !prev.some(existingItem => existingItem.link === newItem.link)
                        );
                        return [...newItems, ...prev];
                    }
                    return data.items || [];
                }
                // If loading more pages, append to bottom
                return [...prev, ...(data.items || [])];
            });

            if (!isPolling) {
                setHasMore(data.hasMore);
            }
        } catch (error) {
            console.error("Feed fetch error:", error);
        } finally {
            if (!isPolling) setLoading(false);
        }
    }, [activeAgency]);

    // Initial Load & Agency Change
    useEffect(() => {
        setPage(1);
        setFeedItems([]);
        setHasMore(true);
        fetchFeed(1);
    }, [activeAgency]);

    // Load More Pages
    useEffect(() => {
        if (page > 1) {
            fetchFeed(page);
        }
    }, [page]);

    // Real-time Polling (every 15 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchFeed(1, true);
        }, 15000);
        return () => clearInterval(interval);
    }, [fetchFeed]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Agency Selector - Sticky Top */}
            <AgencySelector
                activeAgency={activeAgency}
                onSelect={setActiveAgency}
                agencies={AGENCY_PROFILES}
            />

            {/* Header */}
            <div className="bg-slate-900 text-white py-12 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[10px] text-slate-600 font-mono">v2025.12.04-LIVE</div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Dossier View (Sticky) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
                        {/* 30-DAY BRIEF REMOVED PER USER REQUEST */}

                        {activeAgency === 'ALL' ? (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                {/* Header */}
                                <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                                            <BrainCircuit className="text-white" size={18} />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Global Command</h2>
                                            <p className="text-[10px] text-slate-400 font-mono">US INTELLIGENCE COMMUNITY</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">System Online</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        You are viewing the <span className="font-bold text-slate-900">aggregated real-time feed</span> from the entire US Intelligence Community.
                                        Novai's neural engine is currently monitoring <span className="font-bold text-blue-600">109+ high-signal sources</span> for critical developments.
                                    </p>

                                    {/* Agency Grid Status */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {['ODNI', 'CIA', 'FBI', 'NSA', 'DOD', 'State Dept', 'DHS', 'DOJ'].map((agency) => (
                                            <div key={agency} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-700">{agency}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start">
                                        <div className="mt-0.5">
                                            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-blue-900 uppercase mb-1">Live Synthesis Active</h4>
                                            <p className="text-[11px] text-blue-700 leading-snug">
                                                Processing incoming signals. Select a specific agency above for detailed dossier view.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <DossierView
                                profile={AGENCY_PROFILES[activeAgency]}
                                latestFeedItem={feedItems.length > 0 ? feedItems[0] : undefined}
                            />
                        )}
                    </div>

                    {/* RIGHT COLUMN: Live Feed */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    Live Wire: {activeAgency === 'ALL' ? 'All Sources' : AGENCY_PROFILES[activeAgency]?.acronym}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">ENCRYPTED // REAL-TIME</span>
                                </div>
                            </div>

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
                                    {feedItems.map((item, i) => {
                                        const isLastElement = i === feedItems.length - 1;
                                        return (
                                            <div
                                                key={`${item.link}-${i}`}
                                                ref={isLastElement ? lastElementRef : null}
                                                className="p-8 hover:bg-slate-50 transition-colors group animate-in fade-in slide-in-from-bottom-2 duration-500"
                                            >
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
                                        );
                                    })}
                                    {loading && (
                                        <div className="p-8 flex justify-center">
                                            <Loader2 size={24} className="animate-spin text-slate-400" />
                                        </div>
                                    )}
                                    {!hasMore && feedItems.length > 0 && (
                                        <div className="p-8 text-center text-xs font-mono text-slate-400 uppercase tracking-widest">
                                            End of Intelligence Stream
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
