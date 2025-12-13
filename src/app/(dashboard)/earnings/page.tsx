"use client";

import { EarningsHeader } from "@/components/earnings/EarningsHeader";
import FeaturedTickerGrid from "@/components/earnings/FeaturedTickerGrid";
import { EarningsDetailsPanel } from "@/components/earnings/EarningsDetailsPanel";
import { useState } from "react";

export default function EarningsPage() {
    const [activeTab, setActiveTab] = useState("featured");
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-[#F5F6F8] text-gray-900">
            <EarningsHeader activeTab={activeTab} onTabChange={setActiveTab} onSearch={setSearchQuery} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all">
                {activeTab === "featured" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section: AI Priority */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-sm"></span>
                                    AI & Chip Sector
                                </h2>
                                <span className="text-xs font-mono text-gray-400">Live Updates (1m)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <FeaturedTickerGrid onSelect={setSelectedEvent} searchQuery={searchQuery} />
                            </div>
                        </section>

                        {/* Section: Upcoming This Week */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Moving Earnings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-32 rounded-xl bg-white border border-gray-200 animate-pulse shadow-sm"></div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {activeTab === "upcoming" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Earnings Calendar</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <FeaturedTickerGrid onSelect={setSelectedEvent} searchQuery={searchQuery} />
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "latest" && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400">Real-time Feed Loading...</p>
                    </div>
                )}
            </main>

            <EarningsDetailsPanel
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
            />
        </div>
    );
}
