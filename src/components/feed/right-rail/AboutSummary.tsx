import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AboutSummary() {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Shield className="w-5 h-5 text-slate-900" />
            </div>

            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">
                About Novai
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                We aggregate, filter, and analyze global intelligence streams to provide a noise-free signal for decision makers.
            </p>

            <Link href="/about" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wide">
                Our Mission <ArrowRight size={12} />
            </Link>
        </div>
    );
}
