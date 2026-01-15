/**
 * THE MOTIVATION ENGINE
 * 
 * Logic to calculate the "Zenith Score" (0-100) based on public record signals.
 * This is our proprietary 'Market Asymmetry' algorithm.
 */

export interface PropertySignals {
    isTaxDelinquent: boolean;
    isPreForeclosure: boolean;
    isAbsenteeOwner: boolean;
    yearsOwned: number;
    equityPercent: number;
    isVacant?: boolean;
    hasUtilityLiens?: boolean;
    recentPermitViolation?: boolean;
    rentalDemandIndex?: number; // 0-100
}

export function calculateMotivationScore(signals: PropertySignals): number {
    let score = 20; // Baseline score for any property

    // 1. Critical Distress Signals (Heavy Weight)
    if (signals.isPreForeclosure) score += 50;
    if (signals.isTaxDelinquent) score += 30;
    if (signals.hasUtilityLiens) score += 15;
    if (signals.recentPermitViolation) score += 10;

    // 2. Structural Asymmetry (Medium Weight)
    if (signals.isAbsenteeOwner) score += 15;
    if (signals.isVacant) score += 20;

    // 3. Time/Equity Factors (Scaling Weight)
    if (signals.yearsOwned > 10) score += 5;
    if (signals.yearsOwned > 20) score += 10;

    // 4. Market Pressure (Contextual Weight)
    if (signals.rentalDemandIndex && signals.rentalDemandIndex > 80) score += 5;

    // Equity Factor
    if (signals.equityPercent > 50) score += 5;

    // Cap at 100
    return Math.min(score, 100);
}

export function getMotivationLabel(score: number): string {
    if (score >= 80) return "Critical Asymmetry (High Motivation)";
    if (score >= 60) return "High Motivation";
    if (score >= 40) return "Moderate Motivation";
    return "Stable (Low Motivation)";
}
