import { NovaiLogo } from '@/components/Logo';

interface PageHeaderProps {
    title: string;
    description: string;
    insight?: React.ReactNode;
    icon?: React.ReactNode;
}

export function PageHeader({ title, description, insight, icon }: PageHeaderProps) {
    return (
        <div className="relative pt-8 pb-8 md:pt-12 md:pb-10">
            <div className="space-y-6 max-w-4xl">

                {/* Badge / Icon Row */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {icon && <span className="flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3 text-slate-500">{icon}</span>}
                    <span>Sector Intelligence</span>
                </div>

                {/* Live Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 tracking-wider">REAL-TIME INTEL</span>
                </div>
            </div>

            {/* Title (Massive Typography) */}
            <h1 className="text-5xl md:text-7xl font-sans font-extrabold text-slate-900 tracking-tighter leading-[0.9]">
                {title}
            </h1>

            {/* Description */}
            <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed font-sans tracking-tight">
                {description}
            </p>

            {/* Insight (Analyst Note - Blue Card Style) */}
            {insight && (
                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-3xl">
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 mt-0.5">
                            <NovaiLogo className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                Novai Analyst Note
                            </span>
                            <div className="text-sm text-slate-800 font-medium leading-relaxed">
                                {insight}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
