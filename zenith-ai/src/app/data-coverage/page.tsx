"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hexagon, Database, Globe, ChevronLeft, Check, MapPin } from "lucide-react";

const DATA_SOURCES = [
    { name: "ArcGIS Tax Parcels", coverage: "3,000+ Counties", status: "ACTIVE" },
    { name: "RentCast API", coverage: "Nationwide", status: "ACTIVE" },
    { name: "Socrata Open Data", coverage: "Major Metros", status: "ACTIVE" },
    { name: "Nominatim Geocoding", coverage: "Global", status: "ACTIVE" },
    { name: "OpenStreetMap", coverage: "Global", status: "ACTIVE" },
    { name: "RealityMole Skip Trace", coverage: "Nationwide", status: "STANDBY" },
    { name: "Zillow API", coverage: "Nationwide", status: "STANDBY" },
];

const COVERED_STATES = [
    "Texas", "Florida", "California", "Arizona", "Nevada", "Colorado",
    "Georgia", "North Carolina", "Tennessee", "Ohio", "Michigan", "Illinois",
    "Pennsylvania", "New York", "New Jersey", "Massachusetts", "Washington",
    "Oregon", "Utah", "Indiana", "Missouri", "Kentucky", "Alabama", "Louisiana"
];

export default function DataCoveragePage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white font-sans">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <ChevronLeft className="w-4 h-4 text-white/40" />
                        <Hexagon className="w-6 h-6 text-[#00FF9D]" />
                        <span className="text-sm font-black tracking-[0.3em] uppercase">Zenith</span>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
                    >
                        <Database className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Data Infrastructure</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase mb-6"
                    >
                        Nationwide<br />
                        <span className="text-[#00FF9D]">Data Coverage</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto"
                    >
                        Real-time property intelligence from government databases, institutional feeds, and proprietary sources across the United States.
                    </motion.p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-6 border-y border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Counties Covered", value: "3,000+" },
                        { label: "Properties Indexed", value: "50M+" },
                        { label: "Data Sources", value: "7" },
                        { label: "Update Frequency", value: "Real-Time" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl md:text-4xl font-black text-[#00FF9D] mb-2">{stat.value}</div>
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Sources Table */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Data Sources</h2>
                    <div className="space-y-3">
                        {DATA_SOURCES.map((source, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${source.status === 'ACTIVE' ? 'bg-[#00FF9D]' : 'bg-yellow-500'}`} />
                                    <span className="font-bold">{source.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-white/40">{source.coverage}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${source.status === 'ACTIVE' ? 'bg-[#00FF9D]/10 text-[#00FF9D]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {source.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* State Coverage */}
            <section className="py-16 px-6 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                        <Globe className="w-6 h-6 text-[#00FF9D]" />
                        State Coverage
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {COVERED_STATES.map((state, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                <Check className="w-3 h-3 text-[#00FF9D]" />
                                <span className="text-sm">{state}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-white/30 text-sm mt-8">
                        + All remaining US states with varying coverage levels
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <Hexagon className="w-5 h-5 text-[#00FF9D]" />
                        <span className="text-xs font-black tracking-[0.3em] uppercase text-white/40">Zenith Intelligence</span>
                    </Link>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">© 2026 Zenith Alpha Core</span>
                </div>
            </footer>
        </main>
    );
}
