import React from 'react';
import { Shield, Globe, Zap } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full bg-white border-t border-slate-200 py-12 px-6 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* BRAND COLUMN */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <Shield className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter">NOVAI INTELLIGENCE</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                            Advanced open-source intelligence aggregation platform.
                            Monitoring global threats, AI developments, and critical infrastructure
                            in real-time for national security and public awareness.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            SYSTEM OPERATIONAL
                        </div>
                    </div>

                    {/* LINKS COLUMN 1 */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/us-intel" className="text-slate-600 hover:text-blue-600 transition-colors">US Intelligence</a></li>
                            <li><a href="/global-feed" className="text-slate-600 hover:text-blue-600 transition-colors">Global Feed</a></li>
                            <li><a href="/robotics" className="text-slate-600 hover:text-blue-600 transition-colors">Robotics Tracker</a></li>
                            <li><a href="/war-room" className="text-slate-600 hover:text-blue-600 transition-colors">War Room</a></li>
                        </ul>
                    </div>

                    {/* LINKS COLUMN 2 */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal & Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/policy" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="/policy" className="text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Data Sources</a></li>
                            <li><a href="mailto:contact@novai.ai" className="text-slate-600 hover:text-blue-600 transition-colors">Contact Support</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-400 text-xs font-mono">
                        © 2026 NOVAI INTELLIGENCE. ALL RIGHTS RESERVED.
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Zap size={14} className="text-amber-500" />
                            <span>Powered by Novai Live</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <Globe size={14} />
                            <span>Washington D.C.</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
