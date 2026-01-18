export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const location = url.searchParams.get("location");

    if (!location) {
        return new Response(JSON.stringify({ error: "Location required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // API Key from Cloudflare Environment (Priority) or Fallback
    const apiKey = env.NEXT_PUBLIC_RENTCAST_KEY || "416354ac9d4c400f9f91d04f41d57b58";

    try {
        const queryParams = new URLSearchParams();
        queryParams.set("limit", "500"); // THE DIRECTIVE: 500+ Targets per search

        const cleanLoc = location.trim();

        // 1. Check for ZIP Code
        if (/^\d{5}$/.test(cleanLoc)) {
            queryParams.set("zipCode", cleanLoc);
        }
        // 2. Check for County Search (e.g., "Austin County, TX")
        else if (cleanLoc.toLowerCase().includes("county")) {
            const parts = cleanLoc.split(",");
            if (parts.length >= 2) {
                queryParams.set("county", parts[0].toLowerCase().replace("county", "").trim());
                queryParams.set("state", parts[1].trim());
            } else {
                queryParams.set("county", cleanLoc.toLowerCase().replace("county", "").trim());
            }
        }
        // 3. Handle City/State combinations
        else if (cleanLoc.includes(",")) {
            const parts = cleanLoc.split(",");
            if (parts.length >= 2) {
                const state = parts[parts.length - 1].trim();
                const city = parts[parts.length - 2].trim();
                queryParams.set("city", city);
                queryParams.set("state", state);
            } else {
                queryParams.set("city", cleanLoc);
            }
        }
        // 4. Default to City
        else {
            queryParams.set("city", cleanLoc);
        }

        const endpoint = `https://api.rentcast.io/v1/properties?${queryParams.toString()}`;
        console.log(`[ZENITH ORACLE UPLINK] FETCHING 500 TARGETS FROM: ${endpoint}`);

        const response = await fetch(endpoint, {
            headers: {
                "X-Api-Key": apiKey,
                "accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[RENTCAST ERROR] ${response.status}: ${errorText}`);
            // Return empty array with 200 so frontend failover triggers cleanly
            return new Response(JSON.stringify([]), {
                headers: { "Content-Type": "application/json" }
            });
        }

        let data = await response.json();
        // ... (rest of logic) ...

        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=3600"
            }
        });

    } catch (error) {
        console.error(`[ZENITH UPLINK ERROR] ${error.message}`);
        // Ensure even on total crash we return an empty array to trigger failover
        return new Response(JSON.stringify([]), {
            headers: { "Content-Type": "application/json" }
        });
    }
}
