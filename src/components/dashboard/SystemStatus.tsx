'use client';

import { Wifi, Database, Globe, Shield, Cpu, Activity } from 'lucide-react';

export function SystemStatus() {
    return (
        <div className="w-full bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between text-[10px] font-bold tracking-widest text-gray-600 overflow-x-auto no-scrollbar uppercase">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>System Online</span>
                </div>

                <div className="flex items-center gap-1.5 hidden sm:flex hover:text-blue-600 transition-colors cursor-help" title="Global Network Active">
                    <Globe className="h-3 w-3 text-blue-500" />
                    <span>Net: Global</span>
                </div>

                <div className="flex items-center gap-1.5 hidden sm:flex hover:text-indigo-600 transition-colors cursor-help" title="72 Active Data Sources">
                    <Database className="h-3 w-3 text-indigo-500" />
                    <span>Sources: 72 Active</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 hidden md:flex">
                    <Activity className="h-3 w-3 text-orange-500" />
                    <span>Uptime: 99.9%</span>
                </div>

                <div className="flex items-center gap-1.5 hidden sm:flex">
                    <Cpu className="h-3 w-3 text-purple-500" />
                    <span>Latency: 12ms</span>
                </div>

                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                    <Shield className="h-3 w-3" />
                    <span>AES-256 Encrypted</span>
                </div>
            </div>
        </div>
    );
}
