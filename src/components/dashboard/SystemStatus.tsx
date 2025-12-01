'use client';

import { Activity, Database } from 'lucide-react';

export function SystemStatus() {
    return (
        <div className="w-full bg-white border-b border-gray-100 py-2.5 px-4 flex items-center justify-between text-xs font-medium text-gray-600 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-bold">System Online</span>
                </div>

                <div className="flex items-center gap-2 hover:text-gray-900 transition-colors cursor-help" title="72 Active Data Sources">
                    <Database className="h-3.5 w-3.5 text-blue-600" />
                    <span>72 Sources Active</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Activity className="h-3.5 w-3.5 text-purple-600" />
                    <span>Filtering in Real-Time</span>
                </div>
            </div>
        </div>
    );
}
