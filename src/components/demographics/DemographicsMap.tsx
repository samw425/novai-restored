'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize, Users, TrendingUp, Activity } from 'lucide-react';

interface CountryData {
    id: string;
    name: string;
    lat: number;
    lng: number;
    population: number;
    growth: number;
    medianAge: number;
    fertility: number;
    urban: number;
}

interface DemographicsMapProps {
    countries: CountryData[];
}

export function DemographicsMap({ countries }: DemographicsMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    // Convert Lat/Lng to % positions (Mercator approximation)
    const getPosition = (lat: number, lng: number) => {
        const x = ((lng + 180) / 360) * 100;
        // Mercator projection is non-linear
        const latRad = (lat * Math.PI) / 180;
        const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
        const y = (0.5 - (mercN / (2 * Math.PI))) * 100;

        return {
            left: `${Math.max(0, Math.min(100, x))}%`,
            top: `${Math.max(0, Math.min(100, y))}%`
        };
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
    const handleReset = () => setScale(1);

    // Calculate node size based on population (logarithmic scale)
    const getNodeSize = (pop: number) => {
        const baseSize = Math.log(pop) * 2;
        return Math.max(10, Math.min(60, baseSize)); // Clamp between 10px and 60px
    };

    // Get color based on growth rate
    const getNodeColor = (growth: number) => {
        if (growth > 2.0) return 'bg-emerald-500'; // High growth
        if (growth > 0.5) return 'bg-blue-500';    // Stable growth
        if (growth > 0) return 'bg-cyan-500';      // Low growth
        return 'bg-amber-500';                     // Decline
    };

    return (
        <div className="relative w-full h-[700px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden group shadow-2xl">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-2">
                <button onClick={handleZoomIn} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                    <ZoomIn size={18} />
                </button>
                <button onClick={handleZoomOut} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                    <ZoomOut size={18} />
                </button>
                <div className="h-px bg-slate-700 my-1"></div>
                <button onClick={handleReset} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                    <Maximize size={18} />
                </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Population Growth</h4>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] text-slate-300">High Growth ({'>'}2%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-[10px] text-slate-300">Stable ({'>'}0.5%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span className="text-[10px] text-slate-300">Decline ({'<'}0%)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <motion.div
                ref={containerRef}
                className="w-full h-full cursor-move relative"
                drag
                dragConstraints={containerRef}
                dragElastic={0.1}
                animate={{ scale: scale }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
                {/* World Map Background */}
                <div
                    className="absolute inset-0 w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain opacity-20 invert pointer-events-none"
                    style={{ backgroundSize: '100% auto' }}
                ></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

                {/* Country Nodes */}
                {countries.map((country) => {
                    const pos = getPosition(country.lat, country.lng);
                    const size = getNodeSize(country.population);
                    const colorClass = getNodeColor(country.growth);
                    const isHovered = hoveredCountry === country.id;

                    return (
                        <div
                            key={country.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group/node"
                            style={{ left: pos.left, top: pos.top }}
                            onMouseEnter={() => setHoveredCountry(country.id)}
                            onMouseLeave={() => setHoveredCountry(null)}
                        >
                            {/* Pulse Animation */}
                            <div
                                className={`absolute inset-0 rounded-full animate-ping opacity-40 ${colorClass}`}
                                style={{ width: '100%', height: '100%' }}
                            ></div>

                            {/* Core Node */}
                            <div
                                className={`relative rounded-full border-2 border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-300 ${colorClass} ${isHovered ? 'scale-125 border-white' : ''}`}
                                style={{ width: `${size}px`, height: `${size}px` }}
                            >
                                {/* Center Dot */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-50"></div>
                            </div>

                            {/* Tooltip */}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-lg p-4 shadow-2xl transition-all duration-200 pointer-events-none z-50 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-white">
                                        {country.name}
                                    </span>
                                    <span className={`text-[10px] font-mono ${country.growth >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {country.growth > 0 ? '+' : ''}{country.growth}%
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Users size={12} />
                                            <span className="text-[10px] uppercase tracking-wider">Population</span>
                                        </div>
                                        <span className="text-xs font-bold text-white font-mono">
                                            {(country.population / 1000000).toFixed(1)}M
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Activity size={12} />
                                            <span className="text-[10px] uppercase tracking-wider">Median Age</span>
                                        </div>
                                        <span className="text-xs font-bold text-white font-mono">
                                            {country.medianAge}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <TrendingUp size={12} />
                                            <span className="text-[10px] uppercase tracking-wider">Fertility</span>
                                        </div>
                                        <span className="text-xs font-bold text-white font-mono">
                                            {country.fertility}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
