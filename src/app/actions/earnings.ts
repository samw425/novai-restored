"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export interface CompanyData {
    id: string;
    ticker: string;
    name: string;
    next_earnings?: string | null; // formatted date
    status?: "UPCOMING" | "RELEASED" | "LIVE";
}

export async function getFeaturedCompanies(): Promise<CompanyData[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from("companies")
            .select("id, ticker, name, is_ai, featured_rank")
            .eq("is_ai", true)
            .order("featured_rank", { ascending: true });

        if (error) {
            console.error("Error fetching featured companies:", error);
            return [];
        }

        // Transform for UI (Mocking dates for now until Ingestion runs)
        if (!data || data.length === 0) {
            console.warn("DB Empty or Error, using Fallback Data");
            throw new Error("Empty Data"); // Trigger catch block to use mock
        }

        return data.map((company) => ({
            id: company.id,
            ticker: company.ticker,
            name: company.name,
            next_earnings: "TBA",
            status: "UPCOMING" as const,
        }));
    } catch (err: any) {
        console.error("Supabase Error, using MOCK Fallback:", err);
        // FALLBACK DATA (Safe Mode)
        return [
            { id: "1", ticker: "NVDA", name: "NVIDIA Corp (Fallback)", next_earnings: "Feb 28", status: "UPCOMING" as const },
            { id: "2", ticker: "MSFT", name: "Microsoft (Fallback)", next_earnings: "Jan 25", status: "UPCOMING" as const },
            { id: "3", ticker: "GOOGL", name: "Alphabet (Fallback)", next_earnings: "Jan 30", status: "UPCOMING" as const },
            { id: "4", ticker: "AMD", name: "AMD (Fallback)", next_earnings: "Jan 31", status: "UPCOMING" as const }
        ];
    }
}
