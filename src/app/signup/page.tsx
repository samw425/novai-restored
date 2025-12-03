'use client';

import { useState } from 'react';
import { Mail, Sparkles, Check, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

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
                body: JSON.stringify({
                    email,
                    name: 'Daily Brief Subscriber',
                    subject: 'Daily Brief Signup',
                    message: 'New subscriber joined via /signup landing page',
                    organization: 'Individual',
                    interest: 'Daily Brief'
                })
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
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-4 relative overflow-hidden font-serif">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="max-w-md w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-12 text-center relative z-10 animate-in zoom-in-95 duration-700">
                    <div className="w-16 h-16 mx-auto mb-6 bg-slate-900 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4 tracking-tight">You're on the list.</h2>
                    <p className="text-slate-600 mb-8 text-lg leading-relaxed font-sans">
                        Welcome to the inner circle. Your first intelligence brief will arrive in your inbox tomorrow morning.
                    </p>
                    <a
                        href="/global-feed"
                        className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-slate-900 text-white rounded-lg font-sans font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Read Today's Brief
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col relative overflow-hidden">
            {/* Background Texture - Subtle Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#3b82f615,transparent)] pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Logo theme="light" />
                <a href="/global-feed" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors font-sans">
                    View Live Demo
                </a>
            </nav>

            <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Copy */}
                    <div className="space-y-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Daily Intelligence Brief
                        </div>

                        <h1 className="text-6xl md:text-7xl font-serif font-bold text-slate-900 tracking-tight leading-[1.1]">
                            The Signal You Need.<br />
                            <span className="text-slate-300 blur-[2px] select-none transition-all duration-700 hover:blur-0 hover:text-slate-400 cursor-default">
                                The Noise You Don't.
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans font-medium">
                            Join the inner circle of decision-makers who start their day with Novai. A concise, AI-curated briefing on the technological singularity.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start text-sm font-bold text-slate-500 font-sans border-t border-slate-200 pt-8 w-fit mx-auto lg:mx-0">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-slate-900" />
                                <span className="text-slate-700">No Ads</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-slate-900" />
                                <span className="text-slate-700">5-Minute Read</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-slate-900" />
                                <span className="text-slate-700">Global Coverage</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dossier Card */}
                    <div className="w-full max-w-md mx-auto lg:ml-auto">
                        <div className="bg-white rounded-xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-200 p-1 relative overflow-hidden group hover:shadow-[0_20px_50px_rgb(0,0,0,0.15)] transition-all duration-500">
                            {/* Inner Border for 'Paper' feel */}
                            <div className="border border-slate-100 rounded-lg p-8 md:p-10 h-full relative z-10 bg-white">

                                <div className="mb-8 border-b border-slate-100 pb-6">
                                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Subscribe to Briefing</h3>
                                    <p className="text-slate-500 text-sm font-medium font-sans">Secure. Concise. Essential.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-sans">
                                            Work Email
                                        </label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-slate-900 transition-colors" />
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@company.com"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium font-sans"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans group/btn relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                                        {loading ? (
                                            'Processing...'
                                        ) : (
                                            <>
                                                Subscribe Free
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest font-sans">
                                        Trusted by leaders in AI and Tech
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative 'Paper Stack' effect behind */}
                        <div className="absolute top-4 -right-4 w-full h-full bg-slate-200 rounded-xl -z-10 transform rotate-2 opacity-50" />
                    </div>
                </div>
            </main>
        </div>
    );
}
