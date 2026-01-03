import { useState } from 'react';
import { Search, UserPlus, Heart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { SignUpModal } from '@/components/auth/SignUpModal';

export function BreadcrumbHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const currentView = pathname.split('/').pop()?.replace('-', ' ') || 'Global Feed';
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/global-feed?search=${encodeURIComponent(searchQuery)}`);
        }
    };

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
                    <a
                        href="https://buy.stripe.com/fZu00ia5a6VefeKcBp3Nm01"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors mr-2 px-2 py-1 rounded-md hover:bg-emerald-50"
                    >
                        <Heart size={14} className="fill-emerald-600" />
                        <span className="hidden sm:inline">Support</span>
                    </a>
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search Intelligence..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs w-48 lg:w-64 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>
        </>
    );
}
