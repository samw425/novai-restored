import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description: string;
    insight?: string;
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
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-16 h-16 text-blue-600" />
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <div className="shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">Novai Intelligence</h3>
                            <p className="text-blue-800 leading-relaxed font-medium">
                                {insight}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
