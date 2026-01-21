'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Star, Check, ChevronLeft, ChevronRight, Home, FileText, History, MapPin, Phone, ExternalLink, Bed, Bath, Maximize, Calendar, Building, TrendingUp, GraduationCap, Shield, Footprints, Bus, Bike, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ZenithProperty } from '@/lib/types';
import ImageGallery from '@/components/property/ImageGallery';

interface PropertyDetailModalProps {
    property: ZenithProperty;
    onClose: () => void;
}

type TabType = 'overview' | 'details' | 'history' | 'neighborhood' | 'contact';

export default function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isCopied, setIsCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(() => {
        if (typeof window === 'undefined') return false;
        const saved = JSON.parse(localStorage.getItem('zenith_saved') || '[]');
        return saved.includes(property.id);
    });

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem('zenith_saved') || '[]');
        let newSaved;
        if (isSaved) {
            newSaved = saved.filter((id: string) => id !== property.id);
        } else {
            newSaved = [...saved, property.id];
        }
        localStorage.setItem('zenith_saved', JSON.stringify(newSaved));
        setIsSaved(!isSaved);
    };

    const handleShare = () => {
        const url = `${window.location.origin}/search?propertyId=${property.id}`;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
        { id: 'details', label: 'Details', icon: <FileText size={16} /> },
        { id: 'history', label: 'History', icon: <History size={16} /> },
        { id: 'neighborhood', label: 'Neighborhood', icon: <MapPin size={16} /> },
        { id: 'contact', label: 'Skip Trace', icon: <Phone size={16} /> },
    ];

    const formatPrice = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TAX_DELINQUENT': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'PRE_FORECLOSURE': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'FORECLOSURE_RISK': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'OFF_MARKET': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        }
    };

    const getMotivationLabel = (score: number) => {
        if (score >= 80) return { label: 'Very High', color: 'text-red-400' };
        if (score >= 60) return { label: 'High', color: 'text-orange-400' };
        if (score >= 40) return { label: 'Moderate', color: 'text-yellow-400' };
        return { label: 'Low', color: 'text-emerald-400' };
    };

    const motivation = getMotivationLabel(property.motivationScore || 0);

    // Generate satellite image URL
    const getSatelliteImage = () => {
        if (property.lat && property.lng) {
            const zoom = 18;
            const tileX = Math.floor((property.lng + 180) / 360 * Math.pow(2, zoom));
            const tileY = Math.floor((1 - Math.log(Math.tan(property.lat * Math.PI / 180) + 1 / Math.cos(property.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
            return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
        }
        return null;
    };

    const images = property.images?.length ? property.images : [getSatelliteImage()].filter(Boolean) as string[];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={handleBackdropClick}
                onKeyDown={handleKeyDown as any}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl"
                >
                    {/* Top Actions */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <button
                            onClick={handleSave}
                            className={`p-2 rounded-full backdrop-blur-md transition-all ${isSaved ? 'bg-blue-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'}`}
                            title={isSaved ? "Remove from saved" : "Save property"}
                        >
                            <Star size={20} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
                            title="Share property"
                        >
                            {isCopied ? <Check size={20} className="text-emerald-400" /> : <Share2 size={20} />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Image Gallery Header */}
                    <div className="relative h-72 md:h-80">
                        <ImageGallery images={images} address={property.address} />

                        {/* Status Badge Overlay */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(property.status)}`}>
                                {property.status.replace(/_/g, ' ')}
                            </span>
                            {property.motivationScore && property.motivationScore >= 60 && (
                                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                    🔥 High Motivation
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Header Info */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                    {formatPrice(property.estimatedValue || 0)}
                                </h2>
                                <p className="text-lg text-slate-300">{property.address}</p>
                                <p className="text-sm text-slate-500">{property.city}, {property.state} {property.zip}</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-4 text-sm">
                                {property.beds && (
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <Bed size={16} className="text-blue-400" />
                                        <span>{property.beds} beds</span>
                                    </div>
                                )}
                                {property.baths && (
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <Bath size={16} className="text-blue-400" />
                                        <span>{property.baths} baths</span>
                                    </div>
                                )}
                                {property.squareFeet && (
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                        <Maximize size={16} className="text-blue-400" />
                                        <span>{property.squareFeet.toLocaleString()} sqft</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 border-b border-white/10">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[200px] max-h-[40vh] overflow-y-auto">
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <h4 className="text-sm font-semibold text-slate-400 mb-3">Motivation Score</h4>
                                            <div className="flex items-center gap-3">
                                                <div className={`text-4xl font-bold ${motivation.color}`}>
                                                    {property.motivationScore || 0}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${motivation.color}`}>{motivation.label}</p>
                                                    <p className="text-xs text-slate-500">Seller motivation level</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"
                                                    style={{ width: `${property.motivationScore || 0}%` }}
                                                />
                                            </div>
                                        </div>

                                        {property.distressSignal && (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Distress Signal</h4>
                                                <p className="text-white font-medium">{property.distressSignal.type}</p>
                                                <p className="text-sm text-slate-400">{property.distressSignal.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        {property.equity !== undefined && (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <h4 className="text-sm font-semibold text-slate-400 mb-2">Estimated Equity</h4>
                                                <p className="text-2xl font-bold text-emerald-400">
                                                    {formatPrice(property.equity)}
                                                </p>
                                            </div>
                                        )}

                                        {property.briefing && (
                                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                                <h4 className="text-sm font-semibold text-blue-400 mb-2">AI Briefing</h4>
                                                <p className="text-sm text-slate-300 leading-relaxed">{property.briefing}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <DetailCard label="Property Type" value={property.type} icon={<Building size={16} />} />
                                    <DetailCard label="Year Built" value={property.yearBuilt || 'N/A'} icon={<Calendar size={16} />} />
                                    <DetailCard label="Lot Size" value={property.lotSize ? `${property.lotSize.toLocaleString()} sqft` : 'N/A'} icon={<Maximize size={16} />} />
                                    <DetailCard label="Owner Type" value={property.ownerType || 'Unknown'} icon={<Home size={16} />} />
                                    <DetailCard label="Owner Name" value={property.ownerName || 'Unknown'} icon={<FileText size={16} />} />
                                    {property.units && <DetailCard label="Units" value={property.units} icon={<Building size={16} />} />}
                                    {property.rentEstimate && <DetailCard label="Rent Estimate" value={`$${property.rentEstimate.toLocaleString()}/mo`} icon={<TrendingUp size={16} />} />}
                                    {property.capRate && <DetailCard label="Cap Rate" value={`${property.capRate.toFixed(1)}%`} icon={<TrendingUp size={16} />} />}
                                    {property.county && <DetailCard label="County" value={property.county} icon={<MapPin size={16} />} />}
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-6">
                                    {/* Tax History */}
                                    {property.taxHistory && property.taxHistory.length > 0 && (
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <DollarSign size={16} className="text-blue-400" />
                                                <h4 className="text-sm font-semibold text-slate-400">Tax Payment History</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {property.taxHistory.slice(0, 5).map((tax, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-slate-500 text-sm w-12">{tax.year}</span>
                                                            <span className={`px-2 py-0.5 text-xs rounded-full ${tax.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                tax.status === 'DELINQUENT' ? 'bg-red-500/20 text-red-400' :
                                                                    'bg-yellow-500/20 text-yellow-400'
                                                                }`}>
                                                                {tax.status}
                                                            </span>
                                                        </div>
                                                        <span className="text-white font-semibold">${tax.amount.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sale History */}
                                    {property.saleHistory && property.saleHistory.length > 0 ? (
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <TrendingUp size={16} className="text-blue-400" />
                                                <h4 className="text-sm font-semibold text-slate-400">Sale History</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {property.saleHistory.map((sale, idx) => {
                                                    const prevSale = property.saleHistory?.[idx + 1];
                                                    const priceChange = prevSale ? ((sale.price - prevSale.price) / prevSale.price) * 100 : null;
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                            <div>
                                                                <p className="text-xl font-bold text-white">${sale.price.toLocaleString()}</p>
                                                                <p className="text-sm text-slate-500">{sale.date}</p>
                                                                {sale.buyer && <p className="text-xs text-slate-600">Buyer: {sale.buyer}</p>}
                                                            </div>
                                                            {priceChange !== null && (
                                                                <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                    {priceChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                                    <span className="font-semibold">{Math.abs(priceChange).toFixed(1)}%</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : property.lastSaleDate && property.lastSalePrice ? (
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <h4 className="text-sm font-semibold text-slate-400 mb-3">Last Sale</h4>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xl font-bold text-white">{formatPrice(property.lastSalePrice)}</p>
                                                    <p className="text-sm text-slate-500">{property.lastSaleDate}</p>
                                                </div>
                                                {property.estimatedValue && property.lastSalePrice && (
                                                    <div className={`text-right ${property.estimatedValue > property.lastSalePrice ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        <p className="text-lg font-bold">
                                                            {property.estimatedValue > property.lastSalePrice ? '+' : ''}
                                                            {((property.estimatedValue - property.lastSalePrice) / property.lastSalePrice * 100).toFixed(1)}%
                                                        </p>
                                                        <p className="text-xs text-slate-500">since purchase</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-500">
                                            <History size={40} className="mx-auto mb-3 opacity-50" />
                                            <p>No sale history available</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'neighborhood' && (
                                <div className="space-y-6">
                                    {/* Walk/Transit/Bike Scores */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <ScoreCircle
                                            label="Walk Score"
                                            score={property.neighborhood?.walkScore || 0}
                                            icon={<Footprints size={16} />}
                                        />
                                        <ScoreCircle
                                            label="Transit Score"
                                            score={property.neighborhood?.transitScore || 0}
                                            icon={<Bus size={16} />}
                                        />
                                        <ScoreCircle
                                            label="Bike Score"
                                            score={property.neighborhood?.bikeScore || 0}
                                            icon={<Bike size={16} />}
                                        />
                                    </div>

                                    {/* Crime Rating */}
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield size={16} className="text-blue-400" />
                                            <h4 className="text-sm font-semibold text-slate-400">Safety Rating</h4>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`text-2xl font-bold ${property.neighborhood?.crimeRating === 'LOW' ? 'text-emerald-400' :
                                                property.neighborhood?.crimeRating === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                {property.neighborhood?.crimeRating || 'UNKNOWN'}
                                            </div>
                                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${property.neighborhood?.crimeRating === 'LOW' ? 'bg-emerald-500' :
                                                        property.neighborhood?.crimeRating === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${100 - (property.neighborhood?.crimeIndex || 50)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nearby Schools */}
                                    {property.neighborhood?.schools && property.neighborhood.schools.length > 0 && (
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <GraduationCap size={16} className="text-blue-400" />
                                                <h4 className="text-sm font-semibold text-slate-400">Nearby Schools</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {property.neighborhood.schools.slice(0, 4).map((school, idx) => (
                                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{school.name}</p>
                                                            <p className="text-xs text-slate-500 capitalize">{school.type} • {school.distance}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-yellow-400">★</span>
                                                            <span className="text-white font-semibold">{school.rating}/10</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Data Fallback */}
                                    {!property.neighborhood && (
                                        <div className="text-center py-8 text-slate-500">
                                            <MapPin size={40} className="mx-auto mb-3 opacity-50" />
                                            <p>Loading neighborhood data...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <SkipTraceTab property={property} />
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function DetailCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-white font-semibold">{value}</p>
        </div>
    );
}

function ScoreCircle({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
    const getScoreColor = (s: number) => {
        if (s >= 70) return 'text-emerald-400';
        if (s >= 50) return 'text-yellow-400';
        if (s >= 25) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreGradient = (s: number) => {
        if (s >= 70) return 'from-emerald-500 to-emerald-400';
        if (s >= 50) return 'from-yellow-500 to-yellow-400';
        if (s >= 25) return 'from-orange-500 to-orange-400';
        return 'from-red-500 to-red-400';
    };

    return (
        <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="relative w-16 h-16 mb-2">
                {/* Background circle */}
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-slate-700"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="url(#scoreGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / 100) * 176} 176`}
                        className={getScoreGradient(score)}
                    />
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className={score >= 70 ? 'text-emerald-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'} stopColor="currentColor" />
                            <stop offset="100%" className={score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'} stopColor="currentColor" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Score number */}
                <div className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${getScoreColor(score)}`}>
                    {score}
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
        </div>
    );
}

// Skip Trace Tab Component with Live API Integration
function SkipTraceTab({ property }: { property: ZenithProperty }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [contactData, setContactData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleReveal = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Import and call the skip trace service
            const { revealOwnerContact } = await import('@/lib/data/skip-trace');
            const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;

            const result = await revealOwnerContact(
                property.id,
                property.ownerName,
                fullAddress,
                'demo-user' // Anonymous user for now
            );

            if (result) {
                setContactData(result);
                setIsRevealed(true);
            } else {
                setError('No contact information found');
            }
        } catch (err) {
            console.error('Skip trace failed:', err);
            setError('Failed to retrieve contact information');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate comprehensive public records links
    const getPublicRecordLinks = () => {
        const ownerName = property.ownerName || '';
        const address = property.address || '';
        const city = property.city || '';
        const state = property.state || '';
        const zip = property.zip || '';
        const fullAddress = `${address}, ${city}, ${state} ${zip}`;

        return [
            {
                name: 'TruePeopleSearch',
                url: `https://www.truepeoplesearch.com/results?name=${encodeURIComponent(ownerName)}&citystatezip=${encodeURIComponent(city + ', ' + state)}`,
                description: 'Free phone & address lookup'
            },
            {
                name: 'FastPeopleSearch',
                url: `https://www.fastpeoplesearch.com/name/${encodeURIComponent(ownerName.replace(/\s+/g, '-').toLowerCase())}`,
                description: 'Reverse phone lookup'
            },
            {
                name: 'Spokeo',
                url: `https://www.spokeo.com/${encodeURIComponent(ownerName.replace(/\s+/g, '-'))}`,
                description: 'Social media profiles'
            },
            {
                name: 'WhitePages',
                url: `https://www.whitepages.com/name/${encodeURIComponent(ownerName.replace(/\s+/g, '-'))}/${state}`,
                description: 'Background check'
            },
            {
                name: 'County Records',
                url: getCountyRecordsUrl(state, zip),
                description: 'Official tax records'
            },
            {
                name: 'Google Search',
                url: `https://www.google.com/search?q=${encodeURIComponent(ownerName + ' ' + city + ' ' + state + ' property owner')}`,
                description: 'General search'
            }
        ];
    };

    // Get county-specific property appraiser URLs
    function getCountyRecordsUrl(state: string, zip: string): string {
        if (zip.startsWith('33') || zip.startsWith('34')) {
            return 'https://www.miamidade.gov/Apps/PA/propertysearch/';
        } else if (zip.startsWith('90') || zip.startsWith('91')) {
            return 'https://portal.assessor.lacounty.gov/';
        } else if (zip.startsWith('60')) {
            return 'https://www.cookcountyassessor.com/';
        } else if (zip.startsWith('77')) {
            return 'https://hcad.org/';
        } else if (zip.startsWith('85')) {
            return 'https://mcassessor.maricopa.gov/';
        } else if (zip.startsWith('30')) {
            return 'https://qpublic.schneidercorp.com/Application.aspx?AppID=1031';
        } else if (zip.startsWith('75') || zip.startsWith('76')) {
            return 'https://www.dallascad.org/';
        }
        return `https://www.google.com/search?q=${encodeURIComponent(state + ' county property appraiser')}`;
    }

    return (
        <div className="space-y-4">
            {/* Owner Information (Always Visible) */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Owner Information</h4>
                <p className="text-lg font-medium text-white">{property.ownerName || 'Unknown Owner'}</p>
                <p className="text-sm text-slate-400">{property.ownerType || 'Individual'}</p>
                {property.address && (
                    <p className="text-sm text-slate-500 mt-1">{property.address}</p>
                )}
            </div>

            {/* Revealed Contact Info OR Locked State */}
            {isRevealed && contactData ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-3">✓ Contact Information Revealed</h4>

                    {/* Phones */}
                    {contactData.phones && contactData.phones.length > 0 && (
                        <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Phone Numbers</p>
                            {contactData.phones.map((phone: string, idx: number) => (
                                <a
                                    key={idx}
                                    href={`tel:${phone.replace(/\D/g, '')}`}
                                    className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
                                >
                                    <Phone size={14} />
                                    {phone}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Emails */}
                    {contactData.emails && contactData.emails.length > 0 && (
                        <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Email Addresses</p>
                            {contactData.emails.map((email: string, idx: number) => (
                                <a
                                    key={idx}
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-2 text-white hover:text-emerald-400 transition-colors"
                                >
                                    📧 {email}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Source */}
                    <p className="text-xs text-slate-600 mt-2">
                        Source: {contactData.source || 'OSINT'}
                    </p>
                </div>
            ) : (
                <div className="relative p-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-md bg-slate-900/50 flex items-center justify-center">
                        <div className="text-center">
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                    <p className="text-white">Searching records...</p>
                                </>
                            ) : error ? (
                                <>
                                    <p className="text-red-400 mb-2">{error}</p>
                                    <button
                                        onClick={handleReveal}
                                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-white font-semibold mb-2">🔒 Unlock Contact Info</p>
                                    <button
                                        onClick={handleReveal}
                                        className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                                    >
                                        Reveal Contact (Free OSINT)
                                    </button>
                                    <p className="text-xs text-slate-500 mt-2">Premium skip trace coming soon</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="opacity-30">
                        <p className="text-white">📞 (XXX) XXX-XXXX</p>
                        <p className="text-white">📧 owner@xxxxx.com</p>
                    </div>
                </div>
            )}

            {/* Enhanced OSINT Links */}
            <div className="p-4 rounded-xl bg-slate-800/50">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">
                    🔍 Public Records Lookup
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {getPublicRecordLinks().map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <span className="text-sm text-slate-300 flex items-center gap-1">
                                <ExternalLink size={12} />
                                {link.name}
                            </span>
                            <span className="text-xs text-slate-500">{link.description}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Legal / Removal Link */}
            <div className="text-center pt-2">
                <a
                    href="/privacy#opt-out"
                    className="text-[10px] text-slate-600 hover:text-slate-400 underline transition-colors"
                >
                    Request data removal or opt-out
                </a>
            </div>
        </div>
    );
}
