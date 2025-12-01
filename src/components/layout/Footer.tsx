import Link from 'next/link';
import { Shield, Activity, Lock, Globe, Github, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white">
                            <Shield className="w-6 h-6 text-blue-600" />
                            <span className="font-bold text-lg tracking-tight">NOVAI INTELLIGENCE</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500">
                            Global intelligence synthesis for the information age.
                            Connecting 70+ real-time data streams to provide
                            actionable situational awareness.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Intelligence Sources */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Intelligence Sources</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                US Dept of Defense
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                CISA Cyber Alerts
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Institute for Study of War
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Global Markets (AlphaVantage)
                            </li>
                        </ul>
                    </div>

                    {/* System Status */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">System Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm border-b border-slate-900 pb-2">
                                <span>Global Feed</span>
                                <span className="text-emerald-500 font-mono text-xs">ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-b border-slate-900 pb-2">
                                <span>War Room</span>
                                <span className="text-emerald-500 font-mono text-xs">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-b border-slate-900 pb-2">
                                <span>Synthesis Engine</span>
                                <span className="text-emerald-500 font-mono text-xs">OPERATIONAL</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>Latency</span>
                                <span className="text-emerald-500 font-mono text-xs">&lt; 120ms</span>
                            </div>
                        </div>
                    </div>

                    {/* Legal / Official */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal & Compliance</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Data Governance</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                        <div className="mt-6 flex items-center gap-2 text-xs text-slate-600 bg-slate-900/50 p-2 rounded border border-slate-900">
                            <Lock className="w-3 h-3" />
                            <span>256-bit Encrypted Connection</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>&copy; {new Date().getFullYear()} Novai Intelligence. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <Globe className="w-3 h-3" />
                            Washington, D.C.
                        </span>
                        <span className="flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            All Systems Normal
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
