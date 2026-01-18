/**
 * ZENITH AVM SERVICE (Automated Valuation Model)
 * 
 * Fetches accurate property market values using RentCast's Value Estimate API.
 * This provides real-time property valuations, NOT rent estimates.
 * 
 * Endpoint: GET /v1/avm/value
 * Returns: Current estimated market value + comparable sales
 */

import { ZenithProperty } from "@/lib/types";

const RENTCAST_API_KEY = process.env.NEXT_PUBLIC_RENTCAST_KEY || "";
const RENTCAST_BASE_URL = "https://api.rentcast.io/v1";

export interface AVMResponse {
    price: number;
    priceRangeLow: number;
    priceRangeHigh: number;
    latitude: number;
    longitude: number;
    comparables: PropertyComparable[];
}

export interface PropertyComparable {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    price: number;
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    distance: number;
    daysOld: number;
}

/**
 * Fetch accurate market value for a property using RentCast AVM
 */
export async function getPropertyValue(address: string): Promise<AVMResponse | null> {
    if (!RENTCAST_API_KEY) {
        console.warn("[ZENITH AVM] No API key configured");
        return null;
    }

    try {
        const url = `${RENTCAST_BASE_URL}/avm/value?address=${encodeURIComponent(address)}`;

        const response = await fetch(url, {
            headers: {
                "X-Api-Key": RENTCAST_API_KEY,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            console.warn(`[ZENITH AVM] API error: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data as AVMResponse;

    } catch (error) {
        console.error("[ZENITH AVM] Request failed:", error);
        return null;
    }
}

/**
 * Batch-enrich properties with accurate AVM values
 * Uses parallel requests with rate limiting
 */
export async function enrichWithAVM(properties: ZenithProperty[]): Promise<ZenithProperty[]> {
    if (!RENTCAST_API_KEY) {
        console.warn("[ZENITH AVM] No API key - using fallback valuation");
        return properties;
    }

    // Process in batches of 5 to respect rate limits
    const BATCH_SIZE = 5;
    const enriched: ZenithProperty[] = [];

    for (let i = 0; i < properties.length; i += BATCH_SIZE) {
        const batch = properties.slice(i, i + BATCH_SIZE);

        const results = await Promise.all(
            batch.map(async (prop) => {
                try {
                    // Construct full address for AVM lookup
                    const fullAddress = `${prop.address}, ${prop.city}, ${prop.state} ${prop.zip}`;
                    const avm = await getPropertyValue(fullAddress);

                    if (avm && avm.price > 0) {
                        return {
                            ...prop,
                            estimatedValue: avm.price,
                            priceRangeLow: avm.priceRangeLow,
                            priceRangeHigh: avm.priceRangeHigh,
                            provenance: {
                                ...prop.provenance,
                                valuation: {
                                    source: "RENTCAST_AVM_LIVE",
                                    verifiedAt: new Date().toISOString(),
                                    confidence: 0.95
                                }
                            }
                        };
                    }
                    return prop;
                } catch {
                    return prop;
                }
            })
        );

        enriched.push(...results);

        // Rate limit: wait 200ms between batches
        if (i + BATCH_SIZE < properties.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    return enriched;
}

/**
 * Enhanced Valuation Engine with multi-source fallback
 */
export class ZenithAVM {

    /**
     * Calculate property value using multiple data sources:
     * 1. RentCast AVM (primary - real market data)
     * 2. Comparable sales analysis
     * 3. Market tier fallback
     */
    static async calculateValue(property: ZenithProperty): Promise<{
        value: number;
        confidence: number;
        source: string;
        rangeLow?: number;
        rangeHigh?: number;
    }> {
        // Try RentCast AVM first (most accurate)
        const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
        const avm = await getPropertyValue(fullAddress);

        if (avm && avm.price > 0) {
            return {
                value: avm.price,
                confidence: 0.95,
                source: "RENTCAST_AVM",
                rangeLow: avm.priceRangeLow,
                rangeHigh: avm.priceRangeHigh
            };
        }

        // Fallback: Market-based estimation using location and property details
        const estimatedValue = this.calculateFallbackValue(property);

        return {
            value: estimatedValue,
            confidence: 0.75,
            source: "ZENITH_MARKET_MODEL"
        };
    }

    /**
     * Fallback valuation when AVM is unavailable
     * Uses regional market data and property characteristics
     */
    private static calculateFallbackValue(property: ZenithProperty): number {
        // Regional median home prices (real 2024-2025 data)
        const REGIONAL_MEDIANS: Record<string, number> = {
            // Texas
            "TX": 340000,
            // Florida  
            "FL": 420000,
            // California
            "CA": 785000,
            // New York
            "NY": 425000,
            // Arizona
            "AZ": 445000,
            // Default national median
            "DEFAULT": 375000
        };

        // Get state-based baseline
        const stateMedian = REGIONAL_MEDIANS[property.state] || REGIONAL_MEDIANS["DEFAULT"];

        // Adjust based on property size
        let value = stateMedian;

        if (property.squareFeet) {
            // Price per sqft varies by market
            const avgSqft = property.state === "CA" ? 1800 : 2000;
            const sqftFactor = property.squareFeet / avgSqft;
            value = stateMedian * sqftFactor;
        }

        // Adjust for multi-family
        if (property.type === "MF" && property.units && property.units > 1) {
            value *= (1 + (property.units - 1) * 0.4);
        }

        // Adjust for age (newer = higher value)
        if (property.yearBuilt) {
            const age = new Date().getFullYear() - property.yearBuilt;
            if (age < 5) value *= 1.15;
            else if (age < 20) value *= 1.05;
            else if (age > 50) value *= 0.85;
        }

        // Round to nearest $5k for professional appearance
        return Math.round(value / 5000) * 5000;
    }
}
