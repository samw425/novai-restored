'use client';

import { LLM_BENCHMARKS, LLMModel } from '@/lib/data/llm-benchmarks';
import { Trophy, Zap, Code, Calculator, DollarSign, Brain } from 'lucide-react';

export function ModelLeaderboard() {
    // Sort by MMLU score descending
    const sortedModels = [...LLM_BENCHMARKS].sort((a, b) => b.mmlu - a.mmlu);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Intelligence Leaderboard
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                        Ranking the world's most powerful models by reasoning capability (MMLU).
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                        LIVE BENCHMARKS
                    </span>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 w-[5%]">Rank</th>
                                <th className="px-6 py-4 w-[25%]">Model</th>
                                <th className="px-6 py-4 w-[15%]">Reasoning (MMLU)</th>
                                <th className="px-6 py-4 w-[15%]">Math (GSM8K)</th>
                                <th className="px-6 py-4 w-[15%]">Coding (HumanEval)</th>
                                <th className="px-6 py-4 w-[25%]">Cost (In/Out per 1M)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedModels.map((model, index) => (
                                <tr key={model.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                index === 1 ? 'bg-slate-200 text-slate-700' :
                                                    index === 2 ? 'bg-orange-100 text-orange-800' : 'text-slate-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{model.name}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-mono text-slate-400 uppercase">{model.provider}</span>
                                            {model.type === 'Open Source' && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase border border-emerald-100">
                                                    Open Source
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Brain className="w-3 h-3 text-slate-400" />
                                            <span className={`font-mono font-bold ${index === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                {model.mmlu}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calculator className="w-3 h-3 text-slate-400" />
                                            <span className="font-mono text-slate-600">{model.math}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Code className="w-3 h-3 text-slate-400" />
                                            <span className="font-mono text-slate-600">{model.code}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 font-mono text-xs text-slate-600">
                                            <span className="text-slate-400">$</span>
                                            {model.inputPrice.toFixed(2)}
                                            <span className="text-slate-300 mx-1">/</span>
                                            <span className="text-slate-400">$</span>
                                            {model.outputPrice.toFixed(2)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
