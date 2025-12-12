'use client';

import { useState } from 'react';
import { Mail, Sparkles, Check, ArrowRight, Shield, Zap, Globe, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    organization: 'Individual'
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
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 relative overflow-hidden font-serif">
                {/* Rich Paper Texture */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />

                <div className="max-w-md w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-200 p-12 text-center relative z-10 animate-in zoom-in-95 duration-700">
                    <div className="w-16 h-16 mx-auto mb-6 bg-stone-900 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Welcome, {name.split(' ')[0] || 'Leader'}.</h2>
                    <p className="text-stone-600 mb-8 text-lg leading-relaxed font-sans">
                        You're on the list. We'll notify you when early access opens—you'll be among the first to experience Novai Pro.
                    </p>
                    <a
                        href="/global-feed"
                        className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-stone-900 text-white rounded-lg font-sans font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Read Today's Brief
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col relative overflow-hidden">
            {/* Background Texture - Cream Paper for Richness */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Logo theme="light" />
                <a href="/global-feed" className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors font-sans">
                    View Live Demo
                </a>
            </nav>

            <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Copy */}
                    <div className="space-y-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Invitation Only — Limited Access
                        </div>

                        <h1 className="text-6xl md:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-[1.1]">
                            The Signal You Need.<br />
                            <span className="text-stone-300 blur-[2px] select-none transition-all duration-700 hover:blur-0 hover:text-stone-400 cursor-default">
                                The Noise You Don't.
                            </span>
                        </h1>

                        <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
                            <p className="text-xl text-stone-600 leading-relaxed font-sans font-medium">
                                <strong className="text-stone-900">This is not a newsletter.</strong> It's a next-generation intelligence briefing system designed for decision-makers shaping the future of technology.
                            </p>

                            <p className="text-lg text-stone-500 leading-relaxed font-sans">
                                As artificial intelligence reshapes global power structures, information asymmetry becomes the defining advantage. Novai exists to eliminate that gap for those building the future.
                            </p>

                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 space-y-4">
                                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-sans">Early Access Includes:</h3>
                                <ul className="space-y-3 text-sm text-stone-700 font-sans">
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 mt-0.5">→</span>
                                        <span><strong>Pre-launch access</strong> to intelligence infrastructure before public release</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 mt-0.5">→</span>
                                        <span><strong>Founding member status</strong> with permanent platform benefits</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 mt-0.5">→</span>
                                        <span><strong>Direct influence</strong> on feature development and intelligence priorities</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 mt-0.5">→</span>
                                        <span><strong>Exclusive briefings</strong> on AI developments, geopolitics, and emerging technology</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start text-sm font-bold text-stone-500 font-sans border-t border-stone-200 pt-8 w-fit mx-auto lg:mx-0">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-stone-900" />
                                <span className="text-stone-700">No Ads</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-stone-900" />
                                <span className="text-stone-700">AI-Synthesized</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-stone-900" />
                                <span className="text-stone-700">Global Coverage</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dossier Card */}
                    <div className="w-full max-w-md mx-auto lg:ml-auto">
                        <div className="bg-white rounded-xl shadow-[0_20px_60px_rgb(0,0,0,0.12)] border border-stone-200 p-1 relative overflow-hidden group hover:shadow-[0_20px_60px_rgb(0,0,0,0.18)] transition-all duration-500">
                            {/* Inner Border for 'Paper' feel */}
                            <div className="border border-stone-100 rounded-lg p-8 md:p-10 h-full relative z-10 bg-white">

                                <div className="mb-8 border-b border-stone-100 pb-6">
                                    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Join the Waitlist</h3>
                                    <p className="text-stone-500 text-sm font-medium font-sans">Request early access. Limited invitations.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 font-sans">
                                            Full Name
                                        </label>
                                        <div className="relative group/input">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within/input:text-stone-900 transition-colors" />
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all font-medium font-sans"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 font-sans">
                                            Work Email
                                        </label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within/input:text-stone-900 transition-colors" />
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@company.com"
                                                className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all font-medium font-sans"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans group/btn relative overflow-hidden mt-2"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                                        {loading ? (
                                            'Processing...'
                                        ) : (
                                            <>
                                                Join Waitlist
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest font-sans">
                                        Trusted by leaders in AI and Tech
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative 'Paper Stack' effect behind */}
                        <div className="absolute top-4 -right-4 w-full h-full bg-stone-200 rounded-xl -z-10 transform rotate-2 opacity-50" />
                    </div>
                </div>
            </main>
        </div>
    );
}
