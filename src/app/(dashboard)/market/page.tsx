'use client';

import { Suspense } from 'react';

import { TrendingUp, Activity } from 'lucide-react';
import { MarketGraph } from '@/components/market/MarketGraph';
import { StockTable } from '@/components/market/StockTable';
import { FeedContainer } from '@/components/feed/FeedContainer';
import { PageHeader } from '@/components/ui/PageHeader';

import { MarketHeatMap } from '@/components/market/MarketHeatMap';

export default function MarketPage() {
    // Mock Data for "Wow" Factor (since we don't have a paid stock API)
    const aiStocks = [
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 148.50, change: 2.45, changePercent: 1.68, volume: '42.1M', trend: [140, 142, 141, 145, 144, 146, 148], sector: 'AI Chips' },
        { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.20, change: -1.10, changePercent: -0.26, volume: '18.5M', trend: [418, 420, 419, 416, 417, 416, 415], sector: 'Software' },
        { symbol: 'GOOGL', name: 'Alphabet Inc', price: 175.30, change: 0.85, changePercent: 0.49, volume: '22.3M', trend: [170, 172, 171, 173, 174, 174, 175], sector: 'Software' },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 245.80, change: 5.20, changePercent: 2.16, volume: '95.2M', trend: [230, 235, 232, 238, 240, 242, 245], sector: 'Robotics' },
        { symbol: 'PLTR', name: 'Palantir Tech', price: 24.50, change: 0.45, changePercent: 1.87, volume: '35.6M', trend: [22, 23, 23, 24, 24, 24, 24.5], sector: 'Software' },
        { symbol: 'AMD', name: 'Adv Micro Devices', price: 165.40, change: 1.20, changePercent: 0.73, volume: '48.9M', trend: [160, 162, 161, 163, 164, 165, 165], sector: 'AI Chips' },
        { symbol: 'AVAV', name: 'AeroVironment', price: 185.20, change: 3.10, changePercent: 1.70, volume: '1.2M', trend: [178, 180, 182, 181, 183, 184, 185], sector: 'Robotics' },
        { symbol: 'PATH', name: 'UiPath Inc', price: 18.90, change: -0.30, changePercent: -1.56, volume: '8.4M', trend: [20, 19.5, 19.2, 19.0, 18.8, 19.0, 18.9], sector: 'Software' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            {/* Header */}
            <PageHeader
                title="Market Activity"
                description="AI Company Funding, IPOs, and M&A Tracking."
                insight="AI is driving the new economy. Tracking the financial impact of technological disruption across sectors."
                icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
            />

            {/* Top Level Metrics - Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">AI Sector Index</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-gray-900">4,285.12</span>
                        <span className="text-sm font-bold text-emerald-600">+1.24%</span>
                    </div>
                    <MarketGraph data={[4200, 4220, 4210, 4250, 4240, 4260, 4285]} color="green" height={60} />
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Robotics Index</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-gray-900">1,892.45</span>
                        <span className="text-sm font-bold text-emerald-600">+0.85%</span>
                    </div>
                    <MarketGraph data={[1850, 1860, 1870, 1865, 1880, 1890, 1892]} color="green" height={60} />
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Venture Capital Flow</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-gray-900">$2.4B</span>
                        <span className="text-sm font-bold text-gray-400">Last 7 Days</span>
                    </div>
                    <MarketGraph data={[1.2, 1.5, 2.1, 1.8, 2.2, 2.5, 2.4]} color="blue" height={60} />
                </div>
            </div>

            {/* Heat Map Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Sector Heat Map
                    </h2>
                    <span className="text-xs font-mono text-gray-400">REAL-TIME INTENSITY</span>
                </div>
                <MarketHeatMap stocks={aiStocks} />
            </div>

            {/* Main Stock Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Detailed Metrics</h2>
                    <span className="text-xs font-mono text-emerald-600 animate-pulse">● LIVE DATA</span>
                </div>
                <StockTable stocks={aiStocks as any} />
            </div>

            {/* Live Market Feed */}
            <div className="pt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Live Market Intelligence
                </h2>
                <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading market feed...</div>}>
                        <FeedContainer forcedCategory="market" showTicker={false} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
