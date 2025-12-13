"use client";

import { Search, Bell } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface EarningsHeaderProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onSearch: (query: string) => void;
}

export function EarningsHeader({ activeTab, onTabChange, onSearch }: EarningsHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    }

    const tabs = [
        { id: "featured", label: "Featured" },
        { id: "upcoming", label: "Upcoming" },
        { id: "latest", label: "Latest Releases" },
        { id: "archive", label: "Archive" },
    ];

    return (
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Row: Title & Search */}
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-gray-900">
                            Earnings Hub
                        </h1>
                        <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                            Live
                        </span>
                    </div>

                    <div className="flex-1 max-w-lg mx-8 relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search (e.g. NVDA)..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full bg-gray-100 border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white focus:border-emerald-500 transition-all font-mono"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors relative">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id &&
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                                />
                            }
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
