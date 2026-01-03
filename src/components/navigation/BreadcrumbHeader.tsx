'use client';

import { useState, useEffect, Suspense } from 'react';
import { Search, UserPlus, Heart } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SignUpModal } from '@/components/auth/SignUpModal';

function BreadcrumbHeaderInner() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentView = pathname.split('/').pop()?.replace('-', ' ') || 'Global Feed';
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Sync search query with URL params (client-side only)
    useEffect(() => {
        setSearchQuery(searchParams?.get('search') || '');
    }, [searchParams]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/global-feed?search=${encodeURIComponent(searchQuery.trim())}`);
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
                <div className="flex items-center gap-3 md:gap-4 ml-auto">
                    <Link
                        href="/support"
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
                    >
                        <Heart size={14} className="fill-blue-600" />
                        <span className="hidden sm:inline">Support</span>
                    </Link>
                </div>
            </header>
        </>
    );
}

export function BreadcrumbHeader() {
    return (
        <Suspense fallback={<div className="h-16 mb-6" />}>
            <BreadcrumbHeaderInner />
        </Suspense>
    );
}
