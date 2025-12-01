'use client';

import React, { useMemo } from 'react';

interface MarketGraphProps {
    data: number[];
    color?: 'green' | 'red' | 'blue';
    height?: number;
    width?: string;
    label?: string;
    change?: string;
}

export function MarketGraph({ data, color = 'green', height = 60, width = '100%', label, change }: MarketGraphProps) {
    const points = useMemo(() => {
        if (!data.length) return '';
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;
        const stepX = 100 / (data.length - 1);

        return data.map((val, i) => {
            const x = i * stepX;
            // Normalize y to 0-100 range, flip for SVG coords
            const y = 100 - ((val - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
    }, [data]);

    const strokeColor = color === 'green' ? '#10b981' : color === 'red' ? '#ef4444' : '#3b82f6';
    const fillColor = color === 'green' ? 'rgba(16, 185, 129, 0.1)' : color === 'red' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)';

    return (
        <div className="flex flex-col" style={{ width }}>
            {(label || change) && (
                <div className="flex justify-between items-end mb-1 px-1">
                    {label && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>}
                    {change && (
                        <span className={`text-xs font-bold ${color === 'green' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {change}
                        </span>
                    )}
                </div>
            )}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full overflow-visible" style={{ height }}>
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={`M0,100 L0,${points.split(' ')[0].split(',')[1]} ${points} L100,100 Z`}
                    fill={`url(#grad-${color})`}
                    stroke="none"
                />
                <polyline
                    points={points}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
    );
}
