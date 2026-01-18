'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, Check } from 'lucide-react';

export function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setStatus('idle');

        try {
            const res = await fetch('/api/subscribe-daily-brief', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setEmail('');
                setMessage("You're on the list. Watch your inbox at 6:00 AM.");
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="relative flex items-center">
                    <Mail className="absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="email"
                        required
                        placeholder="Enter your email for the Daily Brief..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading || status === 'success'}
                        className="w-full pl-12 pr-14 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || status === 'success' || !email}
                        className="absolute right-2 p-2 bg-slate-900 text-white rounded-full hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : status === 'success' ? (
                            <Check size={20} className="text-emerald-400" />
                        ) : (
                            <ArrowRight size={20} />
                        )}
                    </button>
                </div>
            </form>

            <div className={`mt-3 text-center text-sm font-medium transition-all duration-300 ${status === 'success' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                {status === 'success' ? (
                    <span className="text-emerald-600 flex items-center justify-center gap-1.5">
                        <Check size={14} />
                        {message}
                    </span>
                ) : status === 'error' ? (
                    <span className="text-red-500">{message}</span>
                ) : (
                    <span className="text-slate-400">&nbsp;</span>
                )}
            </div>

            {/* Micro-copy for trust (only show when idle) */}
            {status === 'idle' && (
                <p className="mt-3 text-center text-xs text-slate-400 font-medium">
                    Join 1,000+ decision makers. No spam, ever.
                </p>
            )}
        </div>
    );
}
