'use client';

import { GLOBAL_POLICIES } from '@/lib/data/policy-data';
import { FileText, AlertTriangle, CheckCircle, Clock, ChevronRight, ShieldAlert } from 'lucide-react';

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

            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 w-[20%]">Framework</th>
                            <th className="px-6 py-4 w-[15%]">Status</th>
                            <th className="px-6 py-4 w-[15%]">Risk Profile</th>
                            <th className="px-6 py-4 w-[40%]">Implication</th>
                            <th className="px-6 py-4 w-[10%]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {GLOBAL_POLICIES.map((bill) => (
                            <tr key={bill.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-slate-900 text-base mb-1">{bill.name}</div>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                        {bill.region === 'EU' ? '🇪🇺 EU' :
                                            bill.region === 'US' ? '🇺🇸 US' :
                                                bill.region === 'CHINA' ? '🇨🇳 CN' :
                                                    bill.region === 'UK' ? '🇬🇧 UK' : '🌍 GLOBAL'}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        {bill.status === 'ENACTED' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
                                            bill.status === 'IMPLEMENTATION' ? <Clock className="w-4 h-4 text-blue-500" /> :
                                                <Clock className="w-4 h-4 text-amber-500" />}
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold uppercase tracking-wide ${bill.status === 'ENACTED' ? 'text-emerald-700' :
                                                bill.status === 'IMPLEMENTATION' ? 'text-blue-700' : 'text-amber-700'
                                                }`}>
                                                {bill.status}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${bill.riskLevel === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
                                        bill.riskLevel === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                        {bill.riskLevel === 'HIGH' && <ShieldAlert className="w-3 h-3" />}
                                        {bill.riskLevel} IMPACT
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="relative pl-3 border-l-2 border-blue-500/30">
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                                            {bill.impact}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-center pt-2">
                <button className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">
                    View Full Legislative Archive →
                </button>
            </div>
        </div>
    );
}
