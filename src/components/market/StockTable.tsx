'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { MarketGraph } from './MarketGraph';

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    trend: number[];
    sector: 'AI Chips' | 'Robotics' | 'Software' | 'Infrastructure';
}

interface StockTableProps {
    stocks: Stock[];
}

export function StockTable({ stocks }: StockTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="py-3 pl-4">Company</th>
                        <th className="py-3 text-right">Price</th>
                        <th className="py-3 text-right">Change</th>
                        <th className="py-3 text-right hidden md:table-cell">Volume</th>
                        <th className="py-3 text-right hidden sm:table-cell w-32">7d Trend</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {stocks.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="py-3 pl-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-sm">{stock.symbol}</span>
                                    <span className="text-xs text-gray-500 hidden sm:inline">{stock.name}</span>
                                </div>
                            </td>
                            <td className="py-3 text-right font-mono text-sm font-medium text-gray-900">
                                ${stock.price.toFixed(2)}
                            </td>
                            <td className="py-3 text-right">
                                <div className={`flex items-center justify-end gap-1 font-mono text-xs font-bold ${stock.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {stock.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                    {Math.abs(stock.changePercent).toFixed(2)}%
                                </div>
                            </td>
                            <td className="py-3 text-right text-xs text-gray-500 font-mono hidden md:table-cell">
                                {stock.volume}
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell">
                                <div className="h-8 w-24 ml-auto">
                                    <MarketGraph
                                        data={stock.trend}
                                        color={stock.change >= 0 ? 'green' : 'red'}
                                        height={32}
                                        width="100%"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
