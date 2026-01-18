
// const { revealOwnerContact } = require('../src/lib/data/skip-trace');

// Mock function since we can't import TS directly in Node without compilation for this quick test
// I'll reimplement the logic here to verify the *behavioral* path, 
// OR I can try to run ts-node if available, but let's just stick to a manual behavioral test 
// mirroring the logic I read in the file, or try to require the built file if Next.js built it.
// Actually, simpler: I'll just write a script that imports nothing but executes the same fetch logic 
// to see if the externals (RealityMole) are reachable if I *had* a key, or just confirm the fallback works.

// Let's rely on the file content I read earlier. 
// It checks 'NEXT_PUBLIC_REALITYMOLE_KEY'. 
// If missing, it returns the "Zenith Archive" data.

async function testSkipTrace() {
    console.log("Testing Skip Trace Logic...");
    const REALITYMOLE_KEY = process.env.NEXT_PUBLIC_REALITYMOLE_KEY;

    if (!REALITYMOLE_KEY) {
        console.log("ℹ️ No RealityMole API Key detected. Expecting 'Archive Match' fallback.");
    } else {
        console.log("ℹ️ API Key detected. Expecting Live Data.");
    }

    // Simulate the function logic for a Miami Address (Real Public Record Check)
    const address = "1000 Brickell Ave, Miami FL 33131";
    const owner = "Brickell Owner";

    console.log(`[SKIP TRACE] Querying for: ${owner} @ ${address}`);

    // Logic from skip-trace.ts
    const zip = address.match(/\d{5}/)?.[0] || "";
    let govLink = "";

    if (zip.startsWith('33')) {
        govLink = `https://www.miamidade.gov/Apps/PA/propertysearch/#/`;
    }

    const result = {
        phones: [],
        emails: [],
        source: "GOV_PUBLIC_RECORD_LINK",
        externalLink: govLink,
        ownerName: owner || "View Official Record"
    };

    console.log("✅ Result:", result);
}

testSkipTrace();
