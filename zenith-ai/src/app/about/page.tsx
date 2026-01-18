"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hexagon, Target, Shield, Zap, Database, ChevronLeft } from "lucide-react";

export default function AboutPage() {
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
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/20 mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#00FF9D]">About Zenith Intelligence</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6"
                    >
                        Institutional-Grade<br />
                        <span className="text-[#00FF9D]">Property Intelligence</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
                    >
                        Zenith AI is the sovereign intelligence platform for off-market real estate discovery.
                        We aggregate data from government records, institutional feeds, and proprietary algorithms
                        to surface opportunities invisible to the public eye.
                    </motion.p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                title: "Off-Market Discovery",
                                description: "Access properties before they hit the market. Our algorithms identify motivated sellers through tax delinquency, pre-foreclosure, and equity signals."
                            },
                            {
                                icon: Database,
                                title: "Multi-Source Intelligence",
                                description: "Data synthesized from 3,000+ county databases, ArcGIS tax parcels, RentCast valuations, and institutional feeds."
                            },
                            {
                                icon: Shield,
                                title: "Sovereign Verification",
                                description: "Every property is audited by our Council of AI Agents to ensure data accuracy and investment viability."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#00FF9D]/10 border border-[#00FF9D]/20 flex items-center justify-center mb-6">
                                    <feature.icon className="w-6 h-6 text-[#00FF9D]" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3">{feature.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 px-6 border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Our Mission</h2>
                    <p className="text-white/50 leading-relaxed text-lg">
                        We believe institutional-grade real estate intelligence should be accessible to every investor.
                        Zenith democratizes the data advantages that hedge funds and REITs have held for decades.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#00FF9D] text-black font-black uppercase tracking-widest text-sm rounded-xl hover:scale-105 transition-transform"
                    >
                        <Zap className="w-4 h-4" />
                        Enter the Terminal
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Hexagon className="w-5 h-5 text-[#00FF9D]" />
                        <span className="text-xs font-black tracking-[0.3em] uppercase text-white/40">Zenith Intelligence</span>
                    </div>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">© 2026 Zenith Alpha Core</span>
                </div>
            </footer>
        </main>
    );
}
