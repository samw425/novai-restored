"use client";

import { X, Calendar, DollarSign, Globe, TrendingUp, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EarningsEvent {
    id: string;
    ticker: string;
    name: string;
    earnings_at: string; // ISO date
    estimated_eps?: number;
    actual_eps?: number;
    consensus_revenue?: string;
    summary?: string;
    impact_score?: number; // 1-10
}

interface EarningsDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    event: EarningsEvent | null;
}

export function EarningsDetailsPanel({ isOpen, onClose, event }: EarningsDetailsPanelProps) {
    if (!event) return null;

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
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] border-l border-gray-200 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-mono flex items-center gap-2">
                                    {event.ticker}
                                    <span className="px-2 py-0.5 rounded text-xs font-sans font-medium bg-gray-200 text-gray-600">
                                        US
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{event.name}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase tracking-wide">Date</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(event.earnings_at).toLocaleDateString(undefined, {
                                            weekday: 'short', month: 'short', day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">After Market Close</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase tracking-wide">Est. EPS</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">${event.estimated_eps || '-'}</p>
                                    <p className="text-xs text-emerald-600 font-medium">+12% YoY</p>
                                </div>
                            </div>

                            {/* AI Analysis / Summary */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    AI Forecast & Sentiment
                                </h3>
                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-sm text-gray-800 leading-relaxed">
                                    {event.summary || "Novai AI is analyzing historical data and recent news signals to generate a sentiment forecast. Expect high volatility given recent sector movements."}
                                </div>
                            </div>

                            {/* Links / Resources */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Deep Dive Resources</h3>
                                <div className="space-y-2">
                                    <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group">
                                        <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                            <Globe className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                                            Investor Relations
                                        </span>
                                        <span className="text-xs text-gray-400">External ↗</span>
                                    </a>
                                    <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group">
                                        <span className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                            SEC Filings (EDGAR)
                                        </span>
                                        <span className="text-xs text-gray-400">Latest 10-Q ↗</span>
                                    </a>
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50/80 backdrop-blur">
                            <button className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10">
                                Set Alert for Release
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
