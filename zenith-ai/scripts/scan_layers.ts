
import fetch from "node-fetch";

async function deepCrawl() {
    console.log("🕷️ [AGENT SCOUT] STARTING DEEP CRAWL OF LOJIC SERVER...");
    const root = "https://services.lojic.org/arcgis/rest/services";

    // 1. Get Root Folders
    const rootJson = await getJson(root) as any;
    if (!rootJson.folders) {
        console.log("❌ ROOT ACCESS FAILED");
        return;
    }

    const allFolders = ["", ...(rootJson.folders as string[])]; // Root + Subfolders

    for (const folder of allFolders) {
        const folderUrl = folder ? `${root}/${folder}` : root;
        console.log(`\n📂 SCANNING FOLDER: ${folder || "ROOT"}`);

        const folderJson = await getJson(folderUrl) as any;
        if (!folderJson.services) continue;

        for (const service of (folderJson.services as any[])) {
            // Check MapServer AND FeatureServer
            const types = ["MapServer", "FeatureServer"];
            for (const type of types) {
                // If the service listing specifies type, verify it.
                if (service.type && service.type !== type) continue;

                const serviceUrl = `${root}/${service.name}/${type}`;
                const serviceJson = await getJson(serviceUrl) as any;

                if (serviceJson && serviceJson.layers) {
                    // console.log(`   🔎 Checking: ${service.name} (${serviceJson.layers.length} layers)`);
                    const target = (serviceJson.layers as any[]).find((l: any) =>
                        l.name.toLowerCase().includes("parcel") ||
                        l.name.toLowerCase().includes("pva") ||
                        l.name.toLowerCase().includes("address")
                    );


                    if (target) {
                        console.log(`\n🎯 CANDIDATE FOUND:`);
                        console.log(`   SERVICE: ${service.name} (${type})`);
                        console.log(`   LAYER: [${target.id}] ${target.name}`);
                        console.log(`   URL: ${serviceUrl}/${target.id}`);
                        // process.exit(0); // DON'T STOP! FIND THEM ALL.
                    }
                }
            }
        }
    }
    console.log("🛑 DEEP CRAWL COMPLETE.");
}

async function getJson(url: string) {
    try {
        const res = await fetch(`${url}?f=json`);
        if (!res.ok) return {};
        return await res.json();
    } catch (e) {
        return {};
    }
}

deepCrawl();
