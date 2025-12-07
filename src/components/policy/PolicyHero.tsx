'use client';

import { Globe, ShieldCheck, Zap, Scale } from 'lucide-react';
import { SOVEREIGN_DATA } from '@/lib/data/policy-data';

export function PolicyHero() {
    return (
        <div className="w-full mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Text Content */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                        <Globe className="w-3 h-3" />
                        <span>Global Governance Tracker</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                        THE RULES OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            THE GAME
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
                        Tracking the global race to regulate Artificial General Intelligence.
                        From the EU's strict safety protocols to the UAE's open-source acceleration.
                    </p>

                    <div className="flex items-center gap-6 pt-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900">32</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Bills</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900">14</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nations Tracking</span>
                        </div>
                    </div>
                </div>

                {/* Visual: Sovereignty Map (Abstract) */}
                <div className="relative h-full min-h-[300px] bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sovereignty Index</h3>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {SOVEREIGN_DATA.map((nation) => (
                            <div key={nation.country} className="group">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-bold text-sm text-slate-700">{nation.country}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${nation.stance === 'ACCELERATOR' ? 'text-emerald-600' :
                                        nation.stance === 'REGULATOR' ? 'text-red-600' : 'text-amber-600'
                                        }`}>
                                        {nation.stance}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${nation.stance === 'ACCELERATOR' ? 'bg-emerald-500' :
                                            nation.stance === 'REGULATOR' ? 'bg-red-500' : 'bg-amber-500'
                                            }`}
                                        style={{ width: `${nation.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between text-[10px] font-mono text-slate-400">
                        <span>RESTRICTION (0)</span>
                        <span>ACCELERATION (100)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
