'use client';

import Link from 'next/link';
import { Crown, ArrowRight, Heart } from 'lucide-react';

export function SupportPromo() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all duration-300">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-purple-50/30 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100">
                        <Crown className="w-3 h-3 text-purple-600 fill-purple-600" />
                        <span className="text-[10px] font-bold text-purple-700 tracking-wider uppercase">Founding Member</span>
                    </span>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                    Power the <span className="text-purple-600">Signal.</span>
                </h3>

                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-5">
                    Join the inner circle. 100% Independent. User-supported intelligence.
                </p>

                <Link
                    href="/support"
                    className="flex items-center justify-between w-full bg-slate-900 hover:bg-slate-800 text-white p-1 pl-4 rounded-xl transition-all group/btn shadow-md hover:shadow-lg"
                >
                    <span className="text-xs font-bold uppercase tracking-wider">Back the Mission</span>
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover/btn:scale-110 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
