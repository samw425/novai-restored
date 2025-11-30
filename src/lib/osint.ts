import Parser from 'rss-parser';

const parser = new Parser();

export interface WarRoomIncident {
    id: string;
    type: 'earthquake' | 'cyber' | 'conflict' | 'outbreak' | 'naval' | 'air';
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    location: {
        lat: number;
        lng: number;
        region: string;
    };
    timestamp: string;
    source: string;
    url: string;
    country?: 'US' | 'RU' | 'CN' | 'IR' | 'UK' | 'OTHER';
    assetType?: string;
}

// USGS Earthquake Feed (Last hour, 2.5+ magnitude)
const USGS_FEED_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';

// CISA Cyber Alerts RSS
const CISA_RSS_URL = 'https://www.cisa.gov/uscert/ncas/alerts.xml';

// COMPREHENSIVE WORLDWIDE DEFENSE & SECURITY SOURCES
const CONFLICT_FEEDS = [
    // GLOBAL CONFLICT & INTEL (Google News Topics for Reliability)
    'https://news.google.com/rss/search?q=Ukraine+War&hl=en-US&gl=US&ceid=US:en', // Ukraine Conflict
    'https://news.google.com/rss/search?q=Gaza+Conflict&hl=en-US&gl=US&ceid=US:en', // Gaza/Israel
    'https://news.google.com/rss/search?q=South+China+Sea+Tension&hl=en-US&gl=US&ceid=US:en', // APAC Tension
    'https://news.google.com/rss/search?q=Sudan+Conflict&hl=en-US&gl=US&ceid=US:en', // Sudan
    'https://news.google.com/rss/search?q=Yemen+Houthi+Conflict&hl=en-US&gl=US&ceid=US:en', // Yemen
    'https://news.google.com/rss/search?q=Taiwan+Strait+Tension&hl=en-US&gl=US&ceid=US:en', // Taiwan
    'https://news.google.com/rss/search?q=North+Korea+Missile&hl=en-US&gl=US&ceid=US:en', // North Korea
    'https://news.google.com/rss/search?q=Iran+Nuclear+Tension&hl=en-US&gl=US&ceid=US:en', // Iran
    'https://news.google.com/rss/search?q=Somalia+Al-Shabaab&hl=en-US&gl=US&ceid=US:en', // Somalia
    'https://news.google.com/rss/search?q=Sahel+Region+Conflict&hl=en-US&gl=US&ceid=US:en', // Sahel/Africa
    'https://news.google.com/rss/search?q=Myanmar+Civil+War&hl=en-US&gl=US&ceid=US:en', // Myanmar
    'https://news.google.com/rss/search?q=Haiti+Gang+Violence&hl=en-US&gl=US&ceid=US:en', // Haiti
    'https://news.google.com/rss/search?q=Mexico+Cartel+Violence&hl=en-US&gl=US&ceid=US:en', // Mexico

    // NAVAL & AIR ASSETS (Fleet Tracking)
    'https://news.google.com/rss/search?q=US+Carrier+Strike+Group+Location&hl=en-US&gl=US&ceid=US:en', // US Carrier Locations
    'https://news.google.com/rss/search?q=Naval+Deployment+Update&hl=en-US&gl=US&ceid=US:en', // Global Naval Deployments
    'https://news.google.com/rss/search?q=Air+Force+Deployment&hl=en-US&gl=US&ceid=US:en', // Air Force Movements

    // AGENCY PROXIES (Intel & State Sources)
    'https://news.google.com/rss/search?q=CIA+Intelligence+Report&hl=en-US&gl=US&ceid=US:en', // CIA Proxy via News
    'https://news.google.com/rss/search?q=Mossad+Operation&hl=en-US&gl=US&ceid=US:en', // Mossad Proxy via News
    'https://news.google.com/rss/search?q=FSB+Russia+Security&hl=en-US&gl=US&ceid=US:en', // FSB Proxy via News
    'https://news.google.com/rss/search?q=MI6+Intelligence&hl=en-US&gl=US&ceid=US:en', // MI6 Proxy
    'https://news.google.com/rss/search?q=IDF+Military+Operation&hl=en-US&gl=US&ceid=US:en', // IDF Proxy
    'https://news.google.com/rss/search?q=Shin+Bet+Security&hl=en-US&gl=US&ceid=US:en', // Shin Bet Proxy
    'https://www.timesofisrael.com/feed/', // Times of Israel (Reliable regional source)
    'https://www.jpost.com/rss/rssfeedsheadlines.aspx', // Jerusalem Post

    // CYBER WARFARE & THREAT INTEL (Real-Time)
    'https://feeds.feedburner.com/TheHackersNews', // The Hacker News
    'https://www.bleepingcomputer.com/feed/',
    'https://threatpost.com/feed/',
    'https://news.google.com/rss/search?q=Cyberattack+Data+Breach&hl=en-US&gl=US&ceid=US:en', // General Cyber Alerts
    'https://news.google.com/rss/search?q=Ransomware+Attack&hl=en-US&gl=US&ceid=US:en', // Ransomware
    'https://news.google.com/rss/search?q=Nation+State+Cyber+Attack&hl=en-US&gl=US&ceid=US:en', // Nation State Cyber
    'https://www.cisa.gov/cybersecurity-advisories/all.xml', // CISA (Keep, usually good)

    // US DOMESTIC SECURITY (NEW & EXPANDED)
    'https://news.google.com/rss/search?q=US+Civil+Unrest+Protests&hl=en-US&gl=US&ceid=US:en', // Civil Unrest
    'https://news.google.com/rss/search?q=US+Border+Security+Crisis&hl=en-US&gl=US&ceid=US:en', // Border Security
    'https://news.google.com/rss/search?q=FBI+Breaking+News&hl=en-US&gl=US&ceid=US:en', // FBI
    'https://news.google.com/rss/search?q=DHS+Security+Alert&hl=en-US&gl=US&ceid=US:en', // DHS
    'https://news.google.com/rss/search?q=US+Mass+Shooting+Alert&hl=en-US&gl=US&ceid=US:en', // Shootings
    'https://news.google.com/rss/search?q=US+Police+Emergency&hl=en-US&gl=US&ceid=US:en', // Police Incidents
    'https://news.google.com/rss/search?q=US+Infrastructure+Attack&hl=en-US&gl=US&ceid=US:en', // Infrastructure
];

export async function fetchUSGSIncidents(): Promise<WarRoomIncident[]> {
    try {
        const response = await fetch(USGS_FEED_URL, { next: { revalidate: 300 } });
        const data = await response.json();

        return data.features.slice(0, 10).map((feature: any) => ({
            id: feature.id,
            type: 'earthquake',
            title: `M ${feature.properties.mag} Earthquake - ${feature.properties.place}`,
            description: `Detected at ${new Date(feature.properties.time).toLocaleTimeString()}`,
            severity: feature.properties.mag > 5 ? 'critical' : 'warning',
            location: {
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0],
                region: feature.properties.place
            },
            timestamp: new Date(feature.properties.time).toISOString(),
            source: 'USGS',
            url: feature.properties.url
        }));
    } catch (error) {
        console.error('Failed to fetch USGS data:', error);
        return [];
    }
}

export async function fetchCISAIncidents(): Promise<WarRoomIncident[]> {
    try {
        const feed = await parser.parseURL(CISA_RSS_URL);

        // Filter for RECENT incidents (last 60 days to ensure population)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const recentIncidents = feed.items.filter((item: any) => {
            const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
            return pubDate >= sixtyDaysAgo;
        });

        return recentIncidents.slice(0, 8).map((item: any) => ({
            id: item.guid || item.link,
            type: 'cyber',
            title: item.title,
            description: item.contentSnippet?.substring(0, 100) + '...',
            severity: 'warning', // Default for cyber alerts
            location: {
                lat: 38.9072, // Default to Washington DC for US Cyber alerts (visual proxy)
                lng: -77.0369,
                region: 'Global/US'
            },
            timestamp: item.pubDate || new Date().toISOString(),
            source: 'CISA',
            url: item.link
        }));
    } catch (error) {
        console.error('Failed to fetch CISA data:', error);
        return [];
    }
}

export async function fetchConflictIncidents(): Promise<WarRoomIncident[]> {
    try {
        const incidents: WarRoomIncident[] = [];

        // Fetch from defense/conflict RSS feeds
        for (const feedUrl of CONFLICT_FEEDS) {
            try {
                const feed = await parser.parseURL(feedUrl);

                // Filter for recent (last 14 days) - Relaxed from 7
                // BUT for specific "Agency" feeds, we allow a longer lookback (30 days) to ensure we get "Intel" hits
                const isAgencyFeed = feedUrl.includes('Mossad') || feedUrl.includes('CIA') || feedUrl.includes('FSB') || feedUrl.includes('IDF') || feedUrl.includes('Shin+Bet') || feedUrl.includes('MI6');

                const lookbackDays = isAgencyFeed ? 30 : 14;
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - lookbackDays);

                feed.items.forEach((item: any) => {
                    const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
                    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();

                    // Trust the feed source for relevance, but still filter out obvious noise if needed.
                    if (pubDate >= cutoffDate) {
                        // Keyword-based geocoding for better accuracy
                        const locationMap: Record<string, { lat: number, lng: number, region: string }> = {
                            'ukraine': { lat: 49.0, lng: 31.0, region: 'Ukraine' },
                            'kyiv': { lat: 50.4501, lng: 30.5234, region: 'Kyiv, Ukraine' },
                            'kharkiv': { lat: 49.9935, lng: 36.2304, region: 'Kharkiv, Ukraine' },
                            'odesa': { lat: 46.4825, lng: 30.7233, region: 'Odesa, Ukraine' },
                            'donbas': { lat: 48.0, lng: 38.0, region: 'Donbas, Ukraine' },
                            'russia': { lat: 55.7558, lng: 37.6173, region: 'Russia' },
                            'moscow': { lat: 55.7558, lng: 37.6173, region: 'Moscow, Russia' },
                            'kursk': { lat: 51.7303, lng: 36.1927, region: 'Kursk, Russia' },
                            'gaza': { lat: 31.5, lng: 34.4667, region: 'Gaza Strip' },
                            'rafah': { lat: 31.2968, lng: 34.2435, region: 'Rafah, Gaza' },
                            'israel': { lat: 31.0461, lng: 34.8516, region: 'Israel' },
                            'tel aviv': { lat: 32.0853, lng: 34.7818, region: 'Tel Aviv, Israel' },
                            'jerusalem': { lat: 31.7683, lng: 35.2137, region: 'Jerusalem' },
                            'west bank': { lat: 31.9522, lng: 35.2332, region: 'West Bank' },
                            'lebanon': { lat: 33.8547, lng: 35.8623, region: 'Lebanon' },
                            'beirut': { lat: 33.8938, lng: 35.5018, region: 'Beirut, Lebanon' },
                            'hezbollah': { lat: 33.8547, lng: 35.8623, region: 'Lebanon (South)' },
                            'yemen': { lat: 15.5527, lng: 48.5164, region: 'Yemen' },
                            'houthi': { lat: 15.5527, lng: 48.5164, region: 'Yemen' },
                            'red sea': { lat: 20.0, lng: 38.0, region: 'Red Sea' },
                            'iran': { lat: 32.4279, lng: 53.6880, region: 'Iran' },
                            'tehran': { lat: 35.6892, lng: 51.3890, region: 'Tehran, Iran' },
                            'iraq': { lat: 33.2232, lng: 43.6793, region: 'Iraq' },
                            'baghdad': { lat: 33.3152, lng: 44.3661, region: 'Baghdad, Iraq' },
                            'syria': { lat: 34.8021, lng: 38.9968, region: 'Syria' },
                            'damascus': { lat: 33.5138, lng: 36.2765, region: 'Damascus, Syria' },
                            'china': { lat: 35.8617, lng: 104.1954, region: 'China' },
                            'taiwan': { lat: 23.6978, lng: 120.9605, region: 'Taiwan' },
                            'taipei': { lat: 25.0330, lng: 121.5654, region: 'Taipei, Taiwan' },
                            'south china sea': { lat: 12.0, lng: 113.0, region: 'South China Sea' },
                            'philippines': { lat: 12.8797, lng: 121.7740, region: 'Philippines' },
                            'korea': { lat: 38.3, lng: 127.0, region: 'Korean Peninsula' },
                            'pyongyang': { lat: 39.0392, lng: 125.7625, region: 'Pyongyang, North Korea' },
                            'seoul': { lat: 37.5665, lng: 126.9780, region: 'Seoul, South Korea' },
                            'sudan': { lat: 12.8628, lng: 30.2176, region: 'Sudan' },
                            'khartoum': { lat: 15.5007, lng: 32.5599, region: 'Khartoum, Sudan' },
                            'somalia': { lat: 5.1521, lng: 46.1996, region: 'Somalia' },
                            'myanmar': { lat: 21.9162, lng: 95.9560, region: 'Myanmar' },
                            'haiti': { lat: 18.9712, lng: -72.2852, region: 'Haiti' },
                            'mexico': { lat: 23.6345, lng: -102.5528, region: 'Mexico' },
                            'cartel': { lat: 23.6345, lng: -102.5528, region: 'Mexico' },
                            'nato': { lat: 50.879, lng: 4.426, region: 'Brussels (NATO HQ)' },
                            'us': { lat: 38.9072, lng: -77.0369, region: 'USA' },
                            'usa': { lat: 38.9072, lng: -77.0369, region: 'USA' },
                            'washington': { lat: 38.9072, lng: -77.0369, region: 'Washington D.C.' },
                            'new york': { lat: 40.7128, lng: -74.0060, region: 'New York, USA' },
                            'california': { lat: 36.7783, lng: -119.4179, region: 'California, USA' },
                            'texas': { lat: 31.9686, lng: -99.9018, region: 'Texas, USA' },
                            'florida': { lat: 27.6648, lng: -81.5158, region: 'Florida, USA' },
                            'chicago': { lat: 41.8781, lng: -87.6298, region: 'Chicago, USA' },
                            'los angeles': { lat: 34.0522, lng: -118.2437, region: 'Los Angeles, USA' },
                            'pentagon': { lat: 38.8719, lng: -77.0563, region: 'The Pentagon' },
                            'fbi': { lat: 38.8951, lng: -77.0241, region: 'FBI HQ, USA' },
                            'border': { lat: 31.7619, lng: -106.4850, region: 'US-Mexico Border' }
                        };

                        let assignedLoc = { lat: 30.0, lng: 10.0, region: 'Global' }; // Default
                        let found = false;

                        for (const [key, loc] of Object.entries(locationMap)) {
                            if (text.includes(key)) {
                                assignedLoc = loc;
                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            // Agency-specific default locations (Fallback if no city found)
                            if (feedUrl.includes('Mossad') || feedUrl.includes('Shin+Bet') || feedUrl.includes('IDF') || feedUrl.includes('timesofisrael') || feedUrl.includes('jpost')) {
                                assignedLoc = { lat: 32.0853, lng: 34.7818, region: 'Israel (Intel)' };
                            } else if (feedUrl.includes('CIA') || feedUrl.includes('FBI')) {
                                assignedLoc = { lat: 38.9472, lng: -77.1461, region: 'Langley, USA' };
                            } else if (feedUrl.includes('FSB')) {
                                assignedLoc = { lat: 55.7558, lng: 37.6173, region: 'Moscow (Intel)' };
                            } else if (feedUrl.includes('MI6')) {
                                assignedLoc = { lat: 51.4872, lng: -0.1243, region: 'London (SIS)' };
                            } else if (text.includes('us') || text.includes('usa') || text.includes('america') || text.includes('biden') || text.includes('trump')) {
                                assignedLoc = { lat: 39.8283, lng: -98.5795, region: 'USA (General)' };
                            } else if (text.includes('cyber') || text.includes('hack') || text.includes('breach')) {
                                assignedLoc = { lat: 51.5074, lng: -0.1278, region: 'Global Cyber Threat' }; // Default to major hub or random
                            } else {
                                const fallbackLocations = [
                                    { lat: 31.5, lng: 34.5, region: 'Middle East' },
                                    { lat: 50.4, lng: 30.5, region: 'Eastern Europe' },
                                    { lat: 15.0, lng: 100.0, region: 'Southeast Asia' },
                                    { lat: 10.0, lng: 20.0, region: 'Africa' }
                                ];
                                assignedLoc = fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)];
                            }
                        }

                        // Determine source name for "Insider" styling
                        let sourceName = 'Defense News';
                        if (feedUrl.includes('Mossad')) sourceName = 'Mossad Proxy';
                        else if (feedUrl.includes('CIA')) sourceName = 'CIA Proxy';
                        else if (feedUrl.includes('FSB')) sourceName = 'FSB Proxy';
                        else if (feedUrl.includes('IDF')) sourceName = 'IDF Command';
                        else if (feedUrl.includes('Shin+Bet')) sourceName = 'Shin Bet';
                        else if (feedUrl.includes('MI6')) sourceName = 'MI6 Proxy';
                        else if (feedUrl.includes('timesofisrael')) sourceName = 'Times of Israel';
                        else if (feedUrl.includes('jpost')) sourceName = 'Jerusalem Post';
                        else if (item.source?.title) sourceName = item.source.title; // Use RSS source if available

                        // Determine Incident Type
                        let type = 'conflict';
                        if (text.includes('cyber') || text.includes('hack') || text.includes('breach') || text.includes('ransomware')) {
                            type = 'cyber';
                        } else if (text.includes('carrier') || text.includes('ship') || text.includes('vessel') || text.includes('navy') || text.includes('fleet') || text.includes('destroyer') || text.includes('submarine') || text.includes('maritime')) {
                            type = 'naval';
                        } else if (text.includes('bomber') || text.includes('fighter') || text.includes('air force') || text.includes('drone') || text.includes('uav') || text.includes('aircraft')) {
                            type = 'air';
                        }

                        // Determine Country & Asset Type
                        let country: WarRoomIncident['country'] = 'OTHER';
                        let assetType = 'Unknown Asset';

                        if (text.includes('us ') || text.includes('usa') || text.includes('navy') || text.includes('uss ') || text.includes('american')) country = 'US';
                        else if (text.includes('russia') || text.includes('moscow') || text.includes('admiral')) country = 'RU';
                        else if (text.includes('china') || text.includes('plan') || text.includes('type 0') || text.includes('beijing')) country = 'CN';
                        else if (text.includes('iran') || text.includes('irgc') || text.includes('tehran')) country = 'IR';
                        else if (text.includes('uk ') || text.includes('royal navy') || text.includes('hms ')) country = 'UK';

                        if (text.includes('carrier')) assetType = 'Aircraft Carrier';
                        else if (text.includes('submarine') || text.includes('sub ')) assetType = 'Submarine';
                        else if (text.includes('destroyer')) assetType = 'Destroyer';
                        else if (text.includes('frigate')) assetType = 'Frigate';
                        else if (text.includes('bomber')) assetType = 'Strategic Bomber';
                        else if (text.includes('fighter')) assetType = 'Fighter Jet';
                        else if (text.includes('drone') || text.includes('uav')) assetType = 'UAV / Drone';
                        else if (type === 'naval') assetType = 'Naval Vessel';
                        else if (type === 'air') assetType = 'Military Aircraft';

                        incidents.push({
                            id: item.guid || item.link || `conflict-${Date.now()}-${Math.random()}`,
                            type: type as WarRoomIncident['type'],
                            title: item.title,
                            description: item.contentSnippet?.substring(0, 150) + '...' || 'Defense and security update',
                            severity: text.includes('strike') || text.includes('attack') || text.includes('blast') || text.includes('nuclear') ? 'critical' : 'warning',
                            location: assignedLoc,
                            timestamp: item.pubDate || new Date().toISOString(),
                            source: sourceName,
                            url: item.link || '#',
                            country: country,
                            assetType: assetType
                        });
                    }
                });
            } catch (feedError) {
                console.error(`Failed to fetch conflict feed ${feedUrl}:`, feedError);
            }
        }

        // --- BALANCED FEED LOGIC ---
        // Bucket incidents by broad region to ensure diversity and prevent one conflict from dominating
        const buckets: Record<string, WarRoomIncident[]> = {
            'Europe': [],
            'MiddleEast': [],
            'Asia': [],
            'Africa': [],
            'Americas': [],
            'Cyber': [],
            'Other': []
        };

        incidents.forEach(inc => {
            const r = inc.location.region.toLowerCase();
            if (inc.type === 'cyber' || r.includes('cyber')) buckets['Cyber'].push(inc);
            else if (r.includes('ukraine') || r.includes('russia') || r.includes('europe') || r.includes('nato') || r.includes('kursk') || r.includes('moscow')) buckets['Europe'].push(inc);
            else if (r.includes('israel') || r.includes('gaza') || r.includes('lebanon') || r.includes('yemen') || r.includes('iran') || r.includes('iraq') || r.includes('syria') || r.includes('middle east') || r.includes('red sea')) buckets['MiddleEast'].push(inc);
            else if (r.includes('china') || r.includes('taiwan') || r.includes('korea') || r.includes('philippines') || r.includes('asia') || r.includes('myanmar')) buckets['Asia'].push(inc);
            else if (r.includes('sudan') || r.includes('somalia') || r.includes('africa') || r.includes('khartoum')) buckets['Africa'].push(inc);
            else if (r.includes('usa') || r.includes('us') || r.includes('america') || r.includes('mexico') || r.includes('haiti') || r.includes('washington') || r.includes('york') || r.includes('texas') || r.includes('florida') || r.includes('california')) buckets['Americas'].push(inc);
            else buckets['Other'].push(inc);
        });

        // Select top N from each bucket to ensure representation
        let balancedIncidents: WarRoomIncident[] = [];
        const QUOTA_PER_REGION = 15;

        Object.values(buckets).forEach(bucket => {
            // Sort each bucket by date first
            bucket.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            // Take top N
            balancedIncidents.push(...bucket.slice(0, QUOTA_PER_REGION));
        });

        // Final sort by date
        return balancedIncidents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
        console.error('Failed to fetch conflict data:', error);
        return [];
    }
}

export async function getWarRoomData(): Promise<WarRoomIncident[]> {
    const [cyber, conflicts] = await Promise.all([
        fetchCISAIncidents(),
        fetchConflictIncidents()
    ]);

    return [...cyber, ...conflicts].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}
