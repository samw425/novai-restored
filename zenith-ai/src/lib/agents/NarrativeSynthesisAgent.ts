import { ZenithProperty } from "../types";
import { RevenueAgent } from "./RevenueAgent";

/**
 * NARRATIVE SYNTHESIS AGENT
 * 
 * Transforms raw property data and alpha projections into human-readable 
 * institutional executive briefings.
 */
export class NarrativeSynthesisAgent {
    /**
     * Synthesize a high-level briefing for a property.
     */
    static async synthesizeBriefing(property: ZenithProperty): Promise<string> {
        const { address, estimatedValue, alpha, recon, type, motivationScore, equity, zip } = property;

        const equityPercent = estimatedValue > 0 ? (equity / estimatedValue) * 100 : 0;
        const isDistressed = motivationScore > 75;
        const isLuxury = estimatedValue > 1500000;
        const isLand = type === 'LAND';

        // 1. THE THESIS (The "Why")
        let thesis = "";
        if (isDistressed) {
            thesis = `High-priority distressed asset in Sector ${zip} showing immediate acquisition signals. `;
        } else if (equityPercent > 30) {
            thesis = `Deep-equity opportunity with ${Math.round(equityPercent)}% trapped value available for immediate capture. `;
        } else if (isLuxury) {
            thesis = `Institutional-grade luxury hold in a sovereign wealth corridor. `;
        } else if (isLand) {
            thesis = `Strategic land bank opportunity positioned for vertical development. `;
        } else {
            thesis = `Stabilized ${type} asset exhibiting steady yield characteristics. `;
        }

        // 2. THE EDGE (The "Advantage")
        let edge = "";
        if (recon && recon.zenithDelta > 5) {
            edge = `Zenith Sovereign Logic identifies a ${recon.zenithDelta}% valuation arbitrage vs consumer-grade estimates. `;
        } else if (alpha && alpha.momentumScore > 80) {
            edge = `Hyper-velocity market conditions suggest a pricing breakout within 6 months. `;
        } else {
            edge = `Sovereign provenance confirmed with ${Math.round(property.provenance.base.confidence * 100)}% data integrity. `;
        }

        // 3. THE DIRECTIVE (The "Action")
        let directive = "";
        const potentialFee = RevenueAgent.projectWholesaleFee(property);
        const feeString = potentialFee > 5000 ? ` (Est. Assignment Fee: $${potentialFee.toLocaleString()})` : "";

        if (alpha?.exitWindow) {
            directive = `Optimal exit vectors align for ${alpha.exitWindow} with ${alpha.projectedGrowth24mo}% projected uplift.${feeString}`;
        } else if (isDistressed) {
            directive = `Acquisition recommended below $${Math.round(estimatedValue * 0.85).toLocaleString()} to secure safety margin.${feeString}`;
        } else {
            directive = `Maintain watch status for off-market shift.${feeString}`;
        }

        return `${thesis}${edge}${directive}`;
    }

    /**
     * Batch synthesis for a collection of assets.
     */
    static async batchSynthesize(properties: ZenithProperty[]): Promise<ZenithProperty[]> {
        return Promise.all(
            properties.map(async p => {
                const briefing = await this.synthesizeBriefing(p);
                return {
                    ...p,
                    briefing
                };
            })
        );
    }
}
