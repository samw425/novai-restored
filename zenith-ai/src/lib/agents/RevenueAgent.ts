import { ZenithProperty } from "../types";

export type UserTier = 'STANDARD' | 'PRO' | 'ELITE';

export interface ZenithUser {
    id: string;
    tier: UserTier;
    credits: number;
    subscriptionId?: string;
}

/**
 * REVENUE AGENT
 * Manages the gateway between Zenith Intelligence and the User's Wallet.
 */
export class RevenueAgent {
    private user: ZenithUser;

    constructor(user: ZenithUser) {
        this.user = user;
    }

    /**
     * Check if the user is authorized for a specific institutional layer.
     */
    canAccessFeature(featureId: string): boolean {
        const tierMatrix: Record<string, UserTier[]> = {
            'DEEP_ENRICHMENT': ['PRO', 'ELITE'],
            'SKIP_TRACE_BASIC': ['PRO', 'ELITE'],
            'SKIP_TRACE_ELITE': ['ELITE'],
            'PREDICTIVE_DISTRESS': ['ELITE'],
            'INSTITUTIONAL_CLOUD': ['ELITE'],
            'CORPORATE_PIERCING': ['ELITE']
        };

        const requiredTiers = tierMatrix[featureId];
        if (!requiredTiers) return true; // Public domain

        return requiredTiers.includes(this.user.tier);
    }

    /**
     * Deduct credits for a high-value event (e.g., Skip Tracing).
     */
    async executePremiumEvent(eventId: string, cost: number): Promise<boolean> {
        if (this.user.credits < cost) {
            console.warn(`[REVENUE AGENT] INSUFFICIENT CREDITS FOR EVENT: ${eventId}`);
            return false;
        }

        // Logic to communicate with Supabase/Stripe would go here
        this.user.credits -= cost;
        console.log(`[REVENUE AGENT] EVENT ${eventId} EXECUTED. REMAINING: ${this.user.credits}`);
        return true;
    }

    /**
     * Simulate a Stripe Checkout flow for trial/demo purposes.
     */
    async simulateCheckout(tier: UserTier): Promise<boolean> {
        console.log(`[REVENUE AGENT] INITIATING SECURE CHECKOUT FOR ${tier} UPGRADE...`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate gateway delay
        this.user.tier = tier;
        this.user.credits += tier === 'ELITE' ? 1000 : 250;
        console.log(`[REVENUE AGENT] UPGRADE SUCCESSFUL: TIER=${tier}, CREDITS=${this.user.credits}`);
        return true;
    }

    /**
     * Get the Lead Quality Multiplier based on tier.
     * Higher tiers get more precise ROI projections.
     */
    getPrecisionMultiplier(): number {
        switch (this.user.tier) {
            case 'ELITE': return 1.0;
            case 'PRO': return 0.85;
            default: return 0.60;
        }
    }

    /**
     * TITANIUM UPGRADE: Wholesale Fee Projection
     * Calculates the potential assignment fee an investor could extract.
     * Logic: 5-10% of Equity or Flat $10k+ depending on deal depth.
     */
    static projectWholesaleFee(property: ZenithProperty): number {
        const { equity, estimatedValue, motivationScore } = property;
        if (equity <= 0) return 0;

        // Base Fee: 2% of ARV
        let fee = estimatedValue * 0.02;

        // Distress Multiplier: High motivation = Higher negotiable spread
        if (motivationScore > 80) fee *= 1.5;

        // Cap at 30% of Equity (to be realistic)
        const maxFee = equity * 0.3;

        return Math.floor(Math.min(fee, maxFee));
    }
}

export const getActiveUser = (): ZenithUser => {
    // Mock user for local development / trial
    return {
        id: 'user_trial_889',
        tier: 'STANDARD',
        credits: 50
    };
};
