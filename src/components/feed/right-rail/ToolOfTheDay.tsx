import React from 'react';
import { Wrench, ExternalLink } from 'lucide-react';

export function ToolOfTheDay() {
    return (
        <div className="bg-slate-900 rounded-2xl p-5 shadow-lg text-white mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    Tool of the Day
                </h3>
            </div>

            <div className="mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3">
                    <span className="text-slate-900 font-black text-lg">L</span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">LangChain</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Framework for developing applications powered by language models. Essential for chaining prompts.
                </p>
            </div>

            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2">
                Try Tool <ExternalLink size={12} />
            </button>
        </div>
    );
}
