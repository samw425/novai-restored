'use client';

import { GLOBAL_POLICIES } from '@/lib/data/policy-data';
import { FileText, AlertTriangle, CheckCircle, Clock, ExternalLink, ShieldAlert } from 'lucide-react';

export function RegulationTable() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
                        <FileText className="w-5 h-5 text-blue-600" />
                        LEGISLATIVE DOCKET
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                        LIVE UPDATES
                    </span>
                </div>
            </div>

            {/* Mobile-first card layout */}
            <div className="space-y-4">
                {GLOBAL_POLICIES.map((bill) => (
                    <div key={bill.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                        {/* Header Row: Name + Status */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{bill.name}</h3>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                        {bill.region === 'EU' ? '🇪🇺 EU' :
                                            bill.region === 'US' ? '🇺🇸 US' :
                                                bill.region === 'CHINA' ? '🇨🇳 CN' :
                                                    bill.region === 'UK' ? '🇬🇧 UK' : '🌍 GLOBAL'}
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${bill.riskLevel === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
                                        bill.riskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                        {bill.riskLevel === 'HIGH' && <ShieldAlert className="w-3 h-3" />}
                                        {bill.riskLevel} IMPACT
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {bill.status === 'ENACTED' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                                    bill.status === 'IMPLEMENTATION' ? <Clock className="w-5 h-5 text-blue-500" /> :
                                        <Clock className="w-5 h-5 text-amber-500" />}
                                <span className={`text-sm font-bold uppercase tracking-wide ${bill.status === 'ENACTED' ? 'text-emerald-700' :
                                    bill.status === 'IMPLEMENTATION' ? 'text-blue-700' : 'text-amber-700'
                                    }`}>
                                    {bill.status}
                                </span>
                            </div>
                        </div>

                        {/* Impact Section - Full text, no truncation */}
                        <div className="relative pl-4 border-l-2 border-blue-500/30 mb-4">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                {bill.impact}
                            </p>
                        </div>

                        {/* Footer: Last Updated + Docket Link */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-400 font-mono">
                                Updated: {new Date(bill.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <a
                                href={bill.docketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View Official Docket
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-2">
                <button className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">
                    View Full Legislative Archive →
                </button>
            </div>
        </div>
    );
}
