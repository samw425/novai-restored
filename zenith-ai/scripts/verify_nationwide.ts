
import { queryZenithOracle } from "../src/lib/data/oracle";

async function verifyNationwide() {
    console.log("🌎 [ZENITH] INITIATING NATIONWIDE OMNI-CLIENT AUDIT...");

    const targets = [
        { city: "Los Angeles, CA", county: "Los Angeles" },
        { city: "Miami, FL", county: "Miami-Dade" },
        { city: "Austin, TX", county: "Travis" },
        { city: "Seattle, WA", county: "King" }
    ];

    let successCount = 0;

    for (const t of targets) {
        console.log(`\n\n📡 TESTING SECTOR: ${t.city.toUpperCase()} [${t.county}]`);
        try {
            // We mock the bounds to force a spatial query if needed, or rely on text search
            const result = await queryZenithOracle(t.city);

            const omniProps = result.properties.filter(p => p.id.startsWith("OMNI-"));

            if (omniProps.length > 0) {
                console.log(`   ✅ SUCCESS: ${omniProps.length} RECORDS RETRIEVED.`);
                console.log(`   📝 SAMPLE: ${omniProps[0].address} | Owner: ${omniProps[0].ownerName}`);
                successCount++;
            } else {
                console.log(`   ⚠️ WARNING: 0 RECORDS. CHECK CONNECTION OR SCHEMA.`);
            }

        } catch (e) {
            console.log(`   ❌ FAILED: CONNECTION ERROR.`);
        }
    }

    console.log(`\n\n🏆 AUDIT COMPLETE: ${successCount}/${targets.length} SECTORS OPERATIONAL.`);
}

verifyNationwide();
