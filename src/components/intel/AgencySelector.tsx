'use client';

import { Shield, Globe, ChevronRight, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgencySelectorProps {
    activeAgency: string;
    onSelect: (agency: string) => void;
    agencies: Record<string, any>;
}

export function AgencySelector({ activeAgency, onSelect, agencies }: AgencySelectorProps) {
    return (
        <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-md bg-white/90">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar mask-linear-fade">
                    <button
                        onClick={() => onSelect('ALL')}
                        className={`
                            relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                            ${activeAgency === 'ALL'
                                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900 ring-offset-2'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
                        `}
                    >
                        <Globe size={14} className={activeAgency === 'ALL' ? 'text-blue-400' : 'text-slate-400'} />
                        Global Wire
                        {activeAgency === 'ALL' && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                            </span>
                        )}
                    </button>

                    <div className="w-px h-6 bg-slate-200 mx-2 shrink-0"></div>

                    {Object.entries(agencies).map(([key, profile]) => (
                        <button
                            key={key}
                            onClick={() => onSelect(key)}
                            className={`
                                px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap
                                ${activeAgency === key
                                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}
                            `}
                        >
                            <Shield size={14} className={activeAgency === key ? 'text-white' : 'text-slate-400'} />
                            {key === 'DOD' ? 'DOD/Dept. of War' : key}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
