import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description: string;
    insight?: React.ReactNode;
    icon?: React.ReactNode;
}

export function PageHeader({ title, description, insight, icon }: PageHeaderProps) {
    return (
        <div className="mb-8 space-y-6">
            {/* Title & Description */}
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        {icon}
                        <h1 className="text-3xl font-bold text-[#0F172A]">{title}</h1>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 tracking-wider">REAL-TIME INTEL</span>
                    </div>
                </div>
                <p className="text-[#64748B] text-lg max-w-3xl">{description}</p>
            </div>

            {/* Novai Thoughts / Analyst Note */}
            {
                insight && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-600" />
                                <path d="M21 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-600" />
                                <path d="M3 21L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-600" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 3L5 8V16C5 23.5 10.5 30.5 18 34C25.5 30.5 31 23.5 31 16V8L18 3Z" fill="#2563EB" />
                                        <circle cx="28" cy="8" r="3" fill="#EF4444" className="animate-pulse" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">Novai Intelligence</h3>
                                <div className="text-blue-800 leading-relaxed font-medium">
                                    {insight}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
