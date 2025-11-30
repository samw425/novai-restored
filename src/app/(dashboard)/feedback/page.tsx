'use client';

import { useState } from 'react';
import { Mail, MessageSquare, User, Send, Check } from 'lucide-react';

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        topic: 'general',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Send to database or email service tomorrow
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-6">
                <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Message Sent!</h2>
                    <p className="text-[#64748B] mb-6">
                        We'll respond within 24 hours. Thank you for your feedback!
                    </p>
                    <a
                        href="/global-feed"
                        className="inline-block px-6 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors"
                    >
                        Back to Feed
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0F172A] mb-3">Contact Us</h1>
                <p className="text-[#64748B]">
                    Have feedback, questions, or suggestions? We'd love to hear from you.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">
                            Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                            <input
                                id="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your name"
                                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-[#0F172A] mb-2">
                            Topic
                        </label>
                        <select
                            id="topic"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                        >
                            <option value="general">General Feedback</option>
                            <option value="bug">Report a Bug</option>
                            <option value="feature">Feature Request</option>
                            <option value="partnership">Partnership Inquiry</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-[#0F172A] mb-2">
                            Message
                        </label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#9CA3AF]" />
                            <textarea
                                id="message"
                                required
                                rows={6}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us what's on your mind..."
                                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                    <p className="text-sm text-[#64748B] text-center mb-3">Or reach us directly:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <a href="mailto:hello@gonovai.com" className="text-[#2563EB] hover:underline">
                            hello@gonovai.com
                        </a>
                        <span className="text-[#E5E7EB]">|</span>
                        <a href="https://twitter.com/gonovai" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">
                            @gonovai
                        </a>
                    </div>
                    <p className="text-xs text-[#9CA3AF] text-center mt-4">
                        We typically respond within 24 hours
                    </p>
                </div>
            </div>
        </div>
    );
}
