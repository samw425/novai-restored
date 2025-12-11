'use client';

import { Shield, ArrowUpRight, BrainCircuit, Lock, Target, Activity, FileText, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface DossierViewProps {
    profile: any;
    latestFeedItem?: any;
}

export function DossierView({ profile, latestFeedItem }: DossierViewProps) {
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

                <div className="flex flex-col md:flex-row md:items-start md:justify-between relative z-10 mb-6 gap-4 flex-wrap">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shrink-0">
                                <Shield className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none break-words">
                                    {profile.acronym}
                                </h1>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 break-words">
                                    {profile.name}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            ACTIVE MONITORING
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                            EST. {profile.founded}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Director</div>
                        <div className="text-sm font-bold text-slate-900 break-words">{profile.director}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Budget</div>
                        <div className="text-sm font-bold text-slate-900 font-mono break-words">{profile.budget}</div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mission Directive</h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {profile.mission}
                    </p>
                </div>
            </div>

            {/* LIVE READ CARD */}
            {latestFeedItem && (
                <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Radio size={80} className="text-red-600" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                LIVE READ // {profile.acronym}
                            </h3>
                            <span className="text-[10px] font-mono text-red-400">
                                {new Date(latestFeedItem.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <a href={latestFeedItem.link} target="_blank" rel="noopener noreferrer" className="block group-hover:opacity-80 transition-opacity">
                            <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                                {latestFeedItem.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
                                {latestFeedItem.contentSnippet}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wide">
                                Read Full Report <ArrowUpRight size={10} />
                            </div>
                        </a>
                    </div>
                </div>
            )}

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
                            <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">Restricted Analysis // INTERNAL</h3>
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

            {/* Deep Dive / Education */}
            {profile.education_dossier && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        Agency Deep Dive
                    </h3>
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed">
                        <p className="whitespace-pre-line">{profile.education_dossier}</p>
                    </div>
                </div>
            )}

            {/* Official Channels */}
            {profile.official_links && profile.official_links.length > 0 && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ArrowUpRight size={16} className="text-slate-400" />
                        Official Channels
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {profile.official_links.map((link: any, i: number) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                            >
                                <div>
                                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {link.title}
                                    </div>
                                    {link.description && (
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            {link.description}
                                        </div>
                                    )}
                                </div>
                                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Issues & Discrepancies */}
            {profile.issues_discrepancies && (
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
                    <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-amber-600" />
                        Critical Analysis & Issues
                    </h3>
                    <div className="prose prose-sm prose-amber max-w-none text-amber-900/80 leading-relaxed">
                        <p className="whitespace-pre-line">{profile.issues_discrepancies}</p>
                    </div>
                </div>
            )}

            {/* Novai Analysis */}
            {profile.novai_analysis && profile.novai_analysis.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-purple-900 uppercase tracking-widest flex items-center gap-2 px-1">
                        <BrainCircuit size={16} className="text-purple-600" />
                        Novai Analysis
                    </h3>
                    {profile.novai_analysis.map((item: any, i: number) => (
                        <div key={i} className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200 uppercase tracking-wide">
                                    {item.type || 'Insight'}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                    {item.date}
                                </span>
                            </div>

                            <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors relative z-10">
                                {item.title}
                            </h4>

                            <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
