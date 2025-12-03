'use client';

import { useState } from 'react';
import { Lock, Sparkles, CheckCircle } from 'lucide-react';

export default function ProPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/pro-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name }),
            });

            if (response.ok) {
                setSubmitted(true);
                setEmail('');
                setName('');
            }
        } catch (error) {
            console.error('Error submitting waitlist:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-4 h-4" />
                        Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Novai Pro
                    </h1>
                    <p className="text-xl text-gray-300">
                        The ultimate intelligence suite is being built.
                    </p>
                </div>

                {/* Features List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Lock className="h-6 w-6 text-blue-400" />
                        Pro Features
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Daily Brief', desc: 'Personalized AI-curated briefings delivered every morning' },
                            { name: 'Emerging Narratives', desc: 'Track developing storylines and pattern recognition' },
                            { name: 'Advanced Filters', desc: 'Filter by source, date, sentiment, and custom parameters' },
                            { name: 'Personalized Feed', desc: 'AI learns your interests and surfaces relevant content' },
                            { name: 'AI Tools & Analysis', desc: 'Deep dive comparisons and analysis of AI tools' },
                            { name: 'Alerts & Watchlists', desc: 'Custom notifications for topics and companies' },
                            { name: 'Pro Reports', desc: 'In-depth analysis reports and trend forecasts' },
                        ].map((feature, idx) => (
                            <div key={idx} className="flex gap-3 text-gray-300">
                                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-white">{feature.name}</div>
                                    <div className="text-sm text-gray-400">{feature.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Waitlist Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                    {!submitted ? (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">Join the Waitlist</h2>
                            <p className="text-gray-400 mb-6">
                                Be the first to know when Novai Pro launches. We'll notify you with early access.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Joining...' : 'Join Pro Waitlist →'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                            <p className="text-gray-400">
                                We'll notify you when Novai Pro launches. Check your inbox for confirmation.
                            </p>
                        </div>
                    )}
                </div>

                {/* Back to Dashboard */}
                <div className="text-center mt-8">
                    <a href="/global-feed" className="text-gray-400 hover:text-white transition-colors text-sm">
                        ← Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
