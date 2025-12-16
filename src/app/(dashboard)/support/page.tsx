'use client';

import { Check, Heart, Shield, Zap, Crown, Star } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

export default function SupportPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 sm:px-0">
            {/* Hero Section */}
            <div className="relative text-center py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-600 mb-6 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-mono font-bold text-amber-100 tracking-wider">FOUNDING MEMBER ACCESS</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Power the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">Intelligence Engine</span>
                    </h1>

                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                        Novai is building the "God's Eye View" of the singularity. We are 100% independent, ad-free, and user-supported. Join the inner circle to keep the signal live.
                    </p>

                    <a
                        href="https://buy.stripe.com/fZu00ia5a6VefeKcBp3Nm01"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] group"
                    >
                        <Crown className="w-5 h-5 text-purple-600" />
                        Become a Founding Supporter
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>

                    <p className="mt-4 text-xs text-slate-500 font-mono">
                        Secure one-time contribution via Stripe. Choose any amount.
                    </p>
                </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: <Zap className="w-6 h-6 text-amber-400" />,
                        title: "Priority Access",
                        description: "Guaranteed lifetime lock-in for future Pro features and early access to new tools.",
                        gradient: "from-amber-500/20 to-orange-500/5"
                    },
                    {
                        icon: <Shield className="w-6 h-6 text-purple-400" />,
                        title: "100% Signal",
                        description: "No ads. No tracker networks. No VC influence. Just pure, unfiltered intelligence.",
                        gradient: "from-purple-500/20 to-blue-500/5"
                    },
                    {
                        icon: <Heart className="w-6 h-6 text-rose-400" />,
                        title: "Community Core",
                        description: "Directly support server costs and API fees to keep this platform running for everyone.",
                        gradient: "from-rose-500/20 to-pink-500/5"
                    }
                ].map((item, i) => (
                    <div key={i} className={`p-6 rounded-2xl border border-slate-200 bg-gradient-to-br ${item.gradient} backdrop-blur-sm hover:border-slate-300 transition-colors`}>
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Trust Footer */}
            <div className="text-center pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-400 font-mono">
                    SECURE PAYMENTS PROCESSED BY STRIPE • 100% SECURE & ENCRYPTED
                </p>
            </div>
        </div>
    );
}
