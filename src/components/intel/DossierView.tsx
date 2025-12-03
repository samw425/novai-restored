'use client';

import { Shield, ArrowUpRight, BrainCircuit, Lock, Target, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface DossierViewProps {
    profile: any;
}

export function DossierView({ profile }: DossierViewProps) {
    if (!profile) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full flex flex-col gap-6"
        >
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-start justify-between relative z-10 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                                <Shield className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                    {profile.acronym}
                                </h1>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {profile.name}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            ACTIVE MONITORING
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                            EST. {profile.founded}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Director</div>
                        <div className="text-sm font-bold text-slate-900">{profile.director}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Budget</div>
                        <div className="text-sm font-bold text-slate-900 font-mono">{profile.budget}</div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mission Directive</h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {profile.mission}
                    </p>
                </div>
            </div>

            {/* AI Stance Card */}
            {profile.ai_stance && (
                <div className="bg-blue-600 rounded-2xl border border-blue-500 shadow-lg p-6 text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af_1px,transparent_1px),linear-gradient(to_bottom,#1e40af_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>
                    <div className="absolute -right-10 -bottom-10 text-blue-500 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <BrainCircuit size={150} />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <BrainCircuit size={16} className="text-blue-300" />
                            AI Strategy & Integration
                        </h3>
                        <p className="text-sm font-medium leading-relaxed text-blue-50">
                            {profile.ai_stance}
                        </p>
                    </div>
                </div>
            )}

            {/* Classified Annex */}
            {profile.classified_annex && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-6 text-slate-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Lock size={80} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock size={16} className="text-amber-500" />
                            <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">Classified Annex // NOFORN</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="text-xs font-mono text-slate-500 uppercase">Codename</span>
                                <span className="text-sm font-mono font-bold text-white">{profile.classified_annex.codename}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                <span className="text-xs font-mono text-slate-500 uppercase">Black Budget</span>
                                <span className="text-sm font-mono font-bold text-emerald-400">{profile.classified_annex.shadow_budget}</span>
                            </div>
                            <div>
                                <span className="text-xs font-mono text-slate-500 uppercase block mb-2">Unacknowledged Projects</span>
                                <div className="flex flex-wrap gap-2">
                                    {profile.classified_annex.unacknowledged_projects.map((p: string) => (
                                        <span key={p} className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
