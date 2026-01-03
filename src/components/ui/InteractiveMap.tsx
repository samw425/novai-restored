'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Ship, Plane, AlertTriangle, Crosshair, Map as MapIcon, ZoomIn, ZoomOut, Maximize, Anchor, Target } from 'lucide-react';

interface Location {
    lat: number;
    lng: number;
    region: string;
}

interface Incident {
    id: string;
    title: string;
    type: 'conflict' | 'cyber' | 'naval' | 'air' | 'alert' | 'earthquake' | 'outbreak';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'warning' | 'info';
    location: Location;
    description: string;
    timestamp: string;
    country?: string;
    assetType?: string;
    url?: string;
}

interface InteractiveMapProps {
    incidents: Incident[];
    hasNavalContext?: boolean;
    showsNavalFacilities?: boolean;
    onCountryFilter?: (country: string | null) => void;
}

// Country legend configuration
const COUNTRY_LEGEND = [
    { code: 'US', name: 'United States', flag: '🇺🇸', color: 'bg-blue-500', textColor: 'text-blue-400' },
    { code: 'CN', name: 'China', flag: '🇨🇳', color: 'bg-red-500', textColor: 'text-red-400' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', color: 'bg-orange-500', textColor: 'text-orange-400' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', color: 'bg-blue-400', textColor: 'text-blue-300' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', color: 'bg-blue-300', textColor: 'text-blue-200' },
    { code: 'FR', name: 'France', flag: '🇫🇷', color: 'bg-blue-600', textColor: 'text-blue-500' },
    { code: 'IN', name: 'India', flag: '🇮🇳', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', color: 'bg-sky-500', textColor: 'text-sky-400' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', color: 'bg-cyan-500', textColor: 'text-cyan-400' },
];

export function InteractiveMap({ incidents, hasNavalContext, showsNavalFacilities, onCountryFilter }: InteractiveMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    // Filter incidents by selected country
    const filteredIncidents = selectedCountry
        ? incidents.filter(inc => (inc.country || '').toUpperCase() === selectedCountry)
        : incidents;

    const handleCountryClick = (countryCode: string) => {
        const newCountry = selectedCountry === countryCode ? null : countryCode;
        setSelectedCountry(newCountry);
        onCountryFilter?.(newCountry);
    };

    // Convert Lat/Lng to % positions (Mercator approximation)
    const getPosition = (lat: number, lng: number) => {
        const x = ((lng + 180) / 360) * 100;
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

    return (
        <div className="relative w-full h-[600px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden group shadow-2xl">
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
                    className="absolute inset-0 w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain opacity-40 invert pointer-events-none"
                    style={{ backgroundSize: '100% auto' }}
                ></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

                {/* Incidents & Assets */}
                {filteredIncidents.map((incident) => {
                    const pos = getPosition(incident.location.lat, incident.location.lng);

                    // Country grouping
                    const country = (incident.country || '').toUpperCase();
                    const isWestern = ['US', 'UK', 'FR', 'JP', 'DE', 'NATO'].includes(country);
                    const isRed = ['CN'].includes(country);
                    const isOrange = ['RU'].includes(country);
                    const isEmerald = ['IR', 'SY'].includes(country);
                    const isYellow = ['IN', 'BR', 'ZA'].includes(country);

                    return (
                        <a
                            key={incident.id}
                            href={incident.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group/marker cursor-pointer"
                            style={{ left: pos.left, top: pos.top }}
                        >
                            {/* Marker Icon - Dynamic Color */}
                            <div className={`relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-transform hover:scale-150 hover:ring-2 hover:ring-white/50 ${incident.type === 'naval'
                                ? (isWestern ? 'bg-blue-600 border-blue-400 text-white'
                                    : isRed ? 'bg-red-600 border-red-400 text-white'
                                        : isOrange ? 'bg-orange-600 border-orange-400 text-white'
                                            : isEmerald ? 'bg-emerald-600 border-emerald-400 text-white'
                                                : isYellow ? 'bg-yellow-600 border-yellow-400 text-white'
                                                    : 'bg-slate-600 border-slate-400 text-white')
                                : incident.type === 'air' ? 'bg-sky-600 border-sky-400 text-white'
                                    : incident.type === 'cyber' ? 'bg-cyan-900 border-cyan-500 text-cyan-400'
                                        : incident.type === 'earthquake' ? 'bg-amber-600 border-amber-400 text-white'
                                            : 'bg-red-600 border-red-400 text-white'
                                }`}>
                                {/* Ping Animation - Dynamic Color based on Country for Naval */}
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${incident.type === 'naval'
                                    ? (isWestern ? 'bg-blue-500'
                                        : isRed ? 'bg-red-600'
                                            : isOrange ? 'bg-orange-600'
                                                : isEmerald ? 'bg-emerald-600'
                                                    : isYellow ? 'bg-yellow-600'
                                                        : 'bg-slate-500')
                                    : incident.type === 'conflict' ? 'bg-orange-500'
                                        : incident.type === 'cyber' ? 'bg-cyan-500'
                                            : incident.type === 'earthquake' ? 'bg-amber-500'
                                                : 'bg-red-500'
                                    }`} style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }}></div>
                                {incident.type === 'naval' ? <Ship size={12} /> :
                                    incident.type === 'air' ? <Plane size={12} /> :
                                        incident.type === 'cyber' ? <Crosshair size={12} /> :
                                            <AlertTriangle size={12} />}
                            </div>

                            {/* Tooltip (Visible on Hover) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-lg p-3 shadow-2xl opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-50">
                                <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${incident.type === 'conflict' ? 'text-orange-500' :
                                        incident.type === 'naval' ? 'text-blue-500' :
                                            'text-red-500'
                                        }`}>
                                        {incident.type} // {incident.country}
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-500">
                                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-white mb-1 leading-tight">{incident.title}</h4>
                                <p className="text-[10px] text-slate-400 leading-relaxed">{incident.description}</p>
                                <div className="mt-2 text-[9px] text-blue-400 font-mono uppercase">Click to view source →</div>
                            </div>
                        </a>
                    );
                })}
            </motion.div>

            {/* NAVAL TRACKER: Country Filter Legend - Only when hasNavalContext */}
            {hasNavalContext && (
                <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-slate-950/95 backdrop-blur-sm rounded-xl border border-slate-800 p-3 shadow-2xl">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Anchor size={10} className="text-blue-400" />
                                NAVAL POWERS
                            </h4>
                            {selectedCountry && (
                                <button
                                    onClick={() => handleCountryClick(selectedCountry)}
                                    className="text-[8px] text-blue-400 hover:text-blue-300 font-mono uppercase"
                                >
                                    CLEAR
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            {COUNTRY_LEGEND.map((country) => {
                                const isActive = selectedCountry === country.code;
                                const countryIncidents = incidents.filter(inc => (inc.country || '').toUpperCase() === country.code);

                                return (
                                    <button
                                        key={country.code}
                                        onClick={() => handleCountryClick(country.code)}
                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all ${isActive
                                            ? `${country.color} text-white ring-2 ring-white/30 shadow-lg`
                                            : selectedCountry
                                                ? 'bg-slate-900/50 text-slate-500 opacity-50'
                                                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="text-sm">{country.flag}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wide flex-1">{country.code}</span>
                                        <span className={`text-[8px] font-mono ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                            {countryIncidents.length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* GLOBAL INTEL: Simple Incident Type Legend - Only when NOT hasNavalContext */}
            {!hasNavalContext && (
                <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-slate-950/95 backdrop-blur-sm rounded-lg border border-slate-800 p-3 shadow-xl">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            INCIDENT TYPES
                        </h4>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                <span>KINETIC / CONFLICT</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                                <span>CYBER</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                <span>NAVAL</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-300">
                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                                <span>ALERT / OTHER</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Country Filter Indicator - Only when hasNavalContext and country selected */}
            {hasNavalContext && selectedCountry && (
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-slate-950/95 backdrop-blur-sm rounded-lg border border-slate-700 px-4 py-2 shadow-xl flex items-center gap-3">
                        <span className="text-lg">{COUNTRY_LEGEND.find(c => c.code === selectedCountry)?.flag}</span>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-wider">
                                {COUNTRY_LEGEND.find(c => c.code === selectedCountry)?.name}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono">
                                {filteredIncidents.length} ASSETS TRACKED
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

