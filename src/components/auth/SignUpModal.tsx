'use client';

import { useState } from 'react';
import { X, Shield, Mail, User, Building, ArrowRight, CheckCircle, Lock } from 'lucide-react';

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStep('success');
            }
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Decorative Top Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8">
                    {step === 'form' ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-900/30 mb-4 ring-1 ring-blue-500/50">
                                    <Shield className="h-6 w-6 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Get Daily Intelligence</h2>
                                <p className="text-gray-400 text-sm">
                                    Receive curated AI briefings and high-priority alerts delivered to your inbox every morning.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Codename / Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                            placeholder="Agent Smith"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Secure Comms / Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Affiliation (Optional)</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={formData.organization}
                                            onChange={e => setFormData({ ...formData, organization: e.target.value })}
                                            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                            placeholder="Agency / Corp"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Encrypting...</span>
                                    ) : (
                                        <>
                                            Submit Request <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 mt-4">
                                    <Lock className="h-3 w-3" />
                                    <span>End-to-End Encrypted Transmission</span>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 mb-6 ring-1 ring-green-500/50">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">You're Subscribed</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Daily intelligence briefs will be delivered to your inbox every morning at 8 AM EST.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
