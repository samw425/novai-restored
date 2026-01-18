import { ZenithProperty } from "../types";

export interface VerificationResult {
    isValid: boolean;
    confidence: number;
    issues: string[];
    metadata: {
        hasPhotos: boolean;
        isOffMarket: boolean;
        dataSynergy: number; // 0-1
    };
}

/**
 * THE VERIFICATION AGENT
 * 
 * Audits Zenith records against institutional truth.
 * Ensures "Real Data, Real Photos, All Accuracy" parity.
 */
export class VerificationAgent {
    /**
     * Audit a single property record
     */
    static async auditProperty(property: ZenithProperty): Promise<VerificationResult> {
        const issues: string[] = [];
        let dataSynergy = 1.0;

        // 1. Photo Check
        const hasPhotos = !!(property.images && property.images.length > 0);
        if (!hasPhotos) {
            issues.push("MISSING_VISUAL_ANCHOR");
            dataSynergy -= 0.2;
        }

        // 2. Data Completeness Check
        if (!property.beds || !property.baths) {
            issues.push("INCOMPLETE_ASSET_SPECS");
            dataSynergy -= 0.1;
        }

        if (!property.estimatedValue || property.estimatedValue === 0) {
            issues.push("VALUATION_VOID");
            dataSynergy -= 0.3;
        }

        // 3. Provenance Check
        const confidence = property.provenance?.base?.confidence || 0;
        if (confidence < 0.8) {
            issues.push("LOW_PROVENANCE_TRUST");
            dataSynergy -= (1 - confidence);
        }

        // 4. Source Specific Rules
        if (property.id.startsWith("SOCRATA") && !property.distressSignal) {
            issues.push("UPLINK_DATA_MISMATCH");
            dataSynergy -= 0.2;
        }

        return {
            isValid: dataSynergy > 0.6,
            confidence: Math.max(0, dataSynergy),
            issues,
            metadata: {
                hasPhotos,
                isOffMarket: property.status === 'OFF_MARKET',
                dataSynergy: Math.max(0, dataSynergy)
            }
        };
    }

    /**
     * Batch audit a list of properties
     */
    static async auditBatch(properties: ZenithProperty[]): Promise<ZenithProperty[]> {
        const audited = await Promise.all(
            properties.map(async p => {
                const result = await this.auditProperty(p);
                return {
                    ...p,
                    verification: result
                };
            })
        );

        // SOVEREIGN MANDATE: ZERO CENSORSHIP
        // We return ALL properties. "Validity" is now a UI state, not a filter.
        return audited;
    }
}
