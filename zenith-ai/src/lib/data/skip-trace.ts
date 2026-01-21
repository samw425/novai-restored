/**
 * ELITE SKIP TRACING SERVICE (Phase 3 - Professional Upgrade)
 * 
 * Multi-Provider Skip Trace with Caching & Credits:
 * 1. BatchSkipTracing API (Primary - high quality, ~$0.15/record)
 * 2. RealityMole (Secondary)
 * 3. OSINT Deep Links (Free fallback)
 */

import { supabase } from "../supabase/client";
import { CreditService } from "../credits/credit-service";
import { SkipTraceCache } from "./cache";

// ============== TYPE DEFINITIONS ==============

export interface SkipTraceResult {
    ownerName: string;
    mailingAddress?: string;
    phones: {
        number: string;
        type: 'MOBILE' | 'LANDLINE' | 'VOIP' | 'UNKNOWN';
        confidence: number;  // 0-1
        lastVerified?: string;
    }[];
    emails: {
        address: string;
        verified: boolean;
        type: 'PERSONAL' | 'WORK' | 'UNKNOWN';
    }[];
    relatives?: string[];
    source: 'BATCHSKIP_LIVE' | 'REALITYMOLE_LIVE' | 'CACHED' | 'OSINT_FALLBACK';
    creditCost: number;
    cached: boolean;
    timestamp: string;
}

export interface OwnerContact {
    phones: string[];
    emails: string[];
    source: string;
    externalLink?: string;
    ownerName?: string;
    osintLinks?: { name: string; url: string }[];
    skipTraceResult?: SkipTraceResult;
}

// ============== API CONFIGURATION ==============

const BATCHSKIP_KEY = process.env.NEXT_PUBLIC_BATCHSKIP_KEY || "";
const REALITYMOLE_KEY = process.env.NEXT_PUBLIC_REALITYMOLE_KEY || "";
const CACHE_TTL_DAYS = 90; // Cache valid for 90 days

// ============== MAIN SKIP TRACE FUNCTION ==============

/**
 * Professional skip trace with multi-provider fallback
 * Requires userId for credit deduction
 */
export async function revealOwnerContact(
    propertyId: string,
    ownerName?: string,
    address?: string,
    userId?: string
): Promise<OwnerContact | null> {

    // 1. DATA INTEGRITY CHECK
    if (!ownerName || ownerName.includes("PRIVILEGED") || ownerName.includes("CURRENT RESIDENT")) {
        console.warn("[ZENITH SKIP-TRACE] ABORTED: Owner Identity Redacted.");
        return generateOsintFallback(ownerName, address);
    }

    console.log(`[ZENITH SKIP-TRACE] Initiating deep search for ${ownerName}...`);

    try {
        // 2. CHECK CACHE FIRST (Free if cached)
        const cached = await checkSkipTraceCache(propertyId);
        if (cached) {
            console.log("[ZENITH SKIP-TRACE] CACHE HIT - Free lookup");
            return {
                phones: cached.phones.map(p => p.number),
                emails: cached.emails.map(e => e.address),
                source: "CACHED",
                ownerName: cached.ownerName,
                skipTraceResult: cached
            };
        }

        // 3. CHECK CREDITS (if no cache and user provided)
        if (userId) {
            const { canTrace, balance } = await CreditService.canSkipTrace(userId);
            if (!canTrace) {
                console.warn("[ZENITH SKIP-TRACE] INSUFFICIENT_CREDITS");
                return {
                    ...generateOsintFallback(ownerName, address),
                    source: "INSUFFICIENT_CREDITS"
                };
            }
        }

        // 4. TRY BATCHSKIPTRACING API (Primary Provider)
        if (BATCHSKIP_KEY && address) {
            const batchResult = await callBatchSkipTracingAPI(ownerName, address);
            if (batchResult && batchResult.phones.length > 0) {
                // Deduct credit on successful lookup
                if (userId) {
                    await CreditService.deduct(userId, 1, `Skip trace: ${address}`, propertyId);
                }
                // Cache the result
                await cacheSkipTraceResult(propertyId, batchResult);

                return {
                    phones: batchResult.phones.map(p => p.number),
                    emails: batchResult.emails.map(e => e.address),
                    source: "BATCHSKIP_LIVE",
                    ownerName: batchResult.ownerName,
                    skipTraceResult: batchResult
                };
            }
        }

        // 5. FALLBACK: RealityMole API
        if (REALITYMOLE_KEY && address) {
            const realityResult = await callRealityMoleAPI(ownerName, address);
            if (realityResult && (realityResult.phones.length > 0 || realityResult.emails.length > 0)) {
                if (userId) {
                    await CreditService.deduct(userId, 1, `Skip trace (RM): ${address}`, propertyId);
                }
                await cacheSkipTraceResult(propertyId, realityResult);

                return {
                    phones: realityResult.phones.map(p => p.number),
                    emails: realityResult.emails.map(e => e.address),
                    source: "REALITYMOLE_LIVE",
                    ownerName: realityResult.ownerName,
                    skipTraceResult: realityResult
                };
            }
        }

        // 6. FINAL FALLBACK: OSINT Links
        return generateOsintFallback(ownerName, address);

    } catch (err) {
        console.error("[ZENITH SKIP-TRACE] UPLINK FAILED", err);
        return generateOsintFallback(ownerName, address);
    }
}

// ============== API INTEGRATIONS ==============

/**
 * BatchSkipTracing API Integration
 * https://batchskiptracing.com/api
 */
async function callBatchSkipTracingAPI(ownerName: string, address: string): Promise<SkipTraceResult | null> {
    try {
        // Parse address components
        const parts = parseAddress(address);

        const response = await fetch('https://api.batchskiptracing.com/v1/skip', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BATCHSKIP_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: ownerName,
                address: parts.street,
                city: parts.city,
                state: parts.state,
                zip: parts.zip
            })
        });

        if (!response.ok) {
            console.warn('[SKIP-TRACE] BatchSkip API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.success && data.result) {
            return {
                ownerName: data.result.name || ownerName,
                mailingAddress: data.result.mailingAddress,
                phones: (data.result.phones || []).map((p: any) => ({
                    number: formatPhoneNumber(p.number),
                    type: p.lineType?.toUpperCase() || 'UNKNOWN',
                    confidence: p.score || 0.8,
                    lastVerified: p.lastSeen
                })),
                emails: (data.result.emails || []).map((e: any) => ({
                    address: e.address,
                    verified: e.verified || false,
                    type: e.type?.toUpperCase() || 'UNKNOWN'
                })),
                relatives: data.result.relatives || [],
                source: 'BATCHSKIP_LIVE',
                creditCost: 1,
                cached: false,
                timestamp: new Date().toISOString()
            };
        }

        return null;
    } catch (error) {
        console.error('[SKIP-TRACE] BatchSkip error:', error);
        return null;
    }
}

/**
 * RealityMole API Integration (Secondary Provider)
 */
async function callRealityMoleAPI(ownerName: string, address: string): Promise<SkipTraceResult | null> {
    try {
        const parts = parseAddress(address);

        const url = `https://api.realitymole.com/property/owner?address=${encodeURIComponent(parts.street)}&city=${encodeURIComponent(parts.city)}&state=${parts.state}`;

        const response = await fetch(url, {
            headers: { 'X-API-KEY': REALITYMOLE_KEY }
        });

        if (!response.ok) return null;

        const data = await response.json();

        if (data.phones || data.emails) {
            return {
                ownerName: data.ownerName || ownerName,
                phones: (data.phones || []).map((p: string) => ({
                    number: formatPhoneNumber(p),
                    type: 'UNKNOWN' as const,
                    confidence: 0.7
                })),
                emails: (data.emails || []).map((e: string) => ({
                    address: e,
                    verified: false,
                    type: 'UNKNOWN' as const
                })),
                source: 'REALITYMOLE_LIVE',
                creditCost: 1,
                cached: false,
                timestamp: new Date().toISOString()
            };
        }

        return null;
    } catch (error) {
        console.error('[SKIP-TRACE] RealityMole error:', error);
        return null;
    }
}

// ============== CACHING LAYER ==============

/**
 * Check cache for existing skip trace data
 */
async function checkSkipTraceCache(propertyId: string): Promise<SkipTraceResult | null> {
    // 1. Check localStorage first (fastest)
    const local = SkipTraceCache.get(propertyId);
    if (local) return local;

    // 2. Fallback to Supabase if available
    try {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('skip_trace_cache')
            .select('*')
            .eq('property_id', propertyId)
            .single();

        if (error || !data) return null;

        const result: SkipTraceResult = {
            ownerName: data.owner_name,
            mailingAddress: data.mailing_address,
            phones: JSON.parse(data.phones || '[]'),
            emails: JSON.parse(data.emails || '[]'),
            relatives: JSON.parse(data.relatives || '[]'),
            source: 'CACHED',
            creditCost: 0,
            cached: true,
            timestamp: data.created_at
        };

        // Populate local cache for next time
        SkipTraceCache.set(propertyId, result);
        return result;
    } catch (error) {
        return null;
    }
}

/**
 * Cache skip trace result for future lookups
 */
async function cacheSkipTraceResult(propertyId: string, result: SkipTraceResult): Promise<void> {
    // Save to localStorage (MVP Cache)
    SkipTraceCache.set(propertyId, result);

    // Save to Supabase (Global Cache)
    try {
        if (supabase) {
            await supabase.from('skip_trace_cache').upsert({
                property_id: propertyId,
                owner_name: result.ownerName,
                mailing_address: result.mailingAddress,
                phones: JSON.stringify(result.phones),
                emails: JSON.stringify(result.emails),
                relatives: JSON.stringify(result.relatives || []),
                source: result.source,
                created_at: new Date().toISOString()
            });
        }
    } catch (error) {
        console.warn('[SKIP-TRACE] Global cache sync failed:', error);
    }
}

// ============== HELPER FUNCTIONS ==============

/**
 * Generate OSINT fallback links when no paid data available
 */
function generateOsintFallback(ownerName?: string, address?: string): OwnerContact {
    const zip = address?.match(/\d{5}/)?.[0] || "";
    let govLink = "";

    // State-specific county appraiser links
    if (zip.startsWith('33') || zip.startsWith('34')) {
        govLink = `https://www.miamidade.gov/Apps/PA/propertysearch/#/`;
    } else if (zip.startsWith('90') || zip.startsWith('91')) {
        govLink = `https://portal.assessor.lacounty.gov/`;
    } else if (zip.startsWith('60')) {
        govLink = `https://www.cookcountyassessor.com/`;
    } else {
        govLink = `https://www.google.com/search?q=${encodeURIComponent((address || "") + " property appraiser")}`;
    }

    return {
        phones: [],
        emails: [],
        source: "OSINT_FALLBACK",
        externalLink: govLink,
        ownerName: ownerName || "View Official Record",
        osintLinks: [
            {
                name: "TruePeopleSearch",
                url: `https://www.truepeoplesearch.com/results?name=${encodeURIComponent(ownerName || "")}&citystatezip=${encodeURIComponent(address || "")}`
            },
            {
                name: "FastPeopleSearch",
                url: `https://www.fastpeoplesearch.com/name/${encodeURIComponent((ownerName || "").replace(/ /g, '-').toLowerCase())}`
            },
            {
                name: "Spokeo",
                url: `https://www.spokeo.com/${encodeURIComponent((ownerName || "").replace(/ /g, '-'))}`
            },
            {
                name: "WhitePages",
                url: `https://www.whitepages.com/name/${encodeURIComponent((ownerName || "").replace(/ /g, '-'))}`
            }
        ]
    };
}

/**
 * Parse address string into components
 */
function parseAddress(address: string): { street: string; city: string; state: string; zip: string } {
    // Expected format: "123 Main St, City, ST 12345"
    const parts = address.split(',').map(p => p.trim());
    const street = parts[0] || '';
    const city = parts[1] || '';
    const stateZip = parts[2] || '';

    const stateMatch = stateZip.match(/([A-Z]{2})/);
    const zipMatch = stateZip.match(/(\d{5})/);

    return {
        street,
        city,
        state: stateMatch?.[1] || '',
        zip: zipMatch?.[1] || ''
    };
}

/**
 * Format phone number to (XXX) XXX-XXXX
 */
function formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits[0] === '1') {
        return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone;
}

// ============== LEGACY EXPORT (backwards compatibility) ==============
export type { OwnerContact as LegacyOwnerContact };
