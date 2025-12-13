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
        // Create a timeout promise that rejects after 5 seconds
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Supabase Timeout")), 5000)
        );

        // Race Supabase call against timeout
        const { data, error } = await Promise.race([
            supabaseAdmin
                .from("companies")
                .select("id, ticker, name, is_ai, featured_rank")
                .eq("is_ai", true)
                .order("featured_rank", { ascending: true }),
            timeoutPromise
        ]) as any;

        if (error) {
            console.error("Error fetching featured companies:", error);
            throw error; // Trigger catch for fallback
        }

        // Transform for UI (Mocking dates for now until Ingestion runs)
        if (!data || data.length === 0) {
            console.warn("DB Empty or Error, using Fallback Data");
            throw new Error("Empty Data"); // Trigger catch block
        }

        return data.map((company: any) => ({
            id: company.id,
            ticker: company.ticker,
            name: company.name,
            next_earnings: "TBA",
            status: "UPCOMING" as const,
        }));
    } catch (err: any) {
        console.error("Supabase Error/Timeout, using MOCK Fallback:", err);
        // FALLBACK DATA (Safe Mode)
        return [
            { id: "1", ticker: "NVDA", name: "NVIDIA Corp", next_earnings: "Feb 28", status: "UPCOMING" as const },
            { id: "2", ticker: "MSFT", name: "Microsoft", next_earnings: "Jan 25", status: "UPCOMING" as const },
            { id: "3", ticker: "GOOGL", name: "Alphabet", next_earnings: "Jan 30", status: "UPCOMING" as const },
            { id: "4", ticker: "AMD", name: "AMD", next_earnings: "Jan 31", status: "UPCOMING" as const }
        ];
    }
}
