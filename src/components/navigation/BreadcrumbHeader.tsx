import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SignUpModal } from '@/components/auth/SignUpModal';

export function BreadcrumbHeader() {
    const pathname = usePathname();
    const currentView = pathname.split('/').pop()?.replace('-', ' ') || 'Global Feed';
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    return (
        <>
            <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
            <header className="sticky top-0 z-20 bg-[#F5F6F8]/95 backdrop-blur-md border-b border-gray-200/50 px-0 py-3 flex items-center justify-between mb-6">
                {/* Breadcrumb / Status */}
                <div className="flex items-center text-sm font-medium text-gray-400 select-none">
                    Novai OS <span className="text-blue-600 text-xs bg-blue-50 px-1.5 py-0.5 rounded ml-2 border border-blue-100">Live</span> <span className="mx-2 text-gray-300">/</span> <span className="text-[#0F172A] capitalize">{currentView}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 md:gap-4 ml-auto lg:ml-0">
                    <button
                        onClick={() => setIsSignUpOpen(true)}
                        className="flex items-center gap-2 bg-[#0F172A] hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                        <UserPlus className="h-3 w-3" />
                        GET DAILY BRIEFS
                    </button>

                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search Intelligence..."
                            className="bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs w-48 lg:w-64 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>
        </>
    );
}
