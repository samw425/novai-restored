
import fetch from "node-fetch";

async function scoutLojic() {
    console.log("🦅 [AGENT SCOUT] PROBING LOJIC SUB-FOLDERS...");

    const folders = ["Lojic", "Metro", "LojicSolutions"]; // Found from previous + adding known
    const base = "https://services.lojic.org/arcgis/rest/services";

    for (const folder of folders) {
        const url = `${base}/${folder}?f=json`;
        console.log(`\n📂 [SCANNING] ${folder}...`);

        try {
            const res = await fetch(url);
            const json: any = await res.json();

            if (json.services) {
                console.log(`   FOUND ${json.services.length} SERVICES:`);
                json.services.forEach((s: any) => {
                    console.log(`   • ${s.name} (${s.type})`);
                });
            } else {
                console.log(`   ⚠️ NO SERVICES FOUND or ACCESS DENIED.`);
            }
        } catch (e) {
            console.log(`   ❌ FAILED TO CONNECT.`);
        }
    }
}

scoutLojic();
