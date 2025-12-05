// Strict verification of LIVE site
const LIVE_URL = 'https://novaibeta.vercel.app';

async function verifyLiveSite() {
    console.log(`\n🔍 Starting Strict Verification for: ${LIVE_URL}\n`);

    // 1. Verify Robotics Feed Content (API)
    try {
        console.log("1️⃣  Checking Robotics API for new sources...");
        const res = await fetch(`${LIVE_URL}/api/feed/robotics`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();
        const items = data.items || [];

        const scienceRobotics = items.find(i => i.source === 'Science Robotics');
        const arxivRobotics = items.find(i => i.source === 'arXiv Robotics');
        const techCrunch = items.find(i => i.source === 'TechCrunch Robotics');

        if (scienceRobotics) console.log("   ✅ FOUND: Science Robotics");
        else console.log("   ❌ MISSING: Science Robotics");

        if (arxivRobotics) console.log("   ✅ FOUND: arXiv Robotics");
        else console.log("   ❌ MISSING: arXiv Robotics");

        if (techCrunch) console.log("   ✅ FOUND: TechCrunch Robotics");
        else console.log("   ❌ MISSING: TechCrunch Robotics");

        console.log(`   Total Items: ${items.length}`);

    } catch (e) {
        console.error("   🚨 API Verification Failed:", e.message);
    }

    // 2. Verify UI Fixes (HTML)
    try {
        console.log("\n2️⃣  Checking Robotics Page HTML for UI Fixes...");
        const res = await fetch(`${LIVE_URL}/robotics`);
        const html = await res.text();

        if (html.includes('md:flex-row')) {
            console.log("   ✅ FOUND: 'md:flex-row' (Responsive Breakpoint Fix)");
        } else {
            console.log("   ❌ MISSING: 'md:flex-row' (Old code might be cached)");
        }

        if (html.includes('break-words')) {
            console.log("   ✅ FOUND: 'break-words' (Truncation Fix)");
        } else {
            console.log("   ❌ MISSING: 'break-words'");
        }

    } catch (e) {
        console.error("   🚨 UI Verification Failed:", e.message);
    }
    console.log("\n🏁 Verification Complete.");
}

verifyLiveSite();
