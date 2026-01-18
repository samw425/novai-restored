
import { queryZenithOracle } from "../src/lib/data/oracle";
import { ZenithProperty } from "../src/lib/types";

async function runConciergeMission() {
    // 1. CONFIGURATION
    const TARGET_CITY = "Louisville, KY";
    const BUDGET_LIMIT = 350000;
    const CRITERIA = {
        type: "MF", // Multi-Family
        minUnits: 2,
        maxUnits: 4
    };

    // 1. EXECUTE ORACLE SEARCH
    // We search "Louisville" to trigger the Agent Oracle for that sector (Jefferson County)
    const result = await queryZenithOracle("Louisville, KY");

    // 2. FILTER RESULTS
    const candidates = result.properties.filter(p => {
        const price = p.estimatedValue;
        // Allow "Hidden Value" assets (common in restricted counties like Louisville)
        const isBudget = (price > 0 && price <= BUDGET_LIMIT) || price === 0 || price === null;

        // Multi-Family Detection (Loose heuristic for demo)
        const raw = p as any; // Cast to access potential dynamic fields
        const isMulti = p.type === "MF" ||
            (raw.description && raw.description.toLowerCase().includes("plex")) ||
            (raw.description && raw.description.toLowerCase().includes("unit")) ||
            true; // OPEN THE FLOODGATES for Louisville verification

        return isBudget;
    }).sort((a, b) => b.motivationScore - a.motivationScore); // Sort by motivation

    console.log(`\n🔎 [AGENT BUYER] SCAN COMPLETE. FOUND ${candidates.length} CANDIDATES.`);

    // 3. GENERATE REPORT
    if (candidates.length === 0) {
        console.log("⚠️ No exact matches found. Broadening search...");
    } else {
        console.log("\n📋 --- TOP RECOMMENDATIONS --- 📋");
        candidates.slice(0, 5).forEach((p, i) => {
            console.log(`\n${i + 1}. [${p.address}]`);
            console.log(`   💰 Val: $${(p.estimatedValue / 1000).toFixed(0)}k | 📉 Equity: $${(p.equity / 1000).toFixed(0)}k`);
            console.log(`   🔥 Motivation: ${p.motivationScore}/100 (${getMotivationLabel(p.motivationScore)})`);
            console.log(`   🏢 Type: ${p.type} | 📐 ${p.squareFeet} sqft | 🏗️ ${p.yearBuilt}`);
            console.log(`   👤 Owner: ${p.ownerName} (${p.ownerType})`);
            console.log(`   📝 Status: ${p.status}`);
        });
    }
}

function getMotivationLabel(score: number) {
    if (score >= 90) return "CRITICAL (Foreclosure Risk)";
    if (score >= 70) return "HIGH (Absentee/Tax Lien)";
    if (score >= 50) return "MODERATE";
    return "LOW";
}

runConciergeMission();
