"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, TrendingUp, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroSearchProps {
    onSearch?: (query: string) => void;
}

export default function HeroSearch({ onSearch }: HeroSearchProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState(-1);

    // Autocomplete with Nominatim
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                return;
            }
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=us`
                );
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (e) {
                console.warn("Autocomplete failed:", e);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (query?: string) => {
        const q = query || searchQuery;
        if (!q.trim()) return;

        setShowSuggestions(false);

        if (onSearch) {
            onSearch(q);
        } else {
            router.push(`/search?q=${encodeURIComponent(q)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIdx((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIdx >= 0 && suggestions[selectedIdx]) {
                setSearchQuery(suggestions[selectedIdx].display_name);
                handleSearch(suggestions[selectedIdx].display_name);
            } else {
                handleSearch();
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const quickFilters = [
        { label: "For Sale by Owner", query: "FSBO", icon: Shield },
        { label: "Pre-Foreclosure", query: "pre-foreclosure", icon: TrendingUp },
        { label: "Motivated Sellers", query: "motivated", icon: Zap },
    ];

    return (
        <section className="hero">
            {/* Main Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-title"
            >
                Find Off-Market Properties
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="hero-subtitle"
            >
                Buy directly from owners. Skip the agent. Save thousands on commissions.
            </motion.p>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hero-search relative"
            >
                <div className="search-bar search-bar-hero">
                    <MapPin className="search-bar-icon w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Enter an address, city, or ZIP code"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="search-bar-input"
                    />
                    <button
                        onClick={() => handleSearch()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search</span>
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50"
                        >
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSearchQuery(s.display_name);
                                        handleSearch(s.display_name);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${selectedIdx === i
                                            ? "bg-[var(--zenith-blue)] text-white"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <MapPin className="w-4 h-4 flex-shrink-0 opacity-50" />
                                    <span className="truncate">{s.display_name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Quick Filter Chips */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hero-chips"
            >
                {quickFilters.map((filter) => (
                    <button
                        key={filter.query}
                        onClick={() => router.push(`/search?type=${filter.query}`)}
                        className="hero-chip flex items-center gap-2"
                    >
                        <filter.icon className="w-3.5 h-3.5" />
                        {filter.label}
                    </button>
                ))}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500"
            >
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>1,000+ Active Listings</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Verified Owners</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Save up to $24,000</span>
                </div>
            </motion.div>
        </section>
    );
}
