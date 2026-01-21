"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Header from "@/components/layout/Header";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyDetailModal from "@/components/property/PropertyDetailModal";
import { ZenithProperty } from "@/lib/types";
import { queryZenithOracle } from "@/lib/data/oracle";

import {
    Search, MapPin, ChevronDown, Filter, List, Map as MapIcon,
    SlidersHorizontal, X, RefreshCw, Home
} from "lucide-react";

// Dynamic Import for MapEngine to avoid SSR issues
const MapEngine = dynamic(() => import("@/components/map/MapEngine"), { ssr: false });

function SearchPageContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || searchParams.get("type") || "";

    // State
    const [properties, setProperties] = useState<ZenithProperty[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<ZenithProperty | null>(null);
    const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mobileView, setMobileView] = useState<"LIST" | "MAP">("LIST");
    const [savedProperties, setSavedProperties] = useState<string[]>([]);

    // Search & Filters
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [centerLocation, setCenterLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [priceFilter, setPriceFilter] = useState("ALL");
    const [bedsFilter, setBedsFilter] = useState("ALL");
    const [homeTypeFilter, setHomeTypeFilter] = useState("ALL");
    const [searchAsIMove, setSearchAsIMove] = useState(true);

    // Refs
    const initialLoadRef = useRef(true);
    const propertyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Load saved properties from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("zenith_saved") || "[]");
        setSavedProperties(saved);
    }, []);

    // Initial search based on URL params
    useEffect(() => {
        if (!initialLoadRef.current) return;
        initialLoadRef.current = false;

        const performInitialSearch = async () => {
            setIsLoading(true);
            try {
                // Use query param or default to Miami
                const query = initialQuery || "Miami, FL";
                const result = await queryZenithOracle(query);
                const results = result.properties as ZenithProperty[];
                setProperties(results);

                if (result.center) {
                    setCenterLocation({ ...result.center });
                }

                // Handle deep linking to property
                const propertyId = searchParams.get("propertyId");
                if (propertyId) {
                    const match = results.find(p => p.id === propertyId);
                    if (match) setSelectedProperty(match);
                }
            } catch (e) {
                console.error("Initial search failed:", e);
            } finally {
                setIsLoading(false);
            }
        };

        performInitialSearch();
    }, [initialQuery]);

    // Handle search
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);

        try {
            const result = await queryZenithOracle(searchQuery);
            setProperties(result.properties as ZenithProperty[]);
            if (result.center) {
                setCenterLocation({ ...result.center, _t: Date.now() } as any);
            }
        } catch (e) {
            console.error("Search failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter properties
    const filteredProperties = properties.filter((p) => {
        if (priceFilter !== "ALL") {
            const val = p.estimatedValue / 1000;
            if (priceFilter === "0-250" && val >= 250) return false;
            if (priceFilter === "250-500" && (val < 250 || val >= 500)) return false;
            if (priceFilter === "500-1M" && (val < 500 || val >= 1000)) return false;
            if (priceFilter === "1M+" && val < 1000) return false;
        }
        if (bedsFilter !== "ALL") {
            const beds = p.beds || 0;
            if (bedsFilter === "1+" && beds < 1) return false;
            if (bedsFilter === "2+" && beds < 2) return false;
            if (bedsFilter === "3+" && beds < 3) return false;
            if (bedsFilter === "4+" && beds < 4) return false;
        }
        if (homeTypeFilter !== "ALL") {
            if (homeTypeFilter === "SFR" && p.type !== "SFR") return false;
            if (homeTypeFilter === "MF" && p.type !== "MF") return false;
        }
        return true;
    });

    // Save/unsave property
    const toggleSave = (propertyId: string) => {
        const newSaved = savedProperties.includes(propertyId)
            ? savedProperties.filter((id) => id !== propertyId)
            : [...savedProperties, propertyId];
        setSavedProperties(newSaved);
        localStorage.setItem("zenith_saved", JSON.stringify(newSaved));
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Header />

            {/* Filter Bar */}
            <div className="filter-bar border-b border-[var(--border)] bg-white sticky top-16 z-40">
                <div className="flex items-center gap-4 flex-1 max-w-screen-2xl mx-auto w-full px-4">
                    {/* Back to Home */}
                    <Link href="/" className="btn btn-secondary btn-sm hidden md:flex">
                        <Home className="w-4 h-4" />
                    </Link>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="input input-with-icon py-2 text-sm"
                            style={{ paddingLeft: "2.5rem" }}
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="hidden lg:flex items-center gap-2">
                        {/* Price Filter */}
                        <div className="relative group">
                            <button className={`filter-btn ${priceFilter !== "ALL" ? "active" : ""}`}>
                                Price <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[var(--border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                {["ALL", "0-250", "250-500", "500-1M", "1M+"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriceFilter(p)}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${priceFilter === p ? "text-[var(--zenith-blue)] font-medium" : ""}`}
                                    >
                                        {p === "ALL" ? "Any Price" : p === "1M+" ? "$1M+" : `$${p}K`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Beds Filter */}
                        <div className="relative group">
                            <button className={`filter-btn ${bedsFilter !== "ALL" ? "active" : ""}`}>
                                Beds <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-[var(--border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                {["ALL", "1+", "2+", "3+", "4+"].map((b) => (
                                    <button
                                        key={b}
                                        onClick={() => setBedsFilter(b)}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${bedsFilter === b ? "text-[var(--zenith-blue)] font-medium" : ""}`}
                                    >
                                        {b === "ALL" ? "Any" : b}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Home Type Filter */}
                        <div className="relative group">
                            <button className={`filter-btn ${homeTypeFilter !== "ALL" ? "active" : ""}`}>
                                Home Type <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-[var(--border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                {[
                                    { value: "ALL", label: "All Types" },
                                    { value: "SFR", label: "Single Family" },
                                    { value: "MF", label: "Multi-Family" },
                                ].map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => setHomeTypeFilter(t.value)}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${homeTypeFilter === t.value ? "text-[var(--zenith-blue)] font-medium" : ""}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="hidden md:flex items-center gap-4 ml-auto">
                        <span className="text-sm text-gray-500">
                            <strong className="text-gray-900">{filteredProperties.length}</strong> properties
                        </span>
                        <button
                            onClick={() => handleSearch()}
                            className="btn btn-secondary btn-sm"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Mobile Filters Toggle */}
                    <button className="lg:hidden filter-btn">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex border-b border-[var(--border)]">
                <button
                    onClick={() => setMobileView("LIST")}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${mobileView === "LIST" ? "text-[var(--zenith-blue)] border-b-2 border-[var(--zenith-blue)]" : "text-gray-500"}`}
                >
                    <List className="w-4 h-4" />
                    List
                </button>
                <button
                    onClick={() => setMobileView("MAP")}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${mobileView === "MAP" ? "text-[var(--zenith-blue)] border-b-2 border-[var(--zenith-blue)]" : "text-gray-500"}`}
                >
                    <MapIcon className="w-4 h-4" />
                    Map
                </button>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Map */}
                <div className={`flex-1 relative ${mobileView === "LIST" ? "hidden lg:block" : "block"}`}>
                    <MapEngine
                        properties={filteredProperties}
                        onPropertySelect={(p) => setSelectedProperty(p)}
                        centerLocation={centerLocation}
                        selectedPropertyId={selectedProperty?.id}
                        hoveredPropertyId={hoveredPropertyId}
                        onBoundsChange={async (bounds) => {
                            if (!searchAsIMove) return;
                            try {
                                const result = await queryZenithOracle(searchQuery || "AUTO_DISCOVERY", bounds);
                                if (result.properties.length > 0) {
                                    setProperties((prev) => {
                                        const map = new Map();
                                        prev.forEach((p: ZenithProperty) => map.set(p.id, p));
                                        result.properties.forEach((p: ZenithProperty) => map.set(p.id, p));
                                        return Array.from(map.values()) as ZenithProperty[];
                                    });
                                }
                            } catch (e) {
                                console.error("Bounds search failed:", e);
                            }
                        }}
                    />

                    {/* Map Controls */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        <button
                            onClick={() => handleSearch()}
                            className="btn btn-secondary btn-sm shadow-lg"
                        >
                            <Search className="w-4 h-4" />
                            Search this area
                        </button>
                        <button
                            onClick={() => setSearchAsIMove(!searchAsIMove)}
                            className={`btn btn-sm shadow-lg ${searchAsIMove ? "btn-primary" : "btn-secondary"}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${searchAsIMove ? "bg-white animate-pulse" : "bg-gray-400"}`} />
                            Search as I move
                        </button>
                    </div>
                </div>

                {/* Property List */}
                <div className={`w-full lg:w-[480px] xl:w-[520px] border-l border-[var(--border)] bg-white overflow-y-auto custom-scrollbar ${mobileView === "MAP" ? "hidden lg:block" : "block"}`}>
                    {/* List Header */}
                    <div className="p-4 border-b border-[var(--border)] bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {searchQuery ? `Results for "${searchQuery}"` : "Properties Near You"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {filteredProperties.length} properties available
                        </p>
                    </div>

                    {/* Property Cards */}
                    <div className="p-4 space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <RefreshCw className="w-8 h-8 text-[var(--zenith-blue)] animate-spin mb-4" />
                                <p className="text-gray-500">Searching properties...</p>
                            </div>
                        ) : filteredProperties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                                <p className="text-gray-500 mb-4 max-w-sm">
                                    Try adjusting your filters or searching a different location.
                                </p>
                                <button onClick={() => handleSearch()} className="btn btn-primary">
                                    Search Again
                                </button>
                            </div>
                        ) : (
                            filteredProperties.map((prop) => (
                                <div
                                    key={prop.id}
                                    ref={(el) => {
                                        propertyRefs.current[prop.id] = el;
                                    }}
                                    onMouseEnter={() => setHoveredPropertyId(prop.id)}
                                    onMouseLeave={() => setHoveredPropertyId(null)}
                                >
                                    <PropertyCard
                                        property={prop}
                                        variant="horizontal"
                                        onClick={() => setSelectedProperty(prop)}
                                        onSave={() => toggleSave(prop.id)}
                                        isSaved={savedProperties.includes(prop.id)}
                                        isHovered={hoveredPropertyId === prop.id}
                                        isSelected={selectedProperty?.id === prop.id}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Property Detail Modal */}
            {selectedProperty && (
                <PropertyDetailModal
                    property={selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                />
            )}
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
