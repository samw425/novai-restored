"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/home/HeroSearch";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyDetailModal from "@/components/property/PropertyDetailModal";
import { ZenithProperty } from "@/lib/types";
import { queryZenithOracle } from "@/lib/data/oracle";

import {
  Search, MapPin, ChevronDown, Filter, List, Map as MapIcon,
  SlidersHorizontal, X, RefreshCw, Heart, Shield
} from "lucide-react";

// Dynamic Import for MapEngine to avoid SSR issues
const MapEngine = dynamic(() => import("@/components/map/MapEngine"), { ssr: false });

export default function Home() {
  // State
  const [properties, setProperties] = useState<ZenithProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<ZenithProperty | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [mobileView, setMobileView] = useState<"LIST" | "MAP">("LIST");
  const [savedProperties, setSavedProperties] = useState<string[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [priceFilter, setPriceFilter] = useState("ALL");
  const [bedsFilter, setBedsFilter] = useState("ALL");
  const [homeTypeFilter, setHomeTypeFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [searchAsIMove, setSearchAsIMove] = useState(true);

  // Refs
  const initialLoadRef = useRef(true);
  const propertyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load saved properties from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("zenith_saved") || "[]");
    setSavedProperties(saved);
  }, []);

  // Initial load - auto search
  useEffect(() => {
    if (!initialLoadRef.current) return;
    initialLoadRef.current = false;

    const autoSearch = async () => {
      setIsLoading(true);
      try {
        const result = await queryZenithOracle("Miami, FL");
        setProperties(result.properties as ZenithProperty[]);
        if (result.center) {
          setCenterLocation({ ...result.center });
        }
        setShowHero(false);
      } catch (e) {
        console.error("Initial search failed:", e);
      } finally {
        setIsLoading(false);
      }
    };

    // Don't auto-search on initial load, let user use hero
    // autoSearch();
  }, []);

  // Handle search from hero
  const handleHeroSearch = async (query: string) => {
    setSearchQuery(query);
    setShowHero(false);
    setIsLoading(true);

    try {
      const result = await queryZenithOracle(query);
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

  // Handle search from filter bar
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
    // Price filter
    if (priceFilter !== "ALL") {
      const val = p.estimatedValue / 1000;
      if (priceFilter === "0-250" && val >= 250) return false;
      if (priceFilter === "250-500" && (val < 250 || val >= 500)) return false;
      if (priceFilter === "500-1M" && (val < 500 || val >= 1000)) return false;
      if (priceFilter === "1M+" && val < 1000) return false;
    }
    // Beds filter
    if (bedsFilter !== "ALL") {
      const beds = p.beds || 0;
      if (bedsFilter === "1+" && beds < 1) return false;
      if (bedsFilter === "2+" && beds < 2) return false;
      if (bedsFilter === "3+" && beds < 3) return false;
      if (bedsFilter === "4+" && beds < 4) return false;
    }
    // Home type filter
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

  // Scroll to selected property
  useEffect(() => {
    if (selectedProperty && propertyRefs.current[selectedProperty.id]) {
      propertyRefs.current[selectedProperty.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedProperty]);

  // Show hero on initial load
  if (showHero) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <HeroSearch onSearch={handleHeroSearch} />

        {/* Featured Sections */}
        <section className="container py-16">
          <h2 className="text-h1 text-center mb-2">Why Choose Zenith?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            The first P2P real estate marketplace for off-market properties.
            Connect directly with property owners and save thousands.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "No Agent Fees",
                description: "Buy and sell directly. Save the 6% agent commission on your transaction.",
              },
              {
                icon: MapPin,
                title: "Off-Market Access",
                description: "Discover properties before they hit the market. Get exclusive off-market deals.",
              },
              {
                icon: Heart,
                title: "Verified Owners",
                description: "Every listing is verified. Connect directly with property owners, not middlemen.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="card card-elevated p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--zenith-blue-light)] flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-[var(--zenith-blue)]" />
                </div>
                <h3 className="text-h3 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[var(--zenith-blue)] py-16">
          <div className="container text-center">
            <h2 className="text-h1 text-white mb-4">Ready to Sell Your Property?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              List your property for free and connect directly with buyers.
              No agent commissions, no hidden fees.
            </p>
            <Link href="/list-property" className="btn btn-lg bg-white text-[var(--zenith-blue)] hover:bg-gray-100">
              List Your Property — Free
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  // Search results view
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Filter Bar */}
      <div className="filter-bar border-b border-[var(--border)] bg-white sticky top-16 z-40">
        <div className="flex items-center gap-4 flex-1 max-w-screen-2xl mx-auto w-full px-4">
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

            <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              More
            </button>
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
          <button
            className="lg:hidden filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile View Toggle */}
      <div className="lg:hidden flex border-b border-[var(--border)]">
        <button
          onClick={() => setMobileView("LIST")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${mobileView === "LIST" ? "text-[var(--zenith-blue)] border-b-2 border-[var(--zenith-blue)]" : "text-gray-500"
            }`}
        >
          <List className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setMobileView("MAP")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${mobileView === "MAP" ? "text-[var(--zenith-blue)] border-b-2 border-[var(--zenith-blue)]" : "text-gray-500"
            }`}
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
