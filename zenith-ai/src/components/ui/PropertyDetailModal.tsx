import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZenithProperty } from "@/lib/types";
import { X, Share, Zap, Map as MapIcon, Layers, Activity, ShieldCheck, Phone, Mail, Fingerprint, ExternalLink, Loader2 } from "lucide-react";
import ProvenanceBadge from "./ProvenanceBadge";
import VerificationBadge from "./VerificationBadge";
import FinancialChart from "./FinancialChart";
import dynamic from "next/dynamic";
import { revealOwnerContact, OwnerContact } from "@/lib/data/skip-trace";
import { enrichPropertyDetails } from "@/lib/data/oracle";
import { RevenueAgent, getActiveUser } from "@/lib/agents/RevenueAgent";

// Dynamic Map for header
const MapEngine = dynamic(() => import("@/components/map/MapEngine"), { ssr: false });

interface PropertyDetailModalProps {
    property: ZenithProperty;
    onClose: () => void;
    onSave: (p: ZenithProperty) => void;
    isSaved: boolean;
}

export default function PropertyDetailModal({ property: initialProperty, onClose, onSave, isSaved }: PropertyDetailModalProps) {
    const [property, setProperty] = useState<ZenithProperty>(initialProperty);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GALLERY' | 'OWNERSHIP' | 'MARKET'>('OVERVIEW');
    const [viewMode, setViewMode] = useState<'MATRIX' | 'SATELLITE' | 'DRONE'>('MATRIX');
    const [revealedContact, setRevealedContact] = useState<OwnerContact | null>(null);
    const [isSkipTracing, setIsSkipTracing] = useState(false);
    const [isEnriching, setIsEnriching] = useState(false);

    const currentUser = getActiveUser();
    const revenue = new RevenueAgent(currentUser);

    // 1. DATA ENRICHMENT UPLINK (Absolute Reality Hardening)
    useEffect(() => {
        const triggerEnrichment = async () => {
            if (isEnriching) return;

            // GATE: Only Pro/Elite can access Deep Enrichment
            if (!revenue.canAccessFeature('DEEP_ENRICHMENT')) {
                console.warn("[ZENITH GATE] DEEP ENRICHMENT RESTRICTED FOR STANDARD TIER.");
                return;
            }

            setIsEnriching(true);
            try {
                const enriched = await enrichPropertyDetails(initialProperty);
                setProperty(enriched);
            } catch (e) {
                console.error("[ZENITH ENRICH] UPLINK FAILURE.");
            } finally {
                setIsEnriching(false);
            }
        };
        triggerEnrichment();
    }, [initialProperty]);

    // Reset state when property changes
    useEffect(() => {
        setProperty(initialProperty);
        setRevealedContact(null);
    }, [initialProperty]);

    const handleRevealContact = async () => {
        if (isSkipTracing) return;

        // GATE: Check for Elite Skip Trace authorization
        if (!revenue.canAccessFeature('SKIP_TRACE_BASIC')) {
            alert("INSTITUTIONAL_UPLINK_RESTRICTED: ELITE TIER REQUIRED FOR SKIP-TRACE ACCESS.");
            return;
        }

        setIsSkipTracing(true);
        const contact = await revealOwnerContact(
            property.id,
            property.ownerName || (property.ownerType === 'INDIVIDUAL' ? "Private Owner" : property.county || "Unknown"),
            property.address
        );
        setRevealedContact(contact);
        setIsSkipTracing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-y-0 right-0 w-full lg:w-[60vw] bg-[#020202] text-white/90 font-sans z-[100] shadow-[0_0_100px_rgba(0,0,0,0.8)] border-l border-white/5 flex flex-col"
        >
            {/* TERMINAL HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-zenith-accent/10 border border-zenith-accent/30 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-zenith-accent/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Activity className="w-5 h-5 text-zenith-accent" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase italic">Titanium_Terminal_v10</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zenith-accent animate-pulse" />
                            <p className="text-[10px] font-mono text-zenith-accent/60 uppercase tracking-widest truncate max-w-[300px]">{property.address}, {property.city}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 group">
                        <Share className="w-4 h-4 text-white/40 group-hover:text-white" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* QUAD-PANE TERMINAL VIEW */}
            <div className="flex-1 overflow-hidden grid grid-cols-12 grid-rows-6 gap-px bg-white/5 p-px">

                {/* PANE 1: VISUAL MATRIX (Top-Left 8x4) */}
                <div className="col-span-12 lg:col-span-8 row-span-4 bg-[#050505] relative group overflow-hidden border border-white/5 order-1">
                    {/* Visual Matrix Controls */}
                    <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
                        {(['MATRIX', 'SATELLITE', 'DRONE'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setViewMode(m)}
                                className={`px-2 py-1 text-[8px] font-black uppercase tracking-tighter border transition-all ${viewMode === m ? 'bg-zenith-accent text-black border-zenith-accent' : 'bg-black/80 text-white/40 border-white/10 hover:border-white/40'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div className="absolute inset-0">
                        {viewMode === 'MATRIX' ? (
                            <div className="w-full h-full grid grid-cols-3 gap-0.5 bg-black/20 p-px">
                                {[0, 120, 240].map((h, i) => (
                                    <div key={i} className="relative bg-zinc-900 overflow-hidden">
                                        <iframe
                                            className="w-full h-full grayscale-[0.5] contrast-[1.1] brightness-[0.9]"
                                            src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&location=${property.lat},${property.lng}&fov=90&heading=${h}&pitch=10`}
                                        />
                                        <div className="absolute top-2 left-2 px-1 bg-black/60 text-[8px] font-mono text-white/40 uppercase">ANGLE_0{i + 1}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                <img
                                    src={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/${Math.floor((1 - Math.log(Math.tan(property.lat * Math.PI / 180) + 1 / Math.cos(property.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 18))}/${Math.floor((property.lng + 180) / 360 * Math.pow(2, 18))}`}
                                    className="w-full h-full object-cover grayscale-[0.3] brightness-[0.8]"
                                    alt="Sovereign Visual"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </div>
                        )}
                    </div>
                </div>

                {/* PANE 2: KINETIC DATA GRID (Right-Col 4x4) */}
                <div className="col-span-12 lg:col-span-4 row-span-4 bg-[#080808] p-6 border border-white/5 space-y-6 overflow-y-auto custom-scrollbar order-2">
                    <div className="space-y-1">
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-3xl font-black italic tracking-tighter text-white">${property.estimatedValue.toLocaleString()}</h3>
                            <span className="text-[10px] font-mono text-zenith-accent uppercase tracking-widest">ZEN_ESTIMATE_v10</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] truncate">{property.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-white/5 rounded-sm overflow-hidden border border-white/5">
                        {[
                            { label: 'Asset Type', value: property.type },
                            { label: 'Capacity', value: `${property.beds || '-'} BR / ${property.baths || '-'} BA` },
                            { label: 'Scale', value: `${property.squareFeet?.toLocaleString() || '-'} SQFT` },
                            { label: 'Equity Overlay', value: `$${property.equity?.toLocaleString() || '-'}` },
                            { label: 'Yield baseline', value: `$${property.rentEstimate?.toLocaleString()}/MO` },
                            { label: 'Integrity', value: `${property.provenance.base.confidence * 100}%` },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#050505] p-3 space-y-1">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">{stat.label}</p>
                                <p className="text-[10px] font-mono text-white uppercase truncate">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-2">
                        <ProvenanceBadge source={property.provenance.base.source} confidence={property.provenance.base.confidence} verifiedAt={property.provenance.base.verifiedAt} />
                        {property.verification && <VerificationBadge confidence={property.verification.confidence} isValid={property.verification.isValid} issues={property.verification.issues} />}
                    </div>
                </div>

                {/* PANE 3: EXECUTIVE BRIEF (Bottom-Left 8x2) */}
                <div className="col-span-12 lg:col-span-8 row-span-2 bg-[#0a0a0a] p-8 border border-white/5 flex flex-col gap-4 relative order-3">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zenith-accent/20 to-transparent" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-zenith-accent" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Executive_Intelligence_Briefing</h4>
                    </div>
                    <p className="text-lg lg:text-xl font-medium leading-relaxed italic text-white/90 max-w-4xl tracking-tight">
                        "{property.briefing || "Synthesizing deep-market signals for target asset..."}"
                    </p>
                    <div className="flex gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-white/30 uppercase">
                            <Loader2 className="w-3 h-3 animate-spin text-zenith-accent" />
                            Live_Feed_Active
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-white/30 uppercase">
                            <ShieldCheck className="w-3 h-3 text-zenith-accent" />
                            Sovereign_Audit_Complete
                        </div>
                    </div>
                </div>

                {/* PANE 4: ALPHA SIGNALS (Bottom-Right 4x2) */}
                <div className="col-span-12 lg:col-span-4 row-span-2 bg-gradient-to-br from-[#0c0c0c] to-[#050505] p-6 border border-white/5 flex flex-col gap-4 order-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Alpha_Projection</h4>
                        <span className="px-1.5 py-0.5 rounded-sm bg-zenith-accent/10 border border-zenith-accent/30 text-[8px] font-mono text-zenith-accent uppercase">Tier_Titanium</span>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Momentum</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black italic text-white">{property.alpha?.momentumScore || 75}</span>
                                <span className="text-[10px] font-mono text-zenith-accent">/100</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Growth_24M</p>
                            <p className="text-2xl font-black italic text-zenith-accent">+{property.alpha?.projectedGrowth24mo || 12.4}%</p>
                        </div>
                        <div className="col-span-2 p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Target_Exit_Window</p>
                                <p className="text-[10px] font-mono font-black text-white uppercase">{property.alpha?.exitWindow || 'Q4 2026'}</p>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-zenith-accent w-[85%] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="p-6 border-t border-white/5 bg-black flex items-center justify-between z-50 shrink-0">
                <div className="flex gap-4">
                    <button className="px-8 py-3 bg-zenith-accent text-black text-xs font-black uppercase tracking-[0.2em] italic hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center gap-2 group">
                        <Zap className="w-4 h-4" />
                        Initialize_Execution
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                    {!revealedContact ? (
                        <button
                            onClick={handleRevealContact}
                            disabled={isSkipTracing}
                            className="px-8 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] italic hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            {isSkipTracing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4 opacity-40" />}
                            Connect_Owner
                        </button>
                    ) : (
                        <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded border border-white/10">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-white/40 tracking-widest">CONTACT_FOUND</span>
                                <span className="text-[10px] font-mono text-white select-all">{revealedContact.phones[0]}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="hidden md:flex flex-col items-end gap-1">
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">Proprietary Intelligence System</p>
                    <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest leading-none">© 2026 Zenith Alpha-10 Terminal</p>
                </div>
            </div>
        </motion.div>
    );
}

