'use client';

import React from 'react';
import { Shield, Activity, Eye, Network } from 'lucide-react';

export default function LogoTestPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-12 space-y-16">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">NOVAI BRAND CONCEPTS</h1>
                <p className="text-slate-500">Review the options below and select a direction.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">

                {/* OPTION 1: THE APEX (Classic Stealth) */}
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center space-y-8 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 flex items-center justify-center relative">
                            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M48 16L80 72H16L48 16Z" fill="#0F172A" className="group-hover:fill-blue-600 transition-colors duration-500" />
                                <path d="M48 16L48 56L32 72" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-3xl tracking-tighter leading-none text-slate-900 block">NOVAI</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-2 block">Intelligence</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-900">Option 1: The Apex</h3>
                        <p className="text-xs text-slate-500 mt-2">The classic stealth shape. Balanced, sharp, and authoritative.</p>
                    </div>
                </div>

                {/* OPTION 2: THE DELTA (Split) */}
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center space-y-8 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 flex items-center justify-center relative">
                            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M46 16L14 72H46V16Z" fill="#0F172A" className="group-hover:fill-blue-600 transition-colors duration-500" />
                                <path d="M50 16L82 72H50V16Z" fill="#0F172A" className="group-hover:fill-blue-800 transition-colors duration-500" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-3xl tracking-tighter leading-none text-slate-900 block">NOVAI</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-2 block">Intelligence</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-900">Option 2: The Delta</h3>
                        <p className="text-xs text-slate-500 mt-2">Dual pillars forming a unity. Represents data + intelligence.</p>
                    </div>
                </div>

                {/* OPTION 3: THE PRISM (Refracted) */}
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center space-y-8 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 flex items-center justify-center relative">
                            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M48 12L84 76H12L48 12Z" fill="#0F172A" className="group-hover:fill-blue-600 transition-colors duration-500" />
                                <path d="M60 32L36 76" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                <circle cx="60" cy="32" r="3" fill="#EF4444" className="animate-pulse" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-3xl tracking-tighter leading-none text-slate-900 block">NOVAI</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-2 block">Intelligence</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-900">Option 3: The Prism</h3>
                        <p className="text-xs text-slate-500 mt-2">Asymmetrical cut with a live node. Dynamic and active.</p>
                    </div>
                </div>

                {/* OPTION 4: THE VECTOR (Motion) */}
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center space-y-8 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 flex items-center justify-center relative">
                            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M48 16L80 72H16L48 16Z" stroke="#0F172A" strokeWidth="8" strokeLinejoin="round" className="group-hover:stroke-blue-600 transition-colors duration-500" />
                                <path d="M48 28V60" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" className="group-hover:stroke-blue-600 transition-colors duration-500" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <span className="font-black text-3xl tracking-tighter leading-none text-slate-900 block">NOVAI</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-2 block">Intelligence</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-900">Option 4: The Vector</h3>
                        <p className="text-xs text-slate-500 mt-2">Outline style. Structural, transparent, and precise.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
