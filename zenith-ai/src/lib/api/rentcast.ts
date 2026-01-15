import { ZenithProperty } from "../data/mock-properties";

const RENTCAST_API_KEY = process.env.NEXT_PUBLIC_RENTCAST_KEY || "";

export interface RentCastProperty {
    id: string;
    formattedAddress: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    latitude: number;
    longitude: number;
    propertyType: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    lotSize?: number;
    yearBuilt?: number;
    lastSaleDate?: string;
    lastSalePrice?: number;
    taxAssessment?: {
        value: number;
        year: number;
    };
    owner?: {
        name?: string;
        type?: string;
    };
}

/**
 * Search for real properties using RentCast API.
 * Maps the response to our ZenithProperty interface.
 */
/**
 * Search for real properties using internal API Proxy (bypasses CORS).
 * Maps the response to our ZenithProperty interface.
 */
import { generatePropertiesForLocation } from "../data/nationwide-simulator";

/**
 * Search for real properties using internal API Proxy (bypasses CORS).
 * FALLBACK: If API fails or returns no data (e.g. no key), uses Simulator.
 */
export async function searchRentCastProperties(location: string): Promise<{ properties: ZenithProperty[], center: { lat: number, lng: number }, isSimulated?: boolean }> {
    try {
        // 1. Try Real Data
        const response = await fetch(`/api/properties?location=${encodeURIComponent(location)}`);

        // Check content type to avoid JSON parse errors
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid API Response (Not JSON)");
        }

        const data = await response.json();

        let validRealData = false;
        let finalProperties: ZenithProperty[] = [];
        let finalCenter = { lat: 39.8283, lng: -98.5795 };

        if (response.ok && !data.error && Array.isArray(data) && data.length > 0) {
            validRealData = true;

            // Transform Real Data
            finalProperties = data.map((p: RentCastProperty, index: number) => {
                const estimatedValue = p.taxAssessment?.value || p.lastSalePrice || 350000;
                // REAL ALGORITHM: Calculate metrics based on hard data points
                const today = new Date();
                const lastSale = p.lastSaleDate ? new Date(p.lastSaleDate) : new Date('2000-01-01');
                const yearsOwned = (today.getTime() - lastSale.getTime()) / (1000 * 60 * 60 * 24 * 365);

                // 1. Calculate Real Equity (Estimate - Last Sale)
                // If no last sale, assume high equity (owned free & clear or legacy)
                const impliedEquity = p.lastSalePrice ? (estimatedValue - p.lastSalePrice) : (estimatedValue * 0.8);
                const loanToValue = p.lastSalePrice ? (p.lastSalePrice / estimatedValue) : 0.2;

                // 2. Derive Motivation Score from Real Factors
                // Factors: High Equity (>50%), Long Ownership (>10y), Low Tax Value vs Market
                let score = 0;
                if (yearsOwned > 10) score += 30;
                if (yearsOwned > 20) score += 20;
                if (loanToValue < 0.5) score += 30; // High Equity
                if (!p.lastSaleDate) score += 20; // Likely inherited or long-held

                const finalScore = Math.min(score, 100);

                // 3. Determine Status Deterministically
                let status: ZenithProperty['status'] = "OFF_MARKET";
                // If they have owned it > 15 years and it has high equity, we flag as "ABSENTEE_LIKELY" logic
                if (yearsOwned > 15 && loanToValue < 0.4) status = "TAX_DELINQUENT"; // Placeholder for "High Equity Target"
                else if (loanToValue > 0.9) status = "PRE_FORECLOSURE"; // High leverage risk

                // Map 'Tax Delinquent' to our UI tag for High Motivation Targets (Real Data Interpretation)
                // We use the 'status' field to visualize the algorithmic finding.

                return {
                    id: p.id || `rc-${index}`,
                    address: p.formattedAddress || `${p.addressLine1}, ${p.city}`,
                    lat: p.latitude,
                    lng: p.longitude,
                    type: safeType(p.propertyType),
                    status: score > 75 ? 'TAX_DELINQUENT' : 'OFF_MARKET', // High Score = High Priority Target
                    motivationScore: finalScore,
                    estimatedValue,
                    equity: Math.floor(impliedEquity),
                    ownerType: safeOwner(p.owner?.type || ''),
                    lastSaleDate: p.lastSaleDate ? new Date(p.lastSaleDate).toISOString().split('T')[0] : "Unknown"
                };
            });

            // Calculate Center
            const avgLat = finalProperties.reduce((sum, p) => sum + p.lat, 0) / finalProperties.length;
            const avgLng = finalProperties.reduce((sum, p) => sum + p.lng, 0) / finalProperties.length;
            finalCenter = { lat: avgLat, lng: avgLng };
        }

        // 2. Return Real Data if successful
        if (validRealData) {
            console.log(`[RentCast] Found ${finalProperties.length} Real Properties`);
            return { properties: finalProperties, center: finalCenter, isSimulated: false };
        }

        // 3. Fallback to Simulator if Real Data failed
        console.warn("[RentCast] Real Data failed or empty. Engaging Simulator Fallback.");
        const simResult = generatePropertiesForLocation(location);
        return { ...simResult, isSimulated: true };

    } catch (error) {
        console.error("[RentCast] Search Exception, using Fallback:", error);
        // Default to Simulator on crash
        const simResult = generatePropertiesForLocation(location);
        return { ...simResult, isSimulated: true };
    }
}
