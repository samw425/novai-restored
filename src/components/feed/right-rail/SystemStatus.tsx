import React from 'react';
import { Activity, Database, Zap } from 'lucide-react';

export function SystemStatus() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                <div className="p-2 bg-slate-900 rounded-lg">
                    <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                        System Status
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                            Operational
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Database size={12} />
                        <span className="text-xs font-medium">Ingestion Rate</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                        1,240 / min
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full w-[85%] animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Zap size={12} />
                        <span className="text-xs font-medium">Active Sources</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                        74
                    </span>
                </div>
            </div>
        </div>
    );
}
