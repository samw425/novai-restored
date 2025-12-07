'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    sector: string;
}

interface MarketHeatMapProps {
    stocks: Stock[];
    compact?: boolean;
}

export function MarketHeatMap({ stocks, compact = false }: MarketHeatMapProps) {
    // Sort by magnitude of move for visual hierarchy
    const sortedStocks = [...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

    // Simulated live time
    const [time, setTime] = React.useState<string>('');

    React.useEffect(() => {
        setTime(new Date().toLocaleTimeString());
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4">
            {!compact && (
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest">
                            MARKET OPEN
                        </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                        LAST UPDATE: <span className="text-slate-600 font-bold">{time}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {sortedStocks.map((stock) => {
                    const isPositive = stock.changePercent >= 0;

                    // Light mode premium colors
                    const trendColor = isPositive ? 'text-emerald-600' : 'text-red-600';
                    const trendBg = isPositive ? 'bg-emerald-50' : 'bg-red-50';
                    const trendBorder = isPositive ? 'border-emerald-100' : 'border-red-100';
                    const glow = isPositive ? 'group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)]' : 'group-hover:shadow-[0_4px_20px_rgba(239,68,68,0.15)]';

                    return (
                        <div
                            key={stock.symbol}
                            className={`
                                relative overflow-hidden rounded-xl border ${trendBorder} ${trendBg} 
                                p-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${glow} group cursor-pointer bg-white
                            `}
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between gap-3">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-sm text-slate-800 tracking-wide">{stock.symbol}</span>
                                    {isPositive ? (
                                        <ArrowUpRight className={`w-4 h-4 ${trendColor}`} />
                                    ) : (
                                        <ArrowDownRight className={`w-4 h-4 ${trendColor}`} />
                                    )}
                                </div>

                                <div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate mb-0.5">{stock.name}</div>
                                    <div className="flex items-baseline justify-between">
                                        <span className={`text-lg font-black tracking-tight ${trendColor}`}>
                                            {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            ${stock.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
