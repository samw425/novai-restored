"use client";

import { motion } from "framer-motion";
import { FileText, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getLatestSummaries, type EarningsSummary } from "@/app/actions/earnings";

interface SummaryCardProps {
    summary: EarningsSummary;
    onClick?: () => void;
}

function SummaryCard({ summary, onClick }: SummaryCardProps) {
    const isProcessing = summary.status === "PROCESSING";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            className="group p-5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                        {isProcessing ? (
                            <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                        ) : (
                            <FileText className="w-4 h-4 text-purple-600" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-gray-900">{summary.ticker}</span>
                            {summary.quarter_label && (
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-500">
                                    {summary.quarter_label}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">{summary.company_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{summary.time_ago}</span>
                </div>
            </div>

            {isProcessing ? (
                <div className="py-4 text-center">
                    <p className="text-sm text-gray-400">Generating summary...</p>
                </div>
            ) : (
                <>
                    {summary.summary_text && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {summary.summary_text}
                        </p>
                    )}

                    {summary.highlights && summary.highlights.length > 0 && (
                        <ul className="space-y-1 mb-3">
                            {summary.highlights.slice(0, 3).map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <span className="text-purple-500 mt-0.5">•</span>
                                    <span className="line-clamp-1">{h}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex gap-3 text-xs">
                            {summary.eps_text && (
                                <span className="text-gray-500">
                                    <strong className="text-gray-700">EPS:</strong> {summary.eps_text}
                                </span>
                            )}
                            {summary.revenue_text && (
                                <span className="text-gray-500">
                                    <strong className="text-gray-700">Rev:</strong> {summary.revenue_text}
                                </span>
                            )}
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </>
            )}
        </motion.div>
    );
}

interface LatestReleasesProps {
    onSelect?: (summary: EarningsSummary) => void;
}

export default function LatestReleases({ onSelect }: LatestReleasesProps) {
    const [summaries, setSummaries] = useState<EarningsSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getLatestSummaries(25);
                setSummaries(data || []);
            } catch (error) {
                console.error("Failed to load latest summaries:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-36 rounded-xl bg-white border border-gray-200 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (summaries.length === 0) {
        return (
            <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No recent earnings releases</p>
                <p className="text-gray-400 text-sm mt-1">
                    New summaries will appear here within 60 seconds of release
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {summaries.map((summary) => (
                <SummaryCard
                    key={summary.id}
                    summary={summary}
                    onClick={() => onSelect?.(summary)}
                />
            ))}
        </div>
    );
}
