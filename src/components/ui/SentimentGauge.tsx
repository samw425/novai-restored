'use client';

import React from 'react';

interface SentimentGaugeProps {
    value: number; // 0 to 100
    label?: string;
}

export function SentimentGauge({ value, label = "Global Sentiment" }: SentimentGaugeProps) {
    // Clamp value between 0 and 100
    const score = Math.min(Math.max(value, 0), 100);

    // Calculate color based on score
    // 0-30: Red (Fear/Negative)
    // 31-70: Yellow/Blue (Neutral)
    // 71-100: Green (Greed/Positive)
    const getColor = (s: number) => {
        if (s < 30) return '#EF4444'; // Red-500
        if (s < 70) return '#3B82F6'; // Blue-500
        return '#10B981'; // Emerald-500
    };

    const color = getColor(score);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    // We only want a semi-circle (50% of circumference)
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (score / 100) * (circumference / 2);

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-blue-500 to-emerald-500 opacity-20"></div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</h3>
            <div className="relative w-32 h-16 overflow-hidden">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="8"
                        strokeDasharray={`${circumference / 2} ${circumference}`}
                        strokeLinecap="round"
                    />
                    {/* Value Arc */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out drop-shadow-sm"
                    />
                </svg>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                    <span className="text-3xl font-black text-gray-900 tracking-tighter">{score}</span>
                </div>
            </div>
            <div className="flex justify-between w-full px-4 mt-2 text-[9px] font-bold text-gray-400 tracking-widest">
                <span className="text-red-400">CRITICAL</span>
                <span className="text-emerald-400">STABLE</span>
            </div>
        </div>
    );
}
