"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, LayersControl } from "react-leaflet";
import L from "leaflet";
import { ZenithProperty as Property } from "@/lib/types";
import { Wifi, Satellite, Layers, Map as MapIcon, Flame } from "lucide-react";
import { Circle, FeatureGroup } from "react-leaflet";

// Fix Leaflet Default Icon Issue
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom Markers
// Custom Marker Implementation (Zillow-Style Price Tags)
const createPriceTagIcon = (price: number, isSelected: boolean, isHovered: boolean, isDistressed: boolean) => {
    const formattedPrice = price === 0
        ? 'ESTIMATING' // Sovereign High-Fidelity Fallback
        : price >= 1000000
            ? `$${(price / 1000000).toFixed(1)}M`
            : `$${Math.round(price / 1000)}k`;

    return L.divIcon({
        className: "zillow-marker",
        html: `
            <div class="relative flex items-center justify-center transition-all duration-200 ${isSelected ? 'scale-110 z-[1000]' : isHovered ? 'scale-105 z-[900]' : 'z-[500]'}">
                <div class="px-2 py-1 rounded-sm border shadow-lg font-black text-[10px] tracking-tight whitespace-nowrap transition-all duration-200
                    ${isSelected
                ? 'bg-black text-white border-white'
                : isHovered
                    ? 'bg-zenith-accent text-black border-black'
                    : 'bg-white text-black border-zinc-200'}">
                    ${formattedPrice}
                </div>
                ${isDistressed ? '<div class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 border border-white animate-pulse"></div>' : ''}
                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent ${isSelected ? 'border-t-[4px] border-t-black' : isHovered ? 'border-t-[4px] border-t-zenith-accent' : 'border-t-[4px] border-t-white'}"></div>
            </div>
        `,
        iconSize: [40, 20],
        iconAnchor: [20, 20]
    });
};

function MapController({ center, onBoundsChange }: { center: { lat: number, lng: number } | null | undefined, onBoundsChange?: (bounds: any) => void }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            console.log(`[MAP_ENGINE] TITANIUM_SYNC: FLYING TO SECTOR [${center.lat}, ${center.lng}]`);
            map.flyTo([center.lat, center.lng], 16, {
                duration: 2.0,
                easeLinearity: 0.2,
                noMoveStart: true
            });
        }
    }, [center?.lat, center?.lng, (center as any)?._t, map]);


    useEffect(() => {
        if (!onBoundsChange) return;

        const handleMove = () => {
            const b = map.getBounds();
            onBoundsChange({
                latMin: b.getSouth(),
                latMax: b.getNorth(),
                lngMin: b.getWest(),
                lngMax: b.getEast()
            });
        };

        map.on('moveend', handleMove);
        return () => {
            map.off('moveend', handleMove);
        };
    }, [map, onBoundsChange]);

    return null;
}

interface MapEngineProps {
    properties: Property[];
    onPropertySelect: (property: Property) => void;
    onBoundsChange?: (bounds: any) => void;
    centerLocation?: { lat: number, lng: number } | null | undefined;
    selectedPropertyId?: string | null;
    hoveredPropertyId?: string | null;
}

export default function MapEngine({ properties, onPropertySelect, onBoundsChange, centerLocation, selectedPropertyId, hoveredPropertyId }: MapEngineProps) {
    const defaultCenter = centerLocation || { lat: 39.8283, lng: -98.5795 };
    const [showHeatmap, setShowHeatmap] = useState(false);

    return (
        <div className="relative w-full h-full bg-black z-0 overflow-hidden">
            {/* TACTICAL OVERLAYS */}
            <div className="tactical-grid" />
            <div className="scanline" />

            <MapContainer
                center={[defaultCenter.lat, defaultCenter.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%", background: "#000" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                <MapController center={centerLocation} onBoundsChange={onBoundsChange} />

                {/* Institutional Core: Titanium Momentum Heatmap */}
                {showHeatmap && (
                    <FeatureGroup>
                        {properties.map((prop) => (
                            <Circle
                                key={`heat-${prop.id}`}
                                center={[prop.lat, prop.lng]}
                                radius={400} // Expanded reach for institutional view
                                pathOptions={{
                                    fillColor: (prop.alpha?.momentumScore || 50) > 85 ? '#00FF94' : '#ffc107',
                                    fillOpacity: 0.1,
                                    stroke: false
                                }}
                            />
                        ))}
                    </FeatureGroup>
                )}

                {properties.map((prop) => {
                    const isDistressed = prop.motivationScore > 80;
                    const isSelected = selectedPropertyId === prop.id;
                    const isHovered = hoveredPropertyId === prop.id;

                    return (
                        <Marker
                            key={prop.id}
                            position={[prop.lat, prop.lng]}
                            icon={createPriceTagIcon(prop.estimatedValue, isSelected, isHovered, isDistressed)}
                            eventHandlers={{
                                click: () => onPropertySelect(prop),
                            }}
                        />
                    );
                })}
            </MapContainer>

            {/* OVERLAY HUD (POLISHED) */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-8 px-8 py-3 glass-panel rounded-full z-[1000] border-zenith-accent/20">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zenith-accent animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-white/60">SECTOR_SCAN: ACTIVE</span>
                </div>
                <div className="w-[1px] h-3 bg-white/10" />
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/40">LAT: {centerLocation?.lat?.toFixed(4) || "---"}</span>
                    <span className="text-[10px] font-mono text-white/40">LNG: {centerLocation?.lng?.toFixed(4) || "---"}</span>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 flex flex-col gap-4 z-[1000]">
                <div className="glass-panel p-4 rounded-2xl border-zenith-accent/10 flex items-center gap-4">
                    <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`p-2 rounded-lg transition-all ${showHeatmap ? 'bg-zenith-accent/20 text-zenith-accent' : 'bg-white/5 text-white/40 hover:text-white'}`}
                        title="Institutional Heatmap"
                    >
                        <Flame className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="p-2 rounded-lg bg-zenith-accent/5">
                        <Satellite className="w-4 h-4 text-zenith-accent animate-spin-slow" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono tracking-widest text-zenith-accent uppercase">Sovereign_Uplink</span>
                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">Titanium_Terminal_Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
