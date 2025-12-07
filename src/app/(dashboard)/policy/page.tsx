'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { PolicyHero } from '@/components/policy/PolicyHero';
import { RegulationTable } from '@/components/policy/RegulationTable';
import { CategoryFeed } from '@/components/feed/CategoryFeed';
import { Scale, ShieldCheck, Globe } from 'lucide-react';

export default function PolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans selection:bg-blue-500/30">
            {/* Header with Analyst Note */}
            <div className="px-6 lg:px-8">
                <PageHeader
                    title="Global Policy Monitor"
                    description="Sovereignty // Regulation // Alignment"
                    insight="The battle for AGI isn't just technological—it's legislative. We track the divergence between 'Accelerationist' states and 'Safetyist' blocs."
                    icon={<Scale className="w-8 h-8 text-blue-600" />}
                />

                {/* Hero: Sovereignty Metrics */}
                <PolicyHero />
            </div>

            {/* Main Content Grid */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Data & Feed (8/12) */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* 1. Legislative Monitor (Now Prominent) */}
                        <div className="space-y-6">
                            <RegulationTable />
                        </div>

                        {/* 2. Live Policy Signals */}
                        <div className="space-y-6 pt-6 border-t border-slate-200">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                </span>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    Live Policy Signals
                                </h2>
                            </div>

                            <CategoryFeed
                                category="policy"
                                variant="minimal"
                                showHeader={false}
                            />
                        </div>
                    </div>

                    {/* Right Column: Key Metrics (Clean / No Box) (4/12) */}
                    <div className="lg:col-span-4 space-y-12">

                        {/* Alignment Index - Naked Widget */}
                        <div className="pl-6 border-l border-slate-200">
                            <div className="flex items-center gap-2 mb-6">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Global Alignment Index</h3>
                            </div>

                            <div className="relative h-32 flex items-center justify-center mb-4">
                                {/* Simple Gauge Visual */}
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 w-[65%] relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-slate-900 rounded-full shadow-lg"></div>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-slate-900 mt-8">
                                    65<span className="text-sm text-slate-400 font-medium">/100</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed">
                                Global safety protocols are currently <strong>lagging</strong> behind model capabilities.
                            </p>
                        </div>

                        {/* Official Sources - Naked List */}
                        <div className="pl-6 border-l border-slate-200">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-600" />
                                Official Sources
                            </h3>
                            <ul className="space-y-4 text-sm text-slate-500 font-medium">
                                <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    EU Commission AI Office
                                </li>
                                <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    NIST AI Safety Institute
                                </li>
                                <li className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    Cyberspace Admin of China
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
