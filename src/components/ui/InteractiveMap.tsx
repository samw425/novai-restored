'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Ship, Plane, AlertTriangle, Crosshair, Map as MapIcon, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface Location {
    lat: number;
    lng: number;
    region: string;
}

interface Incident {
    id: string;
    title: string;
    type: 'conflict' | 'cyber' | 'naval' | 'air' | 'alert';
    severity: 'critical' | 'high' | 'medium' | 'low';
    location: Location;
    country: string;
    description: string;
    timestamp: string;
    assetType?: string; // e.g., 'Carrier Strike Group', 'Submarine'
}

interface InteractiveMapProps {
    incidents: Incident[];
}

export function InteractiveMap({ incidents }: InteractiveMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Convert Lat/Lng to % positions (Mercator approximation)
    const getPosition = (lat: number, lng: number) => {
        const x = ((lng + 180) / 360) * 100;
        // Mercator projection is non-linear, but for this visual approximation:
        const latRad = (lat * Math.PI) / 180;
        const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
        const y = (0.5 - (mercN / (2 * Math.PI))) * 100;

        // Clamp values to keep within map bounds
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
                {/* World Map Background (High Res SVG or Image) */}
                <div
                    className="absolute inset-0 w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain opacity-40 invert pointer-events-none"
                    style={{ backgroundSize: '100% auto' }} // Ensure map fits width
                ></div>

                {/* Grid Overlay for "Tactical" feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

                {/* Incidents & Assets */}
                {incidents.map((incident) => {
                    const pos = getPosition(incident.location.lat, incident.location.lng);
                    const isCritical = incident.severity === 'critical';

                    return (
                        <div
                            key={incident.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group/marker"
                            style={{ left: pos.left, top: pos.top }}
                        >
                            {/* Ping Animation */}
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${incident.type === 'conflict' ? 'bg-orange-500' :
                                    incident.type === 'naval' ? 'bg-blue-500' :
                                        incident.type === 'cyber' ? 'bg-cyan-500' : 'bg-red-500'
                                }`} style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }}></div>

                            {/* Marker Icon */}
                            <div className={`relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-transform hover:scale-125 ${incident.type === 'conflict' ? 'bg-orange-600 border-orange-400 text-white' :
                                    incident.type === 'naval' ? 'bg-blue-600 border-blue-400 text-white' :
                                        incident.type === 'air' ? 'bg-sky-600 border-sky-400 text-white' :
                                            incident.type === 'cyber' ? 'bg-cyan-900 border-cyan-500 text-cyan-400' :
                                                'bg-red-600 border-red-400 text-white'
                                }`}>
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
                            </div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Overlay UI Elements */}
            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Naval Assets</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Conflict Zones</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Cyber Attacks</span>
                </div>
            </div>
        </div>
    );
}
