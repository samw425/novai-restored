'use client';

import { useState, useEffect } from 'react';
import { Users, Globe, TrendingUp, Activity, ArrowUp, ArrowDown, Loader2, Building2, Baby, Wallet, BookOpen, BarChart3, Map as MapIcon, Table, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DemographicsMap } from '@/components/demographics/DemographicsMap';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface GlobalStats {
    totalPopulation: number;
    avgGrowth: number;
    avgUrban: number;
    avgMedianAge: string;
    timestamp: string;
}

export default function GlobalDemographicsPage() {
    const [countries, setCountries] = useState<any[]>([]);
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedCountryId, setSelectedCountryId] = useState<string>('chn');

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

    const selectedCountry = countries.find(c => c.id === selectedCountryId) || countries[0];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="mb-8">
                <PageHeader
                    title="Global Demographics"
                    description="HUMAN GEOGRAPHY // REAL-TIME CENSUS"
                    insight="Tracking population shifts, urbanization trends, and demographic anomalies across 30+ major nations. Data aggregated from UN, World Bank, and national census bureaus."
                    icon={<Users className="w-8 h-8 text-blue-600" />}
                />
            </div>

            {/* Global Ticker - Responsive Grid */}
            {stats && (
                <div className="mb-8 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-4 flex flex-col items-center justify-center text-center overflow-hidden">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 whitespace-nowrap">Global Pop. Est.</div>
                            <div className="w-full text-xl md:text-2xl xl:text-3xl font-black font-mono tracking-tight text-slate-900 truncate" title={stats.totalPopulation.toLocaleString()}>
                                {stats.totalPopulation.toLocaleString()}
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-center text-center overflow-hidden">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 whitespace-nowrap">Avg. Growth</div>
                            <div className={`w-full text-xl md:text-2xl xl:text-3xl font-black font-mono tracking-tight flex items-center justify-center gap-2 ${stats.avgGrowth >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {stats.avgGrowth >= 0 ? <ArrowUp size={20} className="shrink-0" /> : <ArrowDown size={20} className="shrink-0" />}
                                <span className="truncate">{stats.avgGrowth.toFixed(2)}%</span>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-center text-center overflow-hidden">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 whitespace-nowrap">Urbanization</div>
                            <div className="w-full text-xl md:text-2xl xl:text-3xl font-black font-mono tracking-tight text-blue-600 truncate">
                                {stats.avgUrban}%
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-center text-center overflow-hidden">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 whitespace-nowrap">Median Age</div>
                            <div className="w-full text-xl md:text-2xl xl:text-3xl font-black font-mono tracking-tight text-purple-600 truncate">
                                {stats.avgMedianAge}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {/* Map Section - Full Width */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                            <MapIcon size={16} className="text-blue-600" />
                            Live Census Map
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 tracking-wider">LIVE DATA</span>
                        </div>
                    </div>
                    {loading ? (
                        <div className="w-full h-[600px] flex items-center justify-center text-slate-500 bg-slate-50">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 size={32} className="animate-spin text-blue-500" />
                                <span className="text-xs font-mono uppercase tracking-widest">Aggregating Census Data...</span>
                            </div>
                        </div>
                    ) : (
                        <DemographicsMap countries={countries} />
                    )}
                </div>

                {/* TABBED DASHBOARD */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                    {/* Tabs Header */}
                    <div className="flex border-b border-slate-100 overflow-x-auto bg-slate-50/50">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'list', label: 'Data List', icon: Table },
                            { id: 'structure', label: 'Population Structure', icon: Users },
                            { id: 'economy', label: 'Economy', icon: Wallet },
                            { id: 'culture', label: 'Culture & Religion', icon: BookOpen },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-8 py-5 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${activeTab === tab.id
                                    ? 'bg-white text-blue-600 border-blue-600 shadow-sm'
                                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <OverviewCard title="Fastest Growing" icon={<TrendingUp size={18} className="text-emerald-500" />}>
                                    {[...countries].sort((a, b) => b.growth - a.growth).slice(0, 5).map((c, i) => (
                                        <RankRow key={c.id} rank={i + 1} label={c.name} value={`${c.growth}%`} valueColor="text-emerald-600" />
                                    ))}
                                </OverviewCard>
                                <OverviewCard title="Shrinking Pops" icon={<TrendingUp size={18} className="text-amber-500" />}>
                                    {[...countries].sort((a, b) => a.growth - b.growth).slice(0, 5).map((c, i) => (
                                        <RankRow key={c.id} rank={i + 1} label={c.name} value={`${c.growth}%`} valueColor="text-amber-600" />
                                    ))}
                                </OverviewCard>
                                <OverviewCard title="Youngest Nations" icon={<Baby size={18} className="text-blue-500" />}>
                                    {[...countries].sort((a, b) => a.medianAge - b.medianAge).slice(0, 5).map((c, i) => (
                                        <RankRow key={c.id} rank={i + 1} label={c.name} value={c.medianAge} />
                                    ))}
                                </OverviewCard>
                                <OverviewCard title="Oldest Nations" icon={<Users size={18} className="text-purple-500" />}>
                                    {[...countries].sort((a, b) => b.medianAge - a.medianAge).slice(0, 5).map((c, i) => (
                                        <RankRow key={c.id} rank={i + 1} label={c.name} value={c.medianAge} />
                                    ))}
                                </OverviewCard>
                            </div>
                        )}

                        {activeTab === 'list' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">Country</th>
                                            <th className="px-6 py-4 text-right">Population</th>
                                            <th className="px-6 py-4 text-right">Growth</th>
                                            <th className="px-6 py-4 text-right">Median Age</th>
                                            <th className="px-6 py-4 text-right">Urban %</th>
                                            <th className="px-6 py-4 text-right">GDP (B)</th>
                                            <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {countries.sort((a, b) => b.population - a.population).map((country) => (
                                            <tr key={country.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 font-bold text-slate-900">{country.name}</td>
                                                <td className="px-6 py-4 text-right font-mono">{(country.population / 1000000).toFixed(1)}M</td>
                                                <td className={`px-6 py-4 text-right font-mono font-bold ${country.growth >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {country.growth > 0 ? '+' : ''}{country.growth}%
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono">{country.medianAge}</td>
                                                <td className="px-6 py-4 text-right font-mono">{country.urban}%</td>
                                                <td className="px-6 py-4 text-right font-mono">${(country.gdp || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => { setActiveTab('structure'); setSelectedCountryId(country.id); }}
                                                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-wider"
                                                    >
                                                        Analyze
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'structure' && selectedCountry && (
                            <div className="space-y-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Age & Urbanization Analysis</h3>
                                        <p className="text-slate-500 text-sm mt-1">Detailed breakdown of population distribution.</p>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={selectedCountryId}
                                            onChange={(e) => setSelectedCountryId(e.target.value)}
                                            className="appearance-none bg-white border border-slate-200 text-slate-900 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-3 pr-10 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                                        >
                                            {countries.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                            <ArrowDown size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Age Structure</h4>
                                        <div className="space-y-6">
                                            <BarRow label="0-14 Years (Youth)" value={selectedCountry.ageStructure?.['0-14'] || 0} color="bg-emerald-500" />
                                            <BarRow label="15-64 Years (Working Age)" value={selectedCountry.ageStructure?.['15-64'] || 0} color="bg-blue-500" />
                                            <BarRow label="65+ Years (Elderly)" value={selectedCountry.ageStructure?.['65+'] || 0} color="bg-purple-500" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Urban vs Rural</h4>
                                        <div className="flex items-center justify-center h-40 gap-12">
                                            <div className="text-center">
                                                <div className="text-4xl font-black text-blue-600 mb-1">{selectedCountry.urban}%</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Urban</div>
                                            </div>
                                            <div className="h-16 w-px bg-slate-200"></div>
                                            <div className="text-center">
                                                <div className="text-4xl font-black text-slate-600 mb-1">{100 - selectedCountry.urban}%</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rural</div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-3 mt-8 overflow-hidden">
                                            <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${selectedCountry.urban}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'economy' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <OverviewCard title="Top by GDP (Billions USD)" icon={<Wallet size={18} className="text-emerald-500" />}>
                                    {[...countries].sort((a, b) => (b.gdp || 0) - (a.gdp || 0)).slice(0, 10).map((c, i) => (
                                        <RankRow key={c.id} rank={i + 1} label={c.name} value={`$${(c.gdp || 0).toLocaleString()}B`} valueColor="text-slate-900" />
                                    ))}
                                </OverviewCard>
                                <OverviewCard title="Top by GDP Per Capita" icon={<Activity size={18} className="text-blue-500" />}>
                                    {[...countries].sort((a, b) => (b.gdpPerCapita || 0) - (a.gdpPerCapita || 0)).slice(0, 10).map((c, i) => (
                                        <RankRow key={c.id} rank={i + 1} label={c.name} value={`$${(c.gdpPerCapita || 0).toLocaleString()}`} valueColor="text-blue-600" />
                                    ))}
                                </OverviewCard>
                            </div>
                        )}

                        {activeTab === 'culture' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <OverviewCard title="Dominant Religions" icon={<BookOpen size={18} className="text-purple-500" />}>
                                    {[...countries].slice(0, 10).map((c, i) => (
                                        <div key={c.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded transition-colors">
                                            <span className="text-sm font-bold text-slate-700">{c.name}</span>
                                            <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{c.religion || 'N/A'}</span>
                                        </div>
                                    ))}
                                </OverviewCard>
                                <OverviewCard title="Diversity Index (0-1)" icon={<Globe size={18} className="text-blue-500" />}>
                                    {[...countries].sort((a, b) => (b.diversityIndex || 0) - (a.diversityIndex || 0)).slice(0, 10).map((c, i) => (
                                        <RankRow key={c.id} rank={i + 1} label={c.name} value={c.diversityIndex || 'N/A'} valueColor="text-blue-600" />
                                    ))}
                                </OverviewCard>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Insights Section */}
            <div className="bg-slate-900 rounded-2xl p-10 border border-slate-800 shadow-2xl">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                    <Sparkles size={20} className="text-yellow-400" />
                    Key Demographic Shifts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <InsightColumn
                        title="The Aging Crisis"
                        color="text-blue-400"
                        content="Japan, South Korea, and Italy are facing critical population decline. Median ages are pushing 50, putting immense strain on social security and labor markets."
                    />
                    <InsightColumn
                        title="African Boom"
                        color="text-emerald-400"
                        content="Nigeria, Ethiopia, and DR Congo are driving global growth. With median ages under 20, this region will supply the world's workforce for the next century."
                    />
                    <InsightColumn
                        title="Urban Migration"
                        color="text-purple-400"
                        content="Rapid urbanization in India and Southeast Asia is creating new megacities. Infrastructure demands in these regions will be the primary driver of global construction."
                    />
                </div>
            </div>

            {/* Data Sources Footer */}
            <div className="border-t border-slate-200 pt-8 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Data Sources & Methodology</h4>
                        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                            We aggregate real-time demographic data from over 30+ authoritative global sources.
                            While we cannot list every single source due to the volume of data streams, our primary data partners include the United Nations Population Division, World Bank Open Data, and various national census bureaus.
                            Economic data is cross-referenced with the IMF World Economic Outlook Database.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <SourceLink label="UN Population Division" url="https://population.un.org/" />
                        <SourceLink label="World Bank Data" url="https://data.worldbank.org/" />
                        <SourceLink label="IMF Economic Data" url="https://www.imf.org/en/Data" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function SourceLink({ label, url }: { label: string, url: string }) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
            {label}
            <ExternalLink size={10} />
        </a>
    );
}

function TickerItem({ label, value, trend, valueColor = 'text-slate-900' }: { label: string, value: string, trend?: 'up' | 'down', valueColor?: string }) {
    return (
        <div className="text-right shrink-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-2xl font-black font-mono tracking-tight flex items-center justify-end gap-2 ${valueColor}`}>
                {trend && (trend === 'up' ? <ArrowUp size={20} /> : <ArrowDown size={20} />)}
                {value}
            </div>
        </div>
    );
}

function OverviewCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-50 pb-3">
                {icon}
                {title}
            </h4>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    );
}

function RankRow({ rank, label, value, valueColor = 'text-slate-700' }: { rank: number, label: string, value: string | number, valueColor?: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded transition-colors group w-full">
            <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                <span className="text-xs font-mono text-slate-300 font-bold w-4 shrink-0 group-hover:text-blue-400 transition-colors">{rank}.</span>
                <span className="text-sm font-bold text-slate-700 truncate block">{label}</span>
            </div>
            <span className={`text-sm font-mono font-bold ${valueColor} ml-4 shrink-0 whitespace-nowrap`}>{value}</span>
        </div>
    );
}

function BarRow({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">{label}</span>
                <span className="font-mono font-bold text-slate-500">{value}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className={`${color} h-3 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}

function InsightColumn({ title, color, content }: { title: string, color: string, content: string }) {
    return (
        <div className="space-y-3">
            <h4 className={`${color} font-bold text-sm uppercase tracking-wider border-l-2 pl-3 border-current`}>{title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed pl-3.5 border-l border-slate-800">
                {content}
            </p>
        </div>
    );
}

function Sparkles({ size, className }: { size: number, className: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    );
}
