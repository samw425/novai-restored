/**
 * ZENITH TITANIUM QC SCRIPT (v11.0)
 * 
 * Clinical System Verification & Data Integrity Audit.
 * SOVEREIGNTY MANDATE: ZERO MOCK, 100% REAL.
 */


import { queryZenithOracle } from "../lib/data/oracle";

async function runEliteAudit() {
    console.log("==========================================");
    console.log("ZENITH TITANIUM: SYSTEM INTEGRITY AUDIT v11.0");
    console.log("==========================================");


    const TEST_JURISDICTIONS = ["Austin, TX", "Miami, FL", "Los Angeles, CA"];
    let totalFailures = 0;

    for (const city of TEST_JURISDICTIONS) {
        console.log(`\n[AUDIT] SECTOR: ${city.toUpperCase()}`);
        console.log(`[UPLINK] Initiating Proprietary Synthesis...`);

        try {
            const response = await queryZenithOracle(city);
            const properties = response.properties;

            console.log(`[RESULT] ${properties.length} ASSETS DISCOVERED.`);

            // 1. Veracity Audit
            const mockCount = properties.filter(p => p.provenance.base.source === "MOCK_INJECTOR").length;
            if (mockCount > 0) {
                console.error(`[CRITICAL] TITANIUM_VIOLATION: ${mockCount} mock records detected.`);
                totalFailures++;
            } else {
                console.log(`[VERIFIED] 0 MOCK RECORDS DETECTED. TOTAL SOVEREIGNTY ACHIEVED.`);
            }


            // 2. Fidelity Audit (Beds/Baths)
            const incomplete = properties.filter(p => !p.beds || !p.baths).length;
            if (incomplete > 0) {
                console.warn(`[WARNING] FIDELITY_VOID: ${incomplete} assets missing beds/baths.`);
            } else {
                console.log(`[VERIFIED] ALL ASSETS HAVE HIGH-FIDELITY SPECS.`);
            }

            // 3. Visual Audit
            const noPhotos = properties.filter(p => !p.images || p.images.length === 0).length;
            console.log(`[STATUS] Visual Anchor Saturation: ${Math.round(((properties.length - noPhotos) / properties.length) * 100)}%`);

        } catch (e) {
            console.error(`[FATAL] UPLINK_FAILURE: ${e}`);
            totalFailures++;
        }
    }

    console.log("\n==========================================");
    if (totalFailures === 0) {
        console.log("ZENITH V11.0 TITANIUM: SYSTEM_NORMAL_S_RANK_INTEGRITY");
    } else {
        console.log(`ZENITH V11.0 TITANIUM: ${totalFailures} INTEGRITY_VIOLATIONS_DETECTED`);
    }
    console.log("==========================================\n");

}

runEliteAudit();
