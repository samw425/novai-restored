"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
    Search, Home, MessageCircle, Handshake,
    DollarSign, Shield, Zap, Users, ArrowRight,
    CheckCircle, TrendingUp, Lock
} from "lucide-react";

export default function HowItWorksPage() {
    const buyerSteps = [
        {
            step: 1,
            icon: Search,
            title: "Search Properties",
            description: "Browse thousands of off-market properties, FSBO listings, and motivated seller deals. Filter by location, price, and property type.",
        },
        {
            step: 2,
            icon: Home,
            title: "Find Your Match",
            description: "View property details, estimated values, and seller motivation scores. Save your favorites and get alerts for new listings.",
        },
        {
            step: 3,
            icon: MessageCircle,
            title: "Contact Owner Directly",
            description: "Send inquiries directly to property owners. No agents, no middlemen. Schedule showings on your terms.",
        },
        {
            step: 4,
            icon: Handshake,
            title: "Close the Deal",
            description: "Negotiate directly and save thousands on agent commissions. Use our resources to find title companies and attorneys.",
        },
    ];

    const sellerSteps = [
        {
            step: 1,
            icon: Home,
            title: "List Your Property",
            description: "Create a listing in minutes. Enter your address and we'll auto-fill property details. Add photos and set your price.",
        },
        {
            step: 2,
            icon: TrendingUp,
            title: "Get Your ZenEstimate",
            description: "See our data-driven estimated value for your property. Use market insights to price competitively.",
        },
        {
            step: 3,
            icon: Users,
            title: "Receive Buyer Inquiries",
            description: "Qualified buyers contact you directly through our platform. Review inquiries and respond on your schedule.",
        },
        {
            step: 4,
            icon: DollarSign,
            title: "Sell & Save",
            description: "Close the deal and keep your equity. No 6% agent commission. You save an average of $24,000 per transaction.",
        },
    ];

    const benefits = [
        {
            icon: DollarSign,
            title: "Save $24,000+",
            description: "Skip the 6% agent commission on a $400,000 home. That's $24,000 back in your pocket.",
            color: "bg-green-50 text-green-600",
        },
        {
            icon: Zap,
            title: "Faster Transactions",
            description: "Direct communication means faster negotiations. Close deals in weeks, not months.",
            color: "bg-blue-50 text-blue-600",
        },
        {
            icon: Shield,
            title: "Verified Owners",
            description: "Every listing is verified. Connect with real property owners, not wholesalers or scammers.",
            color: "bg-purple-50 text-purple-600",
        },
        {
            icon: Lock,
            title: "Privacy First",
            description: "Your contact info is protected until you choose to share it. You're always in control.",
            color: "bg-orange-50 text-orange-600",
        },
    ];

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        The Future of Real Estate is P2P
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                    >
                        Zenith connects property buyers and sellers directly. No agents, no commissions,
                        no middlemen. Just you and the other party, making a deal that works.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link href="/search" className="btn btn-primary btn-lg">
                            Browse Properties
                        </Link>
                        <Link href="/list-property" className="btn btn-secondary btn-lg">
                            List Your Property
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* For Buyers Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                            For Buyers
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Find Your Next Property
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover off-market deals and connect directly with motivated sellers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {buyerSteps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {index < buyerSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200" />
                                )}

                                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-[var(--zenith-blue)] text-white flex items-center justify-center text-lg font-bold mb-4">
                                        {item.step}
                                    </div>
                                    <item.icon className="w-8 h-8 text-[var(--zenith-blue)] mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Sellers Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                            For Sellers
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Sell Without Agents
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            List your property for free and connect with qualified buyers directly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {sellerSteps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {index < sellerSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-300" />
                                )}

                                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold mb-4">
                                        {item.step}
                                    </div>
                                    <item.icon className="w-8 h-8 text-green-500 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Zenith?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're not just another listing site. We're changing how real estate works.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                            >
                                <div className={`w-12 h-12 rounded-xl ${benefit.color} flex items-center justify-center mb-4`}>
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Is Zenith a real estate brokerage?",
                                a: "No. Zenith is a technology platform that connects buyers and sellers directly. We do not represent either party, negotiate deals, or provide legal/financial advice. We're more like Craigslist or Facebook Marketplace for real estate.",
                            },
                            {
                                q: "How much does it cost?",
                                a: "Browsing properties is free. Sellers can list for free or upgrade to premium for enhanced visibility. We never charge percentage-based commissions like traditional agents.",
                            },
                            {
                                q: "Are the listings verified?",
                                a: "Yes. We verify property ownership before listings go live. This protects buyers from scams and ensures you're talking to real owners.",
                            },
                            {
                                q: "Do I need a real estate agent?",
                                a: "No. That's the whole point! You can buy or sell directly, saving thousands on commissions. However, we recommend hiring a real estate attorney and title company to handle the legal paperwork.",
                            },
                            {
                                q: "How do I know the price is fair?",
                                a: "Every property includes our ZenEstimate — a data-driven valuation based on comparable sales, market trends, and property characteristics. Use it as a starting point for negotiations.",
                            },
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 border border-gray-200"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600 text-sm">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-[#006AFF] to-[#3B82F6]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-white/80 mb-8">
                        Join thousands of buyers and sellers who are saving money with Zenith.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/search" className="btn btn-lg bg-white text-[var(--zenith-blue)] hover:bg-gray-100">
                            Find Properties
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/list-property" className="btn btn-lg bg-white/10 text-white border-2 border-white/30 hover:bg-white/20">
                            List Your Property
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
