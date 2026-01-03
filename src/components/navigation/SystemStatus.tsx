'use client';

import React from 'react';
import { ShieldCheck, Activity, Wifi } from 'lucide-react';

export function SystemStatus() {
    return (
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest text-emerald-500">LIVE NOW</span>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span className="font-medium">Threat Level</span>
                    </div>
                    <span className="font-bold text-emerald-600">LOW</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Activity size={12} className="text-blue-500" />
                        <span className="font-medium">Ingestion</span>
                    </div>
                    <span className="font-bold text-blue-600">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Wifi size={12} className="text-purple-500" />
                        <span className="font-medium">Latency</span>
                    </div>
                    <span className="font-mono text-slate-500">12ms</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                    <div className="bg-blue-500 h-1 rounded-full w-[85%] animate-pulse"></div>
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-slate-400 uppercase">Processing</span>
                    <span className="text-[9px] font-mono text-slate-400">85%</span>
                </div>
            </div>
        </div>
    );
}
