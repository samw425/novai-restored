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
    // Sort by absolute change percent to show biggest movers first (or group by sector)
    // For heatmap, we usually group by sector, but here we'll just do a grid for visual impact

    return (
        <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'}`}>
            {stocks.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                // Calculate intensity of color based on magnitude of change
                const intensity = Math.min(Math.abs(stock.changePercent) * 100, 900); // Cap at 900
                // Simplified color logic for Tailwind classes
                let bgClass = '';

                if (isPositive) {
                    if (stock.changePercent > 3) bgClass = 'bg-emerald-600';
                    else if (stock.changePercent > 1) bgClass = 'bg-emerald-500';
                    else bgClass = 'bg-emerald-400';
                } else {
                    if (stock.changePercent < -3) bgClass = 'bg-red-600';
                    else if (stock.changePercent < -1) bgClass = 'bg-red-500';
                    else bgClass = 'bg-red-400';
                }

                return (
                    <div
                        key={stock.symbol}
                        className={`${bgClass} rounded-lg p-4 text-white flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-pointer shadow-sm relative overflow-hidden group`}
                        style={{ minHeight: compact ? '80px' : '120px' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-start relative z-10">
                            <span className="font-bold text-sm tracking-wide">{stock.symbol}</span>
                            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>

                        <div className="relative z-10">
                            <div className="text-xs opacity-90 mb-0.5">{stock.name}</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black tracking-tight">
                                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                </span>
                            </div>
                            <div className="text-[10px] opacity-75 font-mono">${stock.price.toFixed(2)}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
