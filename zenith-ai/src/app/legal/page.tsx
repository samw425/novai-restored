"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hexagon, ChevronLeft, Scale, Shield, FileText } from "lucide-react";

export default function LegalPage() {
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                    >
                        <Scale className="w-3 h-3 text-white/60" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Legal</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-6"
                    >
                        Terms & Privacy
                    </motion.h1>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* Terms of Service */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-2xl bg-white/[0.02] border border-white/5"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-5 h-5 text-[#00FF9D]" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Terms of Service</h2>
                        </div>
                        <div className="space-y-4 text-sm text-white/50 leading-relaxed">
                            <p>
                                By accessing Zenith AI, you agree to these terms. The platform provides property intelligence
                                for informational purposes only and does not constitute financial, investment, or legal advice.
                            </p>
                            <p>
                                <strong className="text-white">Data Accuracy:</strong> While we strive for accuracy, property data
                                comes from third-party sources and may contain errors. Users should verify all information
                                independently before making investment decisions.
                            </p>
                            <p>
                                <strong className="text-white">Acceptable Use:</strong> You agree not to scrape, reverse-engineer,
                                or use the platform for any unlawful purpose. API access is subject to rate limits and separate terms.
                            </p>
                            <p>
                                <strong className="text-white">Intellectual Property:</strong> All algorithms, interfaces, and
                                proprietary data remain the exclusive property of Zenith Intelligence.
                            </p>
                        </div>
                    </motion.div>

                    {/* Privacy Policy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-2xl bg-white/[0.02] border border-white/5"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-[#00FF9D]" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Privacy Policy</h2>
                        </div>
                        <div className="space-y-4 text-sm text-white/50 leading-relaxed">
                            <p>
                                <strong className="text-white">Data Collection:</strong> We collect minimal personal data necessary
                                to operate the service. Searches and saved properties are stored locally in your browser.
                            </p>
                            <p>
                                <strong className="text-white">Waitlist Information:</strong> Email addresses submitted through
                                the waitlist are used solely for product updates and will not be sold to third parties.
                            </p>
                            <p>
                                <strong className="text-white">Analytics:</strong> We use privacy-respecting analytics to improve
                                the platform. No personally identifiable information is shared with advertisers.
                            </p>
                            <p>
                                <strong className="text-white">Data Security:</strong> All communications are encrypted via TLS.
                                We do not store sensitive financial information.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <div className="text-center text-sm text-white/30">
                        <p>Questions about our terms or privacy practices?</p>
                        <p className="mt-2">Contact: <span className="text-white/50">legal@zenith-ai.com</span></p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <Hexagon className="w-5 h-5 text-[#00FF9D]" />
                        <span className="text-xs font-black tracking-[0.3em] uppercase text-white/40">Zenith Intelligence</span>
                    </Link>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">Last Updated: January 2026</span>
                </div>
            </footer>
        </main>
    );
}
