import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'feedback' | 'feature' | 'bug'>('feedback');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to a backend
        console.log({ feedbackType, message, email });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-vue-black pt-20 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <CheckCircle className="text-vue-maroon mx-auto mb-4" size={64} />
                    <h1 className="text-3xl font-bold text-white mb-2">Thank you!</h1>
                    <p className="text-white/50">Your feedback helps us improve VUE.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-vue-black pt-20 pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="py-12 border-b border-white/10 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="text-vue-maroon" size={32} />
                        <h1 className="text-4xl font-black text-white tracking-tight">Feedback</h1>
                    </div>
                    <p className="text-white/50">Help us make VUE better. Share your thoughts, report issues, or request features.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type selector */}
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-3">What type of feedback?</label>
                        <div className="flex gap-3">
                            {[
                                { key: 'feedback', label: 'General Feedback' },
                                { key: 'feature', label: 'Feature Request' },
                                { key: 'bug', label: 'Report a Bug' },
                            ].map(type => (
                                <button
                                    key={type.key}
                                    type="button"
                                    onClick={() => setFeedbackType(type.key as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${feedbackType === type.key
                                            ? 'bg-vue-maroon text-white'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            {feedbackType === 'feature' ? 'Describe the feature you\'d like to see' :
                                feedbackType === 'bug' ? 'Describe the issue' : 'Your feedback'}
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-vue-maroon/50 resize-none"
                            placeholder={
                                feedbackType === 'feature' ? 'I would love to see...' :
                                    feedbackType === 'bug' ? 'I encountered an issue when...' :
                                        'I think VUE could...'
                            }
                        />
                    </div>

                    {/* Email (optional) */}
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Email (optional)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-vue-maroon/50"
                            placeholder="your@email.com"
                        />
                        <p className="text-white/30 text-xs mt-1">We'll only use this to follow up if needed</p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-vue-maroon text-white font-bold text-lg hover:brightness-110 transition-all"
                    >
                        <Send size={20} />
                        Submit Feedback
                    </button>
                </form>
            </div>
        </main>
    );
};

export default FeedbackPage;
