'use client';

import { Wifi, Database, Globe, Shield, Cpu } from 'lucide-react';

export function SystemStatus() {
    return (
        <div className="w-full bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm py-1 px-4 flex items-center justify-between text-[10px] font-mono text-gray-400 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="tracking-wider">SYSTEM ONLINE</span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500">
                    <Globe className="h-3 w-3" />
                    <span>NET: <span className="text-gray-300">GLOBAL</span></span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 hidden sm:flex">
                    <Database className="h-3 w-3" />
                    <span>SOURCES: <span className="text-gray-300">ACTIVE</span></span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-gray-500 hidden sm:flex">
                    <Cpu className="h-3 w-3" />
                    <span>LATENCY: <span className="text-green-400">12ms</span></span>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span>SEC: <span className="text-blue-400">ENCRYPTED</span></span>
                </div>

                <div className="text-gray-600">
                    v2.4.0-RC
                </div>
            </div>
        </div>
    );
}
