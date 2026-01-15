"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import OnboardingHUD from "@/components/ui/OnboardingHUD";
import { searchRentCastProperties } from "@/lib/api/rentcast";
import { ZenithProperty, MOCK_PROPERTIES } from "@/lib/data/mock-properties";
import { fetchPropertiesInBounds } from "@/lib/data/live-feed";
import { revealOwnerContact, OwnerContact } from "@/lib/data/skip-trace";

// Dynamic Import for MapEngine to avoid SSR 'window' error with Leaflet
const MapEngine = dynamic(() => import("@/components/map/MapEngine"), { ssr: false });
import {
  X, Building2, TrendingUp, AlertOctagon, Phone, ShieldCheck, Mail,
  Loader2, Radio, Target, Activity, Zap, Hexagon, Fingerprint, Layers
} from "lucide-react";

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<ZenithProperty | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [properties, setProperties] = useState<ZenithProperty[]>([]); // START EMPTY
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [revealedContact, setRevealedContact] = useState<OwnerContact | null>(null);
  const [isSkipTracing, setIsSkipTracing] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Map Reference for Camera Control (Using simplified callback pattern for now)
  const mapRef = useRef<any>(null); // We would need to expose this from MapEngine or use a context

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsLoading(true);
      setErrorMsg(null);
      setProperties([]); // Clear previous results

      // 1. Call Real Data API
      const result = await searchRentCastProperties(searchQuery);

      if (result.properties.length > 0) {
        // 2. Update Data
        setProperties(result.properties as ZenithProperty[]);
        // 3. Force a "Pan To"
        setCenterLocation(result.center);
      } else {
        // 4. Handle Empty/Error
        console.warn("No properties found");
        setErrorMsg("NO DATA FOUND. CHECK API KEY OR LOCATION.");
      }

      setIsLoading(false);
    }
  };

  const [centerLocation, setCenterLocation] = useState<{ lat: number, lng: number } | null>(null);

  const handleBoundsChange = useCallback(async (bounds: any) => {
    // Dynamic fetching logic reserved for Phase 2 API integration
  }, []);

  const handleRevealContact = async () => {
    // ... same as before
    if (!selectedProperty || isSkipTracing) return;
    setIsSkipTracing(true);
    const contact = await revealOwnerContact(selectedProperty.id);
    setRevealedContact(contact);
    setIsSkipTracing(false);
  };

  // ... Auto-Pilot effects same as before

  // Auto-Pilot & Signal Simulation
  const [pulseSignal, setPulseSignal] = useState<string | null>(null);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    const IDLE_THRESHOLD = 8000; // 8 seconds of no interaction triggers scanner

    const startScanner = () => {
      // Only valid if we found properties to jump between
      if (properties.length > 0) {
        const randomProp = properties[Math.floor(Math.random() * properties.length)];
        setSelectedProperty(randomProp);
        setPulseSignal(`AUTO_INTERCEPT: ${randomProp.address.toUpperCase()}`);
        setTimeout(() => setPulseSignal(null), 3000);
      }
    };

    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(startScanner, IDLE_THRESHOLD);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('click', resetIdle);
    window.addEventListener('keydown', resetIdle);

    idleTimer = setTimeout(startScanner, IDLE_THRESHOLD);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('click', resetIdle);
      window.removeEventListener('keydown', resetIdle);
    };
  }, [properties]);

  useEffect(() => {
    setRevealedContact(null);
  }, [selectedProperty]);

  return (
    <main className="flex h-screen w-screen bg-black font-sans text-white overflow-hidden selection:bg-zenith-accent selection:text-black">

      <AnimatePresence>
        {showOnboarding && <OnboardingHUD onComplete={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      {/* Background Sat-Map */}
      <div className="flex-1 relative">
        <MapEngine
          properties={properties}
          onPropertySelect={setSelectedProperty}
          onBoundsChange={handleBoundsChange}
          centerLocation={centerLocation}
        />

        {/* LOADING OVERLAY - Premium Search Feedback */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-black border border-white/10 shadow-2xl">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-zenith-accent/30 border-t-zenith-accent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-6 h-6 text-zenith-accent animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white tracking-widest mb-1">ACQUIRING TARGET</h3>
                  <p className="text-xs font-mono text-zenith-accent uppercase tracking-[0.3em]">
                    Scanning {searchQuery.toUpperCase() || "SECTOR"}...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOP NAVBAR - Professional & Clean */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-zenith-accent p-1.5 rounded-lg text-white">
              <Hexagon className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">ZENITH <span className="text-zenith-accent">INTELLIGENCE</span></h1>
              <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase">Off-Market Acquisitions</span>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative group w-96 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Target className="h-4 w-4 text-gray-400 group-focus-within:text-zenith-accent transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zenith-accent focus:border-zenith-accent sm:text-xs font-mono transition-all shadow-inner"
              placeholder="SEARCH CITY, STATE, ZIP OR APN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-[10px] font-sans font-medium text-gray-400">⌘K</kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
            <div className={`w-2 h-2 rounded-full ${properties.length > 0 ? (isSimulated ? 'bg-amber-500 animate-pulse' : 'bg-green-500 animate-pulse') : 'bg-gray-400'}`} />
            <span className="text-xs font-mono font-medium text-gray-600">
              {properties.length > 0
                ? (isSimulated ? `SIMULATION: ${properties.length} NODES` : `LIVE FEED: ${properties.length} SIGNALS`)
                : "FEED OFFLINE"
              }
            </span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex gap-2">
            {['DASHBOARD', 'MAP', 'SETTINGS'].map(tab => (
              <button key={tab} className="text-xs font-bold text-gray-500 hover:text-zenith-accent px-3 py-2 transition-colors">
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-16 bg-gray-50">

        {/* LEFT SIDEBAR: THE DATA FEED (Always Visible) */}
        <div className="w-[450px] flex flex-col border-r border-gray-200 bg-white h-full shadow-xl z-20">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Priority Targets</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setProperties(MOCK_PROPERTIES)}
                className="flex-1 py-2 bg-white border border-gray-200 rounded shadow-sm text-center text-xs font-bold text-gray-700 hover:border-zenith-accent transition-all"
              >
                All ({MOCK_PROPERTIES.length})
              </button>
              <button
                onClick={() => setProperties(MOCK_PROPERTIES.filter(p => p.motivationScore > 80))}
                className="flex-1 py-2 bg-red-50 border border-red-100 rounded text-center text-xs font-bold text-red-600 hover:bg-red-100 transition-all"
              >
                Distress ({MOCK_PROPERTIES.filter(p => p.motivationScore > 80).length})
              </button>
              <button
                onClick={() => setProperties(MOCK_PROPERTIES.filter(p => (p.equity / p.estimatedValue) > 0.5))}
                className="flex-1 py-2 bg-green-50 border border-green-100 rounded text-center text-xs font-bold text-green-600 hover:bg-green-100 transition-all"
              >
                High Equity
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {properties.map(prop => (
              <div
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md group relative overflow-hidden
                            ${selectedProperty?.id === prop.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-zenith-accent/50'
                  }
                        `}
              >
                {/* Distress Tag */}
                {prop.status !== 'OFF_MARKET' && (
                  <div className="absolute top-0 right-0 px-2 py-1 bg-red-600 rounded-bl-lg">
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">{prop.status.replace("_", " ")}</span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-bold text-sm mb-1 ${selectedProperty?.id === prop.id ? 'text-white' : 'text-gray-900'}`}>{prop.address}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${selectedProperty?.id === prop.id ? 'border-white/20 text-gray-300' : 'border-gray-200 text-gray-500'
                        }`}>
                        {prop.type}
                      </span>
                      <span className={`text-[10px] font-mono ${selectedProperty?.id === prop.id ? 'text-zenith-accent' : 'text-gray-400'}`}>
                        {prop.ownerType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className={`text-[9px] uppercase tracking-wider block mb-0.5 ${selectedProperty?.id === prop.id ? 'text-gray-500' : 'text-gray-400'}`}>Est. Equity</span>
                    <span className={`text-sm font-black font-mono ${selectedProperty?.id === prop.id ? 'text-white' : 'text-gray-900'}`}>${prop.equity.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] uppercase tracking-wider block mb-0.5 ${selectedProperty?.id === prop.id ? 'text-gray-500' : 'text-gray-400'}`}>Motivation</span>
                    <div className="flex items-center justify-end gap-1">
                      <span className={`text-sm font-black font-mono ${prop.motivationScore > 80 ? 'text-red-500' : 'text-zenith-accent'}`}>{prop.motivationScore}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${prop.motivationScore > 80 ? 'bg-red-500 animate-pulse' : 'bg-zenith-accent'}`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State/Loading/Error Placeholder */}
            {properties.length === 0 && (
              <div className="text-center py-10 opacity-50 flex flex-col items-center">
                {isLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
                    <span className="text-xs font-mono text-gray-500">ACCESSING LIVE SATELLITE FEED...</span>
                  </>
                ) : errorMsg ? (
                  <>
                    <AlertOctagon className="w-8 h-8 mb-2 text-red-500" />
                    <span className="text-xs font-bold text-red-500 tracking-widest">{errorMsg}</span>
                    <p className="text-[10px] text-gray-500 mt-2 max-w-[200px]">
                      Ensure NEXT_PUBLIC_RENTCAST_KEY is set in Cloudflare or local .env
                    </p>
                  </>
                ) : (
                  <>
                    <Radio className="w-8 h-8 mb-2 text-gray-300" />
                    <span className="text-xs font-mono text-gray-500">SYSTEM IDLE. AWAITING TARGET.</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: THE MAP & DETAIL OVERLAY */}
        <div className="flex-1 relative bg-gray-100">
          <MapEngine
            properties={properties}
            onPropertySelect={setSelectedProperty}
            onBoundsChange={handleBoundsChange}
          />

          {/* Map Controls / Legend */}
          <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur rounded-xl border border-gray-200 shadow-lg text-[10px] font-mono z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600">PRE-FORECLOSURE / TAX LIEN</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zenith-accent" />
              <span className="text-gray-600">HIGH EQUITY / ABSENTEE</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM DATA TICKER */}
      <div className="absolute bottom-4 left-8 right-8 h-8 flex items-center justify-between border-t border-white/5 pointer-events-none z-30">
        <div className="flex gap-8 items-center text-[8px] font-mono tracking-[0.3em] opacity-30 uppercase">
          <span>LAT: 30.2672</span>
          <span>LNG: -97.7431</span>
          <span>ALT: 4.2km</span>
        </div>
        <div className="flex gap-4 items-center text-[8px] font-mono tracking-[0.3em] opacity-30 uppercase">
          <span>PARCEL_COUNT: {properties.length}</span>
          <span>SIGNAL_TYPES: TAX_DELINQUENT, PRE_FORECLOSURE, ABSENTEE</span>
        </div>
      </div>

      {/* PROPERTY DETAIL PANEL */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="absolute right-4 top-4 bottom-4 w-[420px] glass-panel rounded-[2rem] p-10 flex flex-col z-50 pointer-events-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Fingerprint className="w-4 h-4 text-zenith-accent" />
                  <span className="text-[10px] font-mono tracking-[0.4em] text-zenith-accent uppercase">Verified Signal Entry</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight leading-tight text-white mb-2">{selectedProperty.address}</h2>
                <div className="flex items-center gap-2 opacity-40 mb-1">
                  <Activity className="w-3 h-3" />
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase">PARCEL_ID: {selectedProperty.id}</span>
                </div>
                {selectedProperty.county && (
                  <div className="flex items-center gap-2 text-zenith-accent/60">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[8px] font-mono tracking-[0.2em] uppercase">SOURCE: {selectedProperty.county} COUNTY ASSESSOR</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-3 hover:bg-white/5 rounded-2xl text-zenith-muted hover:text-white transition-all group"
              >
                <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
              </button>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center">
                <span className="text-[8px] font-mono tracking-widest text-zenith-muted uppercase mb-1">Status</span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase
                  ${selectedProperty.status === 'PRE_FORECLOSURE' ? 'text-zenith-distress' : 'text-white'}
                `}>{selectedProperty.status.replace("_", " ")}</span>
              </div>
              <div className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center">
                <span className="text-[8px] font-mono tracking-widest text-zenith-muted uppercase mb-1">Owner Type</span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase
                  ${selectedProperty.ownerType === 'ABSENTEE' ? 'text-zenith-warn' : 'text-white'}
                `}>{selectedProperty.ownerType}</span>
              </div>
            </div>

            {/* Deep Intel: Distress Signals */}
            {(selectedProperty.distressSignal || selectedProperty.status !== 'OFF_MARKET') && (
              <div className="mb-6 p-5 rounded-2xl bg-zenith-distress/10 border border-zenith-distress/30 relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <AlertOctagon className="w-8 h-8 text-zenith-distress shrink-0 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-black tracking-[0.2em] text-zenith-distress uppercase mb-2">
                      {selectedProperty.distressSignal?.type.replace("_", " ") || "MARKET SIGNAL DETECTED"}
                    </h3>
                    <p className="text-[11px] font-mono text-white/80 leading-relaxed mb-3">
                      {selectedProperty.distressSignal?.description || "High verification of seller motivation based on behavioral patterns."}
                    </p>
                    {selectedProperty.distressSignal?.date && (
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-black/40 rounded border border-zenith-distress/20">
                        <span className="text-[8px] uppercase tracking-widest text-zenith-distress">Recorded:</span>
                        <span className="text-[9px] font-mono font-bold">{selectedProperty.distressSignal.date}</span>
                      </div>
                    )}
                    {selectedProperty.distressSignal?.amount && (
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-black/40 rounded border border-zenith-distress/20 ml-2">
                        <span className="text-[8px] uppercase tracking-widest text-zenith-distress">Amount:</span>
                        <span className="text-[9px] font-mono font-bold">${selectedProperty.distressSignal.amount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Zenit Score Chart */}
            <div className="mb-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
              <div className="hidden absolute -top-10 -right-10 w-40 h-40 bg-zenith-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-mono">Motivation Score</span>
                  <div className="flex items-center gap-2">
                    <Target className={`w-4 h-4 ${selectedProperty.motivationScore > 80 ? 'text-zenith-distress' : 'text-zenith-accent'}`} />
                    <span className="text-[10px] font-mono uppercase tracking-widest leading-none">
                      {selectedProperty.motivationScore > 80 ? "Critical Asymmetry" : "Standard Motivation"}
                    </span>
                  </div>
                </div>
                <span className={`text-5xl font-mono font-black tracking-tighter
                  ${selectedProperty.motivationScore > 80 ? 'text-zenith-distress' : 'text-zenith-accent'}
                `}>{selectedProperty.motivationScore}</span>
              </div>
              <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedProperty.motivationScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${selectedProperty.motivationScore > 80 ? 'bg-zenith-distress shadow-[0_0_15px_rgba(255,51,51,0.5)]' : 'bg-zenith-accent shadow-[0_0_15px_rgba(0,255,148,0.5)]'}`}
                />
              </div>
            </div>

            {/* Financial Intelligence */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-white/20 transition-all">
                <span className="block text-[8px] uppercase tracking-[0.3em] text-zenith-muted mb-1 font-mono">Est. Equity</span>
                <span className="text-xl font-black text-white tracking-tighter mb-1 block">${selectedProperty.equity.toLocaleString()}</span>
                <span className="text-[9px] font-mono text-zenith-accent flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {Math.round((selectedProperty.equity / selectedProperty.estimatedValue) * 100)}% LTV
                </span>
              </div>
              <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-white/20 transition-all">
                <span className="block text-[8px] uppercase tracking-[0.3em] text-zenith-muted mb-1 font-mono">Last Sale</span>
                <span className="text-lg font-bold text-white tracking-tight mb-1 block">{selectedProperty.lastSaleDate || "N/A"}</span>
                <span className="text-[9px] font-mono text-white/40">Legacy Owner</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
              <AnimatePresence mode="wait">
                {revealedContact ? (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-3">
                      {revealedContact.phones.map((phone, i) => (
                        <button key={i} className="group relative overflow-hidden py-4 px-6 bg-white text-black font-bold rounded-2xl flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]">
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4" />
                            <span className="font-mono tracking-widest">{phone}</span>
                          </div>
                          <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            className="text-[10px] font-mono tracking-widest underline"
                          >
                            CALL
                          </motion.div>
                        </button>
                      ))}
                      {revealedContact.emails.map((email, i) => (
                        <button key={i} className="py-4 px-6 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center gap-3 transition-all hover:bg-white/10">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs font-mono tracking-tighter line-clamp-1">{email}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="reveal-btn"
                    onClick={handleRevealContact}
                    disabled={isSkipTracing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 transition-all disabled:opacity-50 overflow-hidden"
                  >
                    {isSkipTracing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-current" />
                        <span className="tracking-[0.2em] uppercase text-sm">Reveal Owner Intel</span>
                      </>
                    )}
                    {/* Animated shine effect */}
                    {!isSkipTracing && (
                      <motion.div
                        animate={{ x: [-500, 500] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 opacity-30"
                      />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>

              <button className="w-full py-5 bg-white/5 text-white/[0.6] font-bold rounded-3xl hover:bg-white/10 border border-white/5 transition-all text-xs tracking-widest uppercase flex items-center justify-center gap-4">
                <Layers className="w-4 h-4" />
                Add to Global Watchlist
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 opacity-20">
              <div className="h-[1px] flex-1 bg-white" />
              <span className="text-[8px] font-mono tracking-[0.5em] whitespace-nowrap">SECURE_DATA_FEED_01</span>
              <div className="h-[1px] flex-1 bg-white" />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
