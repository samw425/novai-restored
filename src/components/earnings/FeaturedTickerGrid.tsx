"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { getFeaturedCompanies, type CompanyData } from "@/app/actions/earnings";

interface TickerCardProps {
    ticker: string;
    name: string;
    formatted_date?: string;
    status?: "UPCOMING" | "LIVE" | "REPORTED";
    confidence?: "CONFIRMED" | "ESTIMATED" | "UNKNOWN";
    days_until?: number | null;
    onClick?: () => void;
}

function TickerCard({
    ticker,
    name,
    formatted_date,
    status = "UPCOMING",
    confidence = "UNKNOWN",
    days_until,
    onClick
}: TickerCardProps) {
    const statusColors = {
        LIVE: "bg-red-50 text-red-600 border-red-200 animate-pulse",
        REPORTED: "bg-emerald-50 text-emerald-600 border-emerald-200",
        UPCOMING: "bg-gray-100 text-gray-500 border-gray-200",
    };

    const confidenceColors = {
        CONFIRMED: "text-emerald-500",
        ESTIMATED: "text-amber-500",
        UNKNOWN: "text-gray-400",
    };

    return (
        <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
            onClick={onClick}
            className="group relative p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-gray-300 overflow-hidden transition-all cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 font-mono">{ticker}</h3>
                        <Cpu className="w-3 h-3 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-500 truncate max-w-[140px]">{name}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold border ${statusColors[status]}`}>
                    {status}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">Earnings</span>
                        {confidence !== "UNKNOWN" && (
                            <span className={`flex items-center gap-0.5 text-[9px] ${confidenceColors[confidence]}`}>
                                <Circle className="w-1.5 h-1.5 fill-current" />
                                {confidence.toLowerCase()}
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                        {formatted_date || "TBA"}
                    </p>
                    {days_until !== null && days_until !== undefined && days_until > 0 && days_until <= 7 && (
                        <p className="text-[10px] text-purple-600 font-medium mt-0.5">
                            {days_until === 1 ? "Tomorrow!" : `${days_until} days`}
                        </p>
                    )}
                </div>
                <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

interface FeaturedTickerGridProps {
    onSelect?: (company: CompanyData) => void;
    searchQuery?: string;
}

export default function FeaturedTickerGrid({ onSelect, searchQuery }: FeaturedTickerGridProps) {
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getFeaturedCompanies();
                setCompanies(data || []);
            } catch (error: any) {
                console.error("Failed to load companies", error);
                setErrorMsg(error?.message || "Failed to load earnings data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (errorMsg) {
        return (
            <div className="col-span-full p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                <strong>Error:</strong> {errorMsg}
            </div>
        );
    }

    if (loading) {
        return (
            <>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-white border border-gray-200 animate-pulse shadow-sm"></div>
                ))}
            </>
        );
    }

    const filteredCompanies = companies.filter(c => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
    });

    return (
        <>
            {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                    <TickerCard
                        key={company.ticker}
                        ticker={company.ticker}
                        name={company.name}
                        formatted_date={company.formatted_date}
                        status={company.status}
                        confidence={company.confidence}
                        days_until={company.days_until}
                        onClick={() => onSelect?.(company)}
                    />
                ))
            ) : (
                <div className="col-span-full p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                    No results found for "{searchQuery}"
                </div>
            )}
        </>
    );
}

