import React from 'react';
import { TrendingUp, Hash } from 'lucide-react';

export function TrendingTopics() {
    const topics = [
        { name: 'AGI', count: '+124%' },
        { name: 'Q-Star', count: '+85%' },
        { name: 'Regulation', count: '+62%' },
        { name: 'NVIDIA', count: '+45%' },
        { name: 'OpenSource', count: '+30%' },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    Trending Now
                </h3>
            </div>

            <div className="space-y-3">
                {topics.map((topic, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Hash size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                {topic.name}
                            </span>
                        </div>
                        <span className="text-xs font-mono text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                            {topic.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
