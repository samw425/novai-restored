'use client';

import { Activity, Database } from 'lucide-react';

export function SystemStatus() {
    return (
        <div className="w-full bg-white border-b border-gray-100 py-2.5 px-4 flex items-center justify-between text-xs font-medium text-gray-600 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-6 text-[10px] font-medium text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-600 font-bold uppercase tracking-wider">LIVE NOW</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Database size={12} className="text-blue-500" />
                    <span className="font-mono">109+ Sources Active</span>
                </div>
                <div className="flex items-center gap-1.5 hidden sm:flex">
                    <Activity size={12} className="text-purple-500" />
                    <span className="font-mono">Filtering in Real-Time</span>
                </div>
            </div>
        </div>
    );
}
