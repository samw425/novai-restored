'use client';

import { useState } from 'react';
import { X, Check, Loader2, Mail } from 'lucide-react';
import { sendFormSubmitBackup } from '@/lib/email-backup';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    source?: string;
}

export function WaitlistModal({ isOpen, onClose, source = 'General' }: WaitlistModalProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Dual Dispatch: Client-side backup
        try {
            await sendFormSubmitBackup({
                email,
                subject: `Waitlist Join (${source})`,
                source: source,
                message: 'User joined Pro Waitlist via Modal'
            });
        } catch (err) {
            console.error('Backup email failed:', err);
        }

        try {
            // Use internal API which handles Resend + FormSubmit fallback + Database
            const response = await fetch('/api/pro-waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    name: 'Waitlist User', // Generic name since this modal only asks for email
                    feature: source || 'General Waitlist'
                }),
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setEmail('');
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Waitlist submission error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative animate-in zoom-in-95 duration-200 border border-gray-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-6 mx-auto">
                        <Mail className="h-6 w-6 text-indigo-600" />
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Join the Waitlist</h3>
                        <p className="text-gray-600">
                            Get early access to Novai Pro features including deep synthesis and PDF exports.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2 font-medium animate-in fade-in">
                            <Check className="h-5 w-5" />
                            You're on the list!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    disabled={status === 'loading'}
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-red-600 text-sm text-center">Something went wrong. Please try again.</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    'Join Waitlist'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
