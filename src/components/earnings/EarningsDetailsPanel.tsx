"use client";

import { X, Calendar, Clock, Globe, FileText, Bell, BellOff, Star, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getCompanyDetails, type CompanyData, type EarningsSummary } from "@/app/actions/earnings";

// ============================================================================
// QUICK LINKS (Trusted Sources)
// ============================================================================

function getQuickLinks(ticker: string) {
    const links = [
        {
            label: "Investor Relations",
            url: `https://www.google.com/search?q=${ticker}+investor+relations`,
            icon: <Globe className="w-4 h-4" />,
            type: "official",
        },
        {
            label: "SEC Filings (EDGAR)",
            url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${ticker}&type=8-K&dateb=&owner=include&count=40`,
            icon: <FileText className="w-4 h-4" />,
            type: "official",
        },
        {
            label: "Yahoo Finance",
            url: `https://finance.yahoo.com/quote/${ticker}`,
            icon: <ExternalLink className="w-4 h-4" />,
            type: "trusted",
        },
    ];
    return links;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface EarningsDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    event: CompanyData | null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EarningsDetailsPanel({ isOpen, onClose, event }: EarningsDetailsPanelProps) {
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [latestSummary, setLatestSummary] = useState<EarningsSummary | null>(null);
    const [pastSummaries, setPastSummaries] = useState<EarningsSummary[]>([]);
    const [alertEnabled, setAlertEnabled] = useState(false);
    const [watchlisted, setWatchlisted] = useState(false);

    // Fetch full company details when panel opens
    useEffect(() => {
        if (!isOpen || !event) {
            setCompany(null);
            setLatestSummary(null);
            setPastSummaries([]);
            return;
        }

        async function fetchDetails() {
            setLoading(true);
            try {
                const details = await getCompanyDetails(event.ticker);
                setCompany(details.company);
                setLatestSummary(details.latestSummary);
                setPastSummaries(details.pastSummaries);
            } catch (e) {
                console.error("Failed to fetch company details:", e);
                // Fallback to event data
                setCompany(event);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [isOpen, event]);

    if (!event) return null;

    const displayCompany = company || event;
    const quickLinks = getQuickLinks(displayCompany.ticker);

    const statusColors = {
        LIVE: "bg-red-100 text-red-700 border-red-200",
        REPORTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        UPCOMING: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const confidenceBadge = {
        CONFIRMED: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Confirmed" },
        ESTIMATED: { bg: "bg-amber-50", text: "text-amber-600", label: "Estimated" },
        UNKNOWN: { bg: "bg-gray-50", text: "text-gray-500", label: "TBA" },
    };

    const conf = confidenceBadge[displayCompany.confidence || "UNKNOWN"];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[70] border-l border-gray-200 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-gray-900 font-mono">
                                        {displayCompany.ticker}
                                    </h2>
                                    {displayCompany.is_ai && (
                                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                                            AI/Tech
                                        </span>
                                    )}
                                    {displayCompany.status && (
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[displayCompany.status]}`}>
                                            {displayCompany.status}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{displayCompany.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setWatchlisted(!watchlisted)}
                                    className={`p-2 rounded-lg transition-colors ${watchlisted
                                            ? "bg-amber-100 text-amber-600"
                                            : "bg-gray-100 text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <Star className={`w-5 h-5 ${watchlisted ? "fill-current" : ""}`} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {/* Next Earnings */}
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            Next Earnings
                                        </h3>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {displayCompany.formatted_date || "TBA"}
                                                </p>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${conf.bg} ${conf.text}`}>
                                                    {conf.label}
                                                </span>
                                            </div>
                                            {displayCompany.earnings_time && displayCompany.earnings_time !== "TBA" && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {displayCompany.earnings_time === "BMO" && "Before Market Open"}
                                                    {displayCompany.earnings_time === "AMC" && "After Market Close"}
                                                    {displayCompany.earnings_time === "DMH" && "During Market Hours"}
                                                </p>
                                            )}
                                            {displayCompany.days_until !== null && displayCompany.days_until !== undefined && displayCompany.days_until > 0 && (
                                                <p className="text-xs text-purple-600 font-medium mt-2">
                                                    {displayCompany.days_until === 1 ? "Tomorrow!" : `${displayCompany.days_until} days away`}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Alert Toggles */}
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-gray-400" />
                                            Alerts
                                        </h3>
                                        <div className="space-y-2">
                                            {["24h before", "1h before", "On release"].map((alert, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                                                    <span className="text-sm text-gray-700">{alert}</span>
                                                    <button
                                                        onClick={() => setAlertEnabled(!alertEnabled)}
                                                        className={`w-10 h-6 rounded-full transition-colors ${alertEnabled ? "bg-purple-500" : "bg-gray-200"
                                                            }`}
                                                    >
                                                        <motion.div
                                                            animate={{ x: alertEnabled ? 16 : 2 }}
                                                            className="w-5 h-5 bg-white rounded-full shadow"
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Latest Summary */}
                                    {latestSummary && (
                                        <section>
                                            <h3 className="text-sm font-bold text-gray-900 mb-3">
                                                Latest Release {latestSummary.quarter_label && `(${latestSummary.quarter_label})`}
                                            </h3>
                                            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                                {latestSummary.summary_text && (
                                                    <p className="text-sm text-gray-800 mb-3">{latestSummary.summary_text}</p>
                                                )}
                                                {latestSummary.highlights && latestSummary.highlights.length > 0 && (
                                                    <ul className="space-y-1.5">
                                                        {latestSummary.highlights.map((h, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                                <span className="text-purple-500 mt-0.5">•</span>
                                                                {h}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <p className="text-xs text-gray-500 mt-3">{latestSummary.time_ago}</p>
                                            </div>
                                        </section>
                                    )}

                                    {/* Quick Links */}
                                    <section>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Links</h3>
                                        <div className="space-y-2">
                                            {quickLinks.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group"
                                                >
                                                    <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                                        <span className={`text-gray-400 group-hover:${link.type === "official" ? "text-emerald-500" : "text-blue-500"}`}>
                                                            {link.icon}
                                                        </span>
                                                        {link.label}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {link.type === "official" ? "Official ↗" : "↗"}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Past Earnings */}
                                    {pastSummaries.length > 0 && (
                                        <section>
                                            <h3 className="text-sm font-bold text-gray-900 mb-3">Past Earnings</h3>
                                            <div className="space-y-2">
                                                {pastSummaries.map((s) => (
                                                    <div key={s.id} className="p-3 rounded-lg border border-gray-200">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {s.quarter_label || "Earnings"}
                                                            </span>
                                                            <span className="text-xs text-gray-400">{s.time_ago}</span>
                                                        </div>
                                                        {s.highlights && s.highlights.length > 0 && (
                                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                                {s.highlights[0]}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50/80 backdrop-blur space-y-3">
                            <button className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2">
                                <Bell className="w-4 h-4" />
                                Set All Alerts
                            </button>
                            <button className="w-full py-2.5 px-4 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
                                Add to Calendar (.ics)
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
