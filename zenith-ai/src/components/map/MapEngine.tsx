"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import { Property } from "@/lib/data/mock-properties";
import { Wifi, Satellite } from "lucide-react";

// Fix Leaflet Default Icon Issue
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom Markers
const createCustomIcon = (color: string) => L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

function MapController({ center }: { center: { lat: number, lng: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], 13, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

interface MapEngineProps {
    properties: Property[];
    onPropertySelect: (property: Property) => void;
    onBoundsChange?: (bounds: any) => void;
    centerLocation?: { lat: number, lng: number } | null;
}

export default function MapEngine({ properties, onPropertySelect, centerLocation }: MapEngineProps) {
    // Safe Default Center (US Center)
    const defaultCenter = centerLocation || { lat: 39.8283, lng: -98.5795 };

    return (
        <div className="relative w-full h-full bg-black z-0">
            <MapContainer
                center={[defaultCenter.lat, defaultCenter.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%", background: "#000" }}
                zoomControl={false}
            >
                {/* Dark Matter Tiles (Free, Premium Look) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapController center={centerLocation} />

                {properties.map((prop) => {
                    const color = prop.status === 'PRE_FORECLOSURE' ? '#ff453a' :
                        prop.status === 'TAX_DELINQUENT' ? '#ff9f0a' : '#00ff9d';

                    return (
                        <Marker
                            key={prop.id}
                            position={[prop.lat, prop.lng]}
                            icon={createCustomIcon(color)}
                            eventHandlers={{
                                click: () => onPropertySelect(prop),
                            }}
                        >
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Overlay HUD */}
            <div className="absolute bottom-8 right-8 flex items-center gap-4 text-[10px] font-mono tracking-widest text-gray-400 z-[1000] pointer-events-none">
                <div className="flex items-center gap-2 text-zenith-accent">
                    <Satellite className="w-4 h-4 animate-pulse" />
                    <span>SATELLITE_UPLINK: ACTIVE (OSM)</span>
                </div>
                <div className="flex items-center gap-2 text-zenith-accent">
                    <Wifi className="w-4 h-4" />
                    <span>LIVE_FEED: STABLE</span>
                </div>
            </div>
        </div>
    );
}
