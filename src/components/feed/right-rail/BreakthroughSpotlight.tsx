import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export function BreakthroughSpotlight() {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 shadow-lg text-white mb-6 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">
                        Breakthrough Spotlight
                    </span>
                </div>

                <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-indigo-100 transition-colors">
                    GPT-5 "Orion" Rumors Intensify
                </h3>

                <p className="text-xs text-indigo-100/80 leading-relaxed mb-4 line-clamp-3">
                    New reports suggest OpenAI's next frontier model may achieve 100x reasoning capabilities over current benchmarks.
                </p>

                <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2">
                    Read Analysis <ArrowUpRight size={12} />
                </button>
            </div>
        </div>
    );
}
