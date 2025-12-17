"use client";

import { Shield, Zap, ArrowRight, Heart } from "lucide-react";
import { SUPPORT_PAYMENT_LINK } from "@/config/supportLinks";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-purple-50/50 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 md:p-12 relative z-10 transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)]">

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center mb-6 shadow-lg transform rotate-3">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>

                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Power the Signal</h1>
                    <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                        Novai is proudly independent. No ads, no paywalls, no outside investors.
                        We rely entirely on the community to fund our GPU clusters and keep real-time intelligence open to everyone.
                    </p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={() => window.location.href = SUPPORT_PAYMENT_LINK}
                        className="w-full group relative overflow-hidden rounded-xl bg-gray-900 px-8 py-4 text-white shadow-lg transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                        <span className="relative flex items-center justify-center gap-2 font-bold tracking-wide">
                            Support Novai <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-6">
                        <Shield className="w-3 h-3" />
                        <span>Secure Payment via Stripe</span>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                            Your contribution is non-transactional and helps sustain the platform infrastructure. Novai remains free for all.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
