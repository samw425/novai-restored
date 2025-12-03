'use client';

import { useState, useEffect } from 'react';
import { Users, Globe, TrendingUp, Activity, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DemographicsMap } from '@/components/demographics/DemographicsMap';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface GlobalStats {
    totalPopulation: number;
    avgGrowth: number;
    timestamp: string;
}

export default function GlobalDemographicsPage() {
    const [countries, setCountries] = useState<any[]>([]);
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/feed/global-demographics');
                const data = await res.json();
                setCountries(data.countries);
                setStats(data.globalStats);
            } catch (error) {
                console.error('Failed to fetch demographics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Poll every 5 seconds for "live" updates
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div className="flex-1">
                    <PageHeader
                        title="Global Demographics"
                        description="HUMAN GEOGRAPHY // REAL-TIME CENSUS"
                        insight="Tracking population shifts, urbanization trends, and demographic anomalies across 30+ major nations. Data aggregated from UN, World Bank, and national census bureaus."
                        icon={<Users className="w-8 h-8 text-blue-600" />}
                    />
                </div>

                {/* Global Ticker */}
                {stats && (
                    <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Population Est.</div>
                            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                                {stats.totalPopulation.toLocaleString()}
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Growth</div>
                            <div className={`text-xl font-bold font-mono flex items-center justify-end gap-1 ${stats.avgGrowth >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {stats.avgGrowth > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                {stats.avgGrowth.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Map Visualization */}
                <div className="lg:col-span-9">
                    {loading ? (
                        <div className="w-full h-[700px] bg-slate-900 rounded-xl flex items-center justify-center text-slate-500">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 size={32} className="animate-spin text-blue-500" />
                                <span className="text-xs font-mono uppercase tracking-widest">Aggregating Census Data...</span>
                            </div>
                        </div>
                    ) : (
                        <DemographicsMap countries={countries} />
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-3 space-y-4 h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="sticky top-0 bg-slate-50 z-10 pb-4">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Globe size={14} className="text-blue-500" />
                            National Data
                        </h3>
                        <div className="h-px bg-slate-200 w-full"></div>
                    </div>

                    <div className="space-y-3">
                        {countries.sort((a, b) => b.population - a.population).map((country) => (
                            <div key={country.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-slate-900 text-sm">{country.name}</span>
                                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${country.growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {country.growth > 0 ? '+' : ''}{country.growth}%
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <div className="text-[9px] text-slate-400 uppercase">Population</div>
                                        <div className="font-mono font-medium text-slate-700">{(country.population / 1000000).toFixed(1)}M</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-400 uppercase">Median Age</div>
                                        <div className="font-mono font-medium text-slate-700">{country.medianAge}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-400 uppercase">Urban</div>
                                        <div className="font-mono font-medium text-slate-700">{country.urban}%</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] text-slate-400 uppercase">Fertility</div>
                                        <div className="font-mono font-medium text-slate-700">{country.fertility}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
