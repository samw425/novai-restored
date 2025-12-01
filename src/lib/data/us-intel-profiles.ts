export const AGENCY_PROFILES = {
    FBI: {
        name: 'Federal Bureau of Investigation',
        acronym: 'FBI',
        founded: '1908',
        headquarters: 'J. Edgar Hoover Building, D.C.',
        director: 'Christopher Wray (OFFICIAL)',
        budget: '$10.8 Billion (FY2024)',
        mission: 'Protect the American people and uphold the Constitution of the United States.',
        mission_url: 'https://www.fbi.gov/about/mission',
        jurisdiction: 'Domestic (United States) & International (via Legal Attachés)',
        special_units: ['Cyber Action Team (CAT)', 'National Cyber Investigative Joint Task Force', 'Behavioral Analysis Unit (BAU)'],
        known_associates: ['CISA', 'NSA', 'Interpol', 'Europol'],
        ai_stance: "Aggressive defense of US Intellectual Property. The FBI views AI model theft by state actors as a primary economic security threat.",
        active_directives: [
            {
                title: 'Operation: Model Weight Guard',
                description: 'Counter-intelligence initiative to prevent the exfiltration of proprietary LLM weights from US labs to foreign adversaries.',
                link: 'https://www.fbi.gov/investigate/counterintelligence/the-china-threat'
            },
            {
                title: 'Deepfake Detection Task Force',
                description: 'Developing forensic capabilities to identify AI-generated content used in foreign influence operations.',
                link: 'https://www.fbi.gov/investigate/cyber'
            }
        ],
        controversies: [
            {
                title: 'Section 702 Usage',
                description: 'Ongoing debate regarding the querying of US person data within foreign intelligence databases without warrants.',
                link: 'https://www.fbi.gov/services/records-management/foipa'
            }
        ],
        key_personnel: [
            { name: "Christopher Wray", role: "Director" },
            { name: "Paul Abbate", role: "Deputy Director" }
        ],
        classified_annex: {
            codename: "FIDELITY",
            shadow_budget: "Undisclosed (est. $500M+ Black Budget)",
            unacknowledged_projects: [
                "DCSNet (Digital Collection System Network)",
                "Magic Lantern (Keystroke Logger)",
                "CIPAV (Computer and Internet Protocol Address Verifier)"
            ],
            deep_fact: "The FBI maintains a secret fleet of surveillance aircraft registered to shell companies that circle major US cities daily, collecting cell site simulator data.",
            source_url: "https://www.fbi.gov/services/records-management/foipa"
        }
    },
    CIA: {
        name: 'Central Intelligence Agency',
        acronym: 'CIA',
        founded: '1947',
        headquarters: 'Langley, Virginia',
        director: 'William J. Burns',
        budget: '$15 Billion+ (Est.)',
        mission: 'Preempt threats and further US national security objectives by collecting intelligence that matters.',
        mission_url: 'https://www.cia.gov/about/mission-vision/',
        jurisdiction: 'Foreign Intelligence (No Domestic Police Powers)',
        special_units: ['Special Activities Center (SAC)', 'Information Operations Center (IOC)', 'Directorate of Digital Innovation'],
        known_associates: ['NSA', 'NRO', 'MI6', 'DGSE', 'Mossad'],
        ai_stance: "Offensive and Defensive AI utilization. Developing 'Maverick' class models to process signal intelligence and predict geopolitical instability.",
        active_directives: [
            {
                title: 'Directorate of Digital Innovation',
                description: 'Accelerating the integration of Artificial Intelligence into all-source analysis to predict global flashpoints.',
                link: 'https://www.cia.gov/about/organization/directorate-of-digital-innovation/'
            },
            {
                title: 'Project: Sparrow (AI)',
                description: 'Automated OSINT gathering system designed to process millions of social media data points in real-time.',
                link: 'https://www.cia.gov/stories/'
            }
        ],
        controversies: [
            {
                title: 'Vault 7 Leaks',
                description: 'WikiLeaks release revealing CIA zero-day exploits for smartphones, smart TVs, and vehicle control systems.',
                link: 'https://wikileaks.org/ciav7p1/'
            }
        ],
        key_personnel: [
            { name: "William J. Burns", role: "Director" },
            { name: "David S. Cohen", role: "Deputy Director" }
        ],
        classified_annex: {
            codename: "NOCTURNE",
            shadow_budget: "$2.3 Billion (Black Budget Est.)",
            unacknowledged_projects: [
                "Sentient (AI Satellite Tasking)",
                "HIVE (Multi-platform Malware Suite)",
                "Weeping Angel (Smart TV Surveillance)"
            ],
            deep_fact: "The CIA's venture capital arm, In-Q-Tel, was an early investor in Keyhole (now Google Earth) and continues to fund classified AI startups.",
            source_url: "https://www.iqt.org/"
        }
    },
    NSA: {
        name: 'National Security Agency',
        acronym: 'NSA',
        founded: '1952',
        headquarters: 'Fort Meade, Maryland',
        director: 'Gen. Timothy Haugh',
        budget: '$10 Billion+ (Classified)',
        mission: 'Lead the US Government in cryptology that encompasses both Signals Intelligence (SIGINT) and Cybersecurity.',
        mission_url: 'https://www.nsa.gov/about/mission-values/',
        ai_stance: "The NSA is the primary driver of AI security standards for the DOD, focusing on 'AI Security Centers' to protect against adversarial ML attacks.",
        active_directives: [
            {
                title: 'Post-Quantum Cryptography',
                description: 'Urgent transition of all US National Security Systems to quantum-resistant algorithms (CNSA 2.0) before "Q-Day".',
                link: 'https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/'
            },
            {
                title: 'Zero Trust Implementation',
                description: 'Hardening of DOD networks against lateral movement. Assumption that perimeter is already breached.',
                link: 'https://www.nsa.gov/Cybersecurity/Zero-Trust-Cloud-Security/'
            },
            {
                title: 'Election Security 2024',
                description: 'Monitoring foreign influence operations and attempts to penetrate voting infrastructure. "Hunt Forward" teams deployed to allied nations.',
                link: 'https://www.nsa.gov/Cybersecurity/Election-Security/'
            }
        ],
        controversies: [
            {
                title: 'PRISM / Snowden Leaks (2013)',
                description: 'Revelation of mass surveillance program collecting internet communications from major US tech companies without individual warrants.',
                link: 'https://www.nsa.gov/Help/FOIA/Declassified-Documents/Snowden-Documents/'
            },
            {
                title: 'EternalBlue Exploit Loss',
                description: 'NSA-developed cyber weapon was stolen by Shadow Brokers and used by North Korea for the WannaCry ransomware attack, causing billions in global damage.',
                link: 'https://en.wikipedia.org/wiki/EternalBlue'
            },
            {
                title: 'Project SHAMROCK (1945-1975)',
                description: 'Interception of all telegraphic data entering or exiting the United States. Precursor to modern bulk collection.',
                link: 'https://www.nsa.gov/Help/FOIA/Declassified-Documents/Project-SHAMROCK/'
            }
        ],
        key_personnel: [
            { name: 'Gen. Timothy Haugh', role: 'Director', notes: 'Dual-hatted as Commander of US Cyber Command.' },
            { name: 'George C. Barnes', role: 'Deputy Director', notes: 'Civilian leader of the agency.' }
        ],
        classified_annex: {
            codename: "ECHELON",
            shadow_budget: "Unknown (Black Budget)",
            unacknowledged_projects: [
                "Room 641A (AT&T Intercept)",
                "XKeyscore (Global Internet Search)",
                "MUSCULAR (Data Center Taps)"
            ],
            deep_fact: "The NSA is the largest employer of mathematicians in the United States and consumes as much electricity as the city of Annapolis.",
            source_url: "https://www.nsa.gov/Help/FOIA/"
        }
    },
    DHS: {
        name: 'Dept. of Homeland Security',
        acronym: 'DHS',
        founded: '2002',
        headquarters: 'St. Elizabeths, D.C.',
        director: 'Alejandro Mayorkas',
        budget: '$60.4 Billion (FY2024)',
        mission: 'Secure the nation from the many threats we face. This requires the dedication of more than 240,000 employees.',
        mission_url: 'https://www.dhs.gov/mission',
        jurisdiction: 'US Borders, Ports, Transportation, & Cyber Infrastructure',
        ai_stance: "Deploying AI for border surveillance (autonomous towers) and using LLMs to analyze cargo manifests for contraband.",
        special_units: ['Border Patrol Tactical Unit (BORTAC)', 'Federal Air Marshals', 'Secret Service CAT', 'CISA Hunt and Incident Response Teams'],
        known_associates: ['TSA', 'FEMA', 'Coast Guard', 'ICE', 'CBP'],
        active_directives: [
            {
                title: 'Southwest Border Enforcement',
                description: 'Deployment of autonomous surveillance towers and increased processing capacity to manage migration flows.',
                link: 'https://www.cbp.gov/border-security'
            },
            {
                title: 'Critical Infrastructure Defense',
                description: 'CISA initiative to shield water, power, and hospital systems from ransomware. "Shields Up" posture remains active.',
                link: 'https://www.cisa.gov/shields-up'
            },
            {
                title: 'Counter-Fentanyl',
                description: 'Operation Blue Lotus: Surge in scanning technology at Ports of Entry to detect precursor chemicals and finished pills.',
                link: 'https://www.dhs.gov/news/2023/03/21/dhs-launches-operation-blue-lotus-stop-fentanyl-border'
            }
        ],
        controversies: [
            {
                title: 'Disinformation Governance Board (2022)',
                description: 'Short-lived advisory board criticized as a "Ministry of Truth". Paused and dissolved after intense public backlash regarding free speech concerns.',
                link: 'https://www.dhs.gov/news/2022/08/24/dhs-terminates-disinformation-governance-board'
            },
            {
                title: 'Family Separations (2018)',
                description: 'Zero-tolerance policy resulting in the separation of thousands of children from parents at the border. Declared a failure of humanitarian standards.',
                link: 'https://oig.dhs.gov/sites/default/files/assets/2020-01/OIG-20-06-Nov19.pdf'
            },
            {
                title: 'Portland Protests (2020)',
                description: 'Deployment of BORTAC agents to Portland, Oregon. Controversy over unmarked vehicles and detention of protesters without probable cause.',
                link: 'https://www.gao.gov/products/gao-21-235'
            }
        ],
        key_personnel: [
            { name: 'Alejandro Mayorkas', role: 'Secretary', notes: 'Facing ongoing political impeachment inquiries.' },
            { name: 'Jen Easterly', role: 'Director, CISA', notes: 'Leads civilian cyber defense.' }
        ],
        classified_annex: {
            codename: "HOMELAND",
            shadow_budget: "N/A",
            unacknowledged_projects: [
                "Operation Sentinel (Border Surveillance)",
                "Social Media Monitoring (Domestic)",
                "Biometric Entry/Exit Program"
            ],
            deep_fact: "DHS has the authority to seize electronic devices within 100 miles of any US border (which includes most major coastal cities) without a warrant.",
            source_url: "https://www.dhs.gov/privacy"
        }
    }
};
