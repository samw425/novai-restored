'use client';

import { useState } from 'react';
import { Mail, Sparkles, Check } from 'lucide-react';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name: '', organization: '', interest: 'Waitlist' })
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-2">You're on the list!</h2>
                    <p className="text-[#64748B] mb-6">
                        We'll notify you when Novai launches. Check your inbox for confirmation.
                    </p>
                    <a
                        href="/global-feed"
                        className="inline-block px-6 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors"
                    >
                        Explore the Feed
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-8 h-8 text-[#2563EB]" />
                        <h1 className="text-3xl font-bold text-[#0F172A]">Join Novai</h1>
                    </div>
                    <p className="text-[#64748B] text-lg">
                        Get early access to the ultimate AI intelligence platform
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8">
                    <div className="mb-6">
                        <h3 className="font-semibold text-[#0F172A] mb-3">Why Join Novai?</h3>
                        <ul className="space-y-3">
                            {[
                                'Daily Intelligence Briefing (Curated by AI)',
                                'Access to "Deep Signals" & Market Analysis',
                                'Customizable Feed (Follow specific topics)',
                                'Critical Risk Alerts ("War Room" Access)',
                                'Early Access to Enterprise API'
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[#64748B]">
                                    <Check className="w-4 h-4 text-[#2563EB] mt-0.5 flex-shrink-0" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Joining...' : 'Join the Waitlist'}
                        </button>
                    </form>

                    <p className="text-xs text-[#9CA3AF] text-center mt-4">
                        No spam. No credit card required. Unsubscribe anytime.
                    </p>
                </div>

                <p className="text-center text-sm text-[#64748B] mt-6">
                    Already have access?{' '}
                    <a href="/global-feed" className="text-[#2563EB] font-medium hover:underline">
                        Go to feed
                    </a>
                </p>
            </div>
        </div>
    );
}
