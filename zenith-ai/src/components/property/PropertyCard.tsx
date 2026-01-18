"use client";

import { ZenithProperty } from "@/lib/types";
import { Heart, Bed, Bath, Square, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface PropertyCardProps {
    property: ZenithProperty;
    onClick?: () => void;
    onSave?: () => void;
    isSaved?: boolean;
    isHovered?: boolean;
    isSelected?: boolean;
    variant?: "default" | "compact" | "horizontal";
}

export default function PropertyCard({
    property,
    onClick,
    onSave,
    isSaved = false,
    isHovered = false,
    isSelected = false,
    variant = "default",
}: PropertyCardProps) {
    // Format price
    const formatPrice = (value: number) => {
        if (!value || value <= 0) return "Contact for Price";
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(2)}M`;
        }
        return `$${(value / 1000).toFixed(0)}K`;
    };

    // Get status badge
    const getStatusBadge = () => {
        switch (property.status) {
            case "FSBO":
                return { label: "For Sale by Owner", className: "badge-green" };
            case "OFF_MARKET":
                return { label: "Off-Market", className: "badge-blue" };
            case "PRE_FORECLOSURE":
                return { label: "Pre-Foreclosure", className: "badge-gold" };
            case "TAX_DELINQUENT":
                return { label: "Tax Delinquent", className: "badge-red" };
            case "FORECLOSURE_RISK":
                return { label: "Foreclosure Risk", className: "badge-red" };
            default:
                return { label: "Available", className: "badge-gray" };
        }
    };

    const statusBadge = getStatusBadge();

    // Get satellite image URL
    const getImageUrl = () => {
        if (property.images && property.images[0]) {
            return property.images[0];
        }
        // ArcGIS satellite tile fallback
        const zoom = 18;
        const tileX = Math.floor((property.lng + 180) / 360 * Math.pow(2, zoom));
        const tileY = Math.floor((1 - Math.log(Math.tan(property.lat * Math.PI / 180) + 1 / Math.cos(property.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
        return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
    };

    if (variant === "horizontal") {
        return (
            <motion.div
                onClick={onClick}
                whileHover={{ scale: 1.01 }}
                className={`property-card flex gap-4 p-4 ${isSelected ? "ring-2 ring-[var(--zenith-blue)]" : ""} ${isHovered ? "border-[var(--zenith-blue)]" : ""}`}
            >
                {/* Image */}
                <div className="w-40 h-28 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                        src={getImageUrl()}
                        alt={property.address}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-xl font-bold text-gray-900">
                                {formatPrice(property.estimatedValue)}
                            </p>
                            <p className="text-sm font-medium text-gray-900 truncate mt-0.5">
                                {property.address}
                            </p>
                            <p className="text-sm text-gray-500">
                                {property.city}, {property.state} {property.zip}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSave?.();
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSaved
                                    ? "bg-red-50 text-red-500"
                                    : "bg-gray-100 text-gray-400 hover:text-red-500"
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        {property.beds && (
                            <span className="flex items-center gap-1">
                                <strong className="text-gray-900">{property.beds}</strong> bd
                            </span>
                        )}
                        {property.baths && (
                            <span className="flex items-center gap-1">
                                <strong className="text-gray-900">{property.baths}</strong> ba
                            </span>
                        )}
                        {property.squareFeet && (
                            <span className="flex items-center gap-1">
                                <strong className="text-gray-900">{property.squareFeet.toLocaleString()}</strong> sqft
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <span className={`badge ${statusBadge.className}`}>
                            {statusBadge.label}
                        </span>
                        {property.motivationScore && property.motivationScore > 70 && (
                            <span className="badge badge-gold">High Motivation</span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default vertical card
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -4 }}
            className={`property-card ${isSelected ? "ring-2 ring-[var(--zenith-blue)]" : ""} ${isHovered ? "border-[var(--zenith-blue)]" : ""}`}
        >
            {/* Image */}
            <div className="property-card-image">
                <img
                    src={getImageUrl()}
                    alt={property.address}
                    loading="lazy"
                />

                {/* Status Badge */}
                <div className={`property-card-badge ${statusBadge.className}`}>
                    {statusBadge.label}
                </div>

                {/* Save Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSave?.();
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${isSaved
                            ? "bg-white text-red-500"
                            : "bg-white/90 text-gray-400 hover:text-red-500"
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                </button>

                {/* Units badge for multi-family */}
                {property.units && property.units > 1 && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded">
                        {property.units} Units
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="property-card-content">
                <p className="property-card-price">
                    {formatPrice(property.estimatedValue)}
                </p>

                <p className="property-card-address">{property.address}</p>

                <p className="property-card-location">
                    {property.city}, {property.state} {property.zip}
                </p>

                <div className="property-card-stats">
                    {property.beds && (
                        <div className="property-card-stat">
                            <strong>{property.beds}</strong>
                            <span>bd</span>
                        </div>
                    )}
                    {property.baths && (
                        <div className="property-card-stat">
                            <strong>{property.baths}</strong>
                            <span>ba</span>
                        </div>
                    )}
                    {property.squareFeet && (
                        <div className="property-card-stat">
                            <strong>{property.squareFeet.toLocaleString()}</strong>
                            <span>sqft</span>
                        </div>
                    )}
                    {property.lotSize && (
                        <div className="property-card-stat">
                            <strong>{property.lotSize.toFixed(2)}</strong>
                            <span>acres</span>
                        </div>
                    )}
                </div>

                {/* Additional badges */}
                {property.motivationScore && property.motivationScore > 70 && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="badge badge-gold">
                            High Motivation Seller
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
