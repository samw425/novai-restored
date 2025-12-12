'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Clock } from 'lucide-react';

interface ComingSoonProps {
    title: string;
    description: string;
    eta?: string;
    icon?: React.ReactNode;
}

export function ComingSoon({ title, description, eta = "Q4 2025", icon }: ComingSoonProps) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            try {
                // Send to backend via Pro Waitlist API (generic enough for feature waitlists)
                const response = await fetch('/api/pro-waitlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name: 'Coming Soon User', // Placeholder name as we only capture email here
                        feature: `Coming Soon: ${title}`
                    }),
                });

                if (response.ok) {
                    setSubmitted(true);
                } else {
                    console.error('Failed to join waitlist');
                }
            } catch (error) {
                console.error('Error submitting waitlist:', error);
            }
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full relative group">
                {/* Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                <div className="relative bg-[#0F172A] border border-blue-900/50 rounded-2xl p-8 md:p-12 overflow-hidden">
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center">

                        {/* Icon Badge */}
                        <div className="mb-8 relative">
                            <div className="w-20 h-20 bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                                {icon || <Lock className="w-10 h-10 text-blue-400" />}
                            </div>
                            <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-[#0F172A] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {eta}
                            </div>
                        </div>

                        {/* Text */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            {title} <span className="text-blue-500">Initializing</span>
                        </h1>
                        <p className="text-blue-200/60 text-lg mb-10 max-w-lg leading-relaxed">
                            {description}
                        </p>

                        {/* Waitlist Form */}
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email for early access"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-blue-950/30 border border-blue-800/50 rounded-lg px-4 py-3 text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group/btn"
                                >
                                    Notify Me
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                                <Sparkles className="w-5 h-5" />
                                <span className="font-medium">You're on the list. We'll signal you when this module goes live.</span>
                            </div>
                        )}

                        {/* System Footer */}
                        <div className="mt-12 pt-8 border-t border-blue-900/30 w-full flex justify-between items-center text-[10px] text-blue-400/40 font-mono uppercase tracking-widest">
                            <span>System Status: Development</span>
                            <span>Module ID: {title.toUpperCase().replace(/\s+/g, '_')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
