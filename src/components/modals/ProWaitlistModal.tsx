'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface ProWaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export function ProWaitlistModal({ isOpen, onClose, featureName }: ProWaitlistModalProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/pro-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name,
                    feature: featureName // Track which feature triggered the signup
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setEmail('');
                setName('');

                // Auto-close after 3 seconds
                setTimeout(() => {
                    onClose();
                    setTimeout(() => setSubmitted(false), 300);
                }, 3000);
            } else {
                setError(data.error || 'Failed to join waitlist. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting waitlist:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setSubmitted(false);
            setEmail('');
            setName('');
            setError(null);
        }, 300);
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal - WIDE SQUARE DESIGN */}
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors group z-10"
                >
                    <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                </button>

                {!submitted ? (
                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <Logo />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Join Novai Pro
                            </h2>
                            <p className="text-lg text-blue-600 font-medium">
                                Get early access to premium intelligence features
                            </p>
                        </div>

                        {/* Features - Horizontal Chips */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">
                                Pro Features
                            </h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 py-2.5">
                                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-900">Daily AI Briefs</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-full px-4 py-2.5">
                                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-900">Advanced Filters</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 py-2.5">
                                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-900">Emerging Narratives</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-full px-4 py-2.5">
                                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-900">Custom Alerts</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 py-2.5">
                                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-900">Pro Reports</span>
                                </div>
                            </div>
                        </div>

                        {/* Form - Centered & Compact */}
                        <div className="max-w-md mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Joining...
                                        </>
                                    ) : (
                                        <>
                                            Join Pro Waitlist →
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 text-center">{error}</p>
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="mt-6">
                                <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                                    <span className="font-medium">🔒 Secure</span>
                                    <span>•</span>
                                    <span className="font-medium">📧 No spam</span>
                                    <span>•</span>
                                    <span className="font-medium">✓ Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                            You're on the list! 🎉
                        </h3>
                        <p className="text-gray-600 text-lg mb-2">
                            We'll notify you when Novai Pro launches.
                        </p>
                        <p className="text-sm text-gray-500">
                            Check your inbox for confirmation.
                        </p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
