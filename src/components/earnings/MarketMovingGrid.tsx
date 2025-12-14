"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getMarketMovingEarnings, type CompanyData } from "@/app/actions/earnings";

interface MarketMovingCardProps {
    company: CompanyData;
    onClick?: () => void;
}

function MarketMovingCard({ company, onClick }: MarketMovingCardProps) {
    const statusColors = {
        LIVE: "bg-red-500",
        REPORTED: "bg-emerald-500",
        UPCOMING: "bg-blue-500",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="group p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[company.status || "UPCOMING"]}`}></div>
                    <span className="font-mono font-bold text-gray-900">{company.ticker}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-1">{company.name}</p>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{company.formatted_date || "TBA"}</span>
                </div>
                {company.confidence && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${company.confidence === "CONFIRMED"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                        }`}>
                        {company.confidence.toLowerCase()}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

interface MarketMovingGridProps {
    onSelect?: (company: CompanyData) => void;
}

export default function MarketMovingGrid({ onSelect }: MarketMovingGridProps) {
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMarketMovingEarnings();
                setCompanies(data || []);
            } catch (error) {
                console.error("Failed to load market moving earnings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-28 rounded-xl bg-white border border-gray-200 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (companies.length === 0) {
        return (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No market-moving earnings in the next 14 days</p>
                <p className="text-gray-400 text-xs mt-1">Check back when earnings season begins</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
                <MarketMovingCard
                    key={company.ticker}
                    company={company}
                    onClick={() => onSelect?.(company)}
                />
            ))}
        </div>
    );
}
