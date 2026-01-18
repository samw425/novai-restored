"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Check, X, Zap, Crown, Building2 } from "lucide-react";

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Perfect for casual buyers exploring the market.",
            icon: Zap,
            color: "bg-gray-100 text-gray-600",
            buttonStyle: "btn-secondary",
            features: [
                { text: "Browse all properties", included: true },
                { text: "10 saved properties", included: true },
                { text: "3 owner contacts/month", included: true },
                { text: "Basic filters", included: true },
                { text: "Email support", included: true },
                { text: "Advanced filters", included: false },
                { text: "Market analytics", included: false },
                { text: "Priority support", included: false },
            ],
        },
        {
            name: "Pro",
            price: "$29",
            period: "per month",
            description: "For serious buyers and individual investors.",
            icon: Crown,
            color: "bg-blue-100 text-[var(--zenith-blue)]",
            buttonStyle: "btn-primary",
            popular: true,
            features: [
                { text: "Everything in Free", included: true },
                { text: "Unlimited saved properties", included: true },
                { text: "50 owner contacts/month", included: true },
                { text: "Advanced filters", included: true },
                { text: "Motivation scores", included: true },
                { text: "Market analytics", included: true },
                { text: "Priority support", included: true },
                { text: "API access", included: false },
            ],
        },
        {
            name: "Investor",
            price: "$99",
            period: "per month",
            description: "For teams and professional investors.",
            icon: Building2,
            color: "bg-purple-100 text-purple-600",
            buttonStyle: "btn-secondary",
            features: [
                { text: "Everything in Pro", included: true },
                { text: "Unlimited owner contacts", included: true },
                { text: "Bulk skip trace (250/mo)", included: true },
                { text: "API access", included: true },
                { text: "Team seats (up to 5)", included: true },
                { text: "Export to CSV", included: true },
                { text: "Dedicated account manager", included: true },
                { text: "Custom integrations", included: true },
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                    >
                        Simple, Transparent Pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        No hidden fees. No percentage commissions. Just flat pricing that saves you thousands.
                    </motion.p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white rounded-2xl border-2 ${plan.popular ? "border-[var(--zenith-blue)] shadow-lg" : "border-gray-200"
                                    } p-8`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--zenith-blue)] text-white text-sm font-semibold rounded-full">
                                        Most Popular
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center mb-4`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500">/{plan.period}</span>
                                </div>

                                <Link
                                    href="/signup"
                                    className={`btn w-full ${plan.buttonStyle} mb-6`}
                                >
                                    Get Started
                                </Link>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm">
                                            {feature.included ? (
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                            )}
                                            <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seller Pricing */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        For Sellers: List for Free
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Unlike traditional agents who charge 5-6% commission, Zenith lets you list your property
                        for free. Reach qualified buyers directly and keep your equity.
                    </p>

                    <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-md mx-auto">
                        <div className="text-5xl font-bold text-[var(--zenith-blue)] mb-2">$0</div>
                        <div className="text-gray-500 mb-6">to list your property</div>

                        <ul className="text-left space-y-3 mb-8">
                            {[
                                "Unlimited photos",
                                "Property analytics",
                                "Direct buyer inquiries",
                                "ZenEstimate valuation",
                                "Featured listing upgrades available",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <Check className="w-5 h-5 text-green-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link href="/list-property" className="btn btn-primary w-full">
                            List Your Property
                        </Link>
                    </div>
                </div>
            </section>

            {/* Commission Comparison */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        See How Much You Save
                    </h2>

                    <div className="bg-gradient-to-r from-[#006AFF] to-[#3B82F6] rounded-2xl p-8 text-white">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-white/80">Traditional Agent</h3>
                                <div className="text-4xl font-bold mb-2">$24,000</div>
                                <p className="text-white/70">6% commission on a $400K home</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-white/80">With Zenith</h3>
                                <div className="text-4xl font-bold mb-2">$0 - $99</div>
                                <p className="text-white/70">Flat subscription or free</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <div className="text-center">
                                <div className="text-2xl font-bold">You Save: $23,901+</div>
                                <p className="text-white/70 mt-2">That's money for renovations, moving costs, or your next investment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Pricing FAQ
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Can I cancel anytime?",
                                a: "Yes! All paid plans are month-to-month with no long-term contracts. Cancel anytime with one click.",
                            },
                            {
                                q: "What are 'owner contacts'?",
                                a: "Owner contacts are skip trace credits that reveal property owner phone numbers and emails. Use them to reach out to off-market property owners directly.",
                            },
                            {
                                q: "Do you charge when I close a deal?",
                                a: "Never. We charge flat, predictable fees — not percentage commissions. Your savings are yours to keep.",
                            },
                            {
                                q: "Is there a free trial of Pro?",
                                a: "Yes! New users get a 7-day free trial of Pro features. No credit card required.",
                            },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
