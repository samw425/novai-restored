"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import { getFeaturedCompanies } from "@/app/actions/earnings";

interface TickerCardProps {
    ticker: string;
    name: string;
    nextEarnings?: string;
    status?: "UPCOMING" | "RELEASED" | "LIVE";
    onClick?: () => void;
}

function TickerCard({ ticker, name, nextEarnings, status = "UPCOMING", onClick }: TickerCardProps) {
    return (
        <motion.div
            whileHover={{ y: -2, backgroundColor: "#ffffff" }}
            onClick={onClick}
            className="group relative p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md overflow-hidden transition-all cursor-pointer"
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 font-mono">{ticker}</h3>
                        <Cpu className="w-3 h-3 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-500 truncate max-w-[140px]">{name}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold border ${status === "LIVE" ? "bg-red-50 text-red-600 border-red-200 animate-pulse" :
                    status === "RELEASED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                    {status}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-end">
                <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Earnings</span>
                    <p className="text-sm font-medium text-gray-900">
                        {nextEarnings || "TBA"}
                    </p>
                </div>
                <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

interface FeaturedTickerGridProps {
    onSelect?: (company: any) => void;
}

export default function FeaturedTickerGrid({ onSelect }: FeaturedTickerGridProps) {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getFeaturedCompanies();
                if (!data || data.length === 0) {
                    console.warn("No data returned");
                }
                setCompanies(data || []);
            } catch (error: any) {
                console.error("Failed to load companies", error);
                setErrorMsg(error?.message || "Unknown Fetch Error");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (errorMsg) {
        return (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                <strong>Error:</strong> {errorMsg}
            </div>
        );
    }

    if (loading) {
        return (
            <>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 rounded-xl bg-white border border-gray-200 animate-pulse shadow-sm"></div>
                ))}
            </>
        );
    }

    return (
        <>
            {companies.map((stock) => (
                <TickerCard
                    key={stock.ticker}
                    {...stock}
                    onClick={() => onSelect?.(stock)}
                />
            ))}
        </>
    );
}
