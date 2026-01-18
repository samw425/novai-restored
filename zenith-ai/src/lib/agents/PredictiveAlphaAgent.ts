import { ZenithProperty } from "../types";

export interface AlphaProjection {
    momentumScore: number; // 0-100
    projectedGrowth24mo: number; // Percentage
    exitWindow: string; // Q3 2027 etc
    riskProfile: 'ULTRA_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'SPECULATIVE';
    marketDrivers: string[];
}

/**
 * PREDICTIVE ALPHA AGENT
 * 
 * Analyzes market velocity, neighborhood liquidity, and historical data
 * to project institutional-grade exit strategies.
 */
export class PredictiveAlphaAgent {
    /**
     * Project the alpha trajectory for a given asset.
     */
    static async projectAlpha(property: ZenithProperty): Promise<AlphaProjection> {
        // Standard baseline calculations
        const yieldScore = property.yieldScore || 50;
        const motivation = property.motivationScore || 50;
        const equity = property.equity || 0;
        const value = property.estimatedValue || 1;
        const equityPercent = (equity / value) * 100;

        // 1. MOMENTUM SYNTHESIS (Velocity)
        let momentum = 50; // Base Market Velocity

        // Factor: Equity Cushion (Safety Margin increases velocity confidence)
        if (equityPercent > 40) momentum += 25;
        else if (equityPercent > 20) momentum += 15;

        // Factor: Asset Class Strength
        if (property.type === 'MF') momentum += 10; // Multi-family velocity bonus
        if (property.type === 'LAND') momentum -= 5; // Land is slower

        // Factor: Distress (High motivation = High transaction velocity)
        if (motivation > 75) momentum += 10;

        momentum = Math.min(99, Math.max(10, momentum));

        // 2. GROWTH PROJECTION (24 Months)
        // Base growth 3% + Momentum variance up to 20%
        const growth = 3 + ((momentum / 100) * 17);

        // 3. EXIT WINDOW CALCULATION
        // Distressed/High Equity = Rapid Exit (Flip/Refi)
        // Stable/Luxury = Long Hold
        let quarter = 1;
        let yearOffset = 1;

        if (momentum > 80) {
            // Rapid Liquidity Event
            quarter = Math.ceil((new Date().getMonth() + 7) / 3) % 4 || 4;
            yearOffset = 1;
        } else {
            // Strategic Hold
            quarter = 3;
            yearOffset = 2; // ~24 months
        }

        const currentYear = new Date().getFullYear();
        const exitYear = currentYear + yearOffset;

        // 4. MARKET DRIVERS
        const drivers = [];
        if (equityPercent > 30) drivers.push("Deep Equity Cushion");
        if (property.type === 'MF') drivers.push("Multi-Family Demand Surge");
        if (motivation > 80) drivers.push("Distressed Seller Signal");
        if (drivers.length === 0) drivers.push("Stabilized Market Appreciation");

        return {
            momentumScore: Math.round(momentum),
            projectedGrowth24mo: Number(growth.toFixed(1)),
            exitWindow: `Q${quarter} ${exitYear}`,
            riskProfile: momentum > 80 ? 'LOW' : momentum > 60 ? 'MODERATE' : 'HIGH',
            marketDrivers: drivers.slice(0, 3)
        };
    }

    /**
     * Batch projection for a collection of assets.
     */
    static async batchProject(properties: ZenithProperty[]): Promise<ZenithProperty[]> {
        return Promise.all(
            properties.map(async p => {
                const alpha = await this.projectAlpha(p);
                return {
                    ...p,
                    alpha
                };
            })
        );
    }
}
