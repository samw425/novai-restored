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
            <div>
                <div className="flex items-center gap-3 mb-3">
                    {icon}
                    <h1 className="text-3xl font-bold text-[#0F172A]">{title}</h1>
                </div>
                <p className="text-[#64748B] text-lg max-w-3xl">{description}</p>
            </div>

            {/* Novai Thoughts / Analyst Note */}
            {insight && (
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
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                {/* Custom Novai "N" Icon */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3V21" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M21 3V21" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M3 21L21 3" stroke="white" strokeWidth="3" strokeLinecap="round" />
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
            )}
        </div>
    );
}
