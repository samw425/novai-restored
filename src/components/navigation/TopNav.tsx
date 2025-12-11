'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { NovaiLogo } from '@/components/Logo';
import { SearchModal } from './SearchModal';

export function TopNav() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Global Command+K Listener
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Logo + Main Nav */}
                    <div className="flex items-center gap-12">
                        <Link href="/global-feed" className="flex items-center gap-3 group">
                            <NovaiLogo className="h-8 w-8 transition-transform group-hover:scale-105" />
                            <span className="text-xl font-bold tracking-tight text-[#14171F]">Novai</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            <NavLink href="/global-feed">Overview</NavLink>
                            <NavLink href="/deep-signals">Intelligence</NavLink>
                            <NavLink href="/market-pulse">Market</NavLink>
                            <NavLink href="/lab-tools">Library</NavLink>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-gray-500 hover:text-[#14171F] hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2"
                        >
                            <Search className="h-5 w-5" />
                            <span className="hidden lg:inline text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">⌘K</span>
                        </button>

                        <button className="p-2 text-gray-500 hover:text-[#14171F] hover:bg-gray-50 rounded-lg transition-all relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-600 rounded-full" />
                        </button>

                        <div className="h-8 w-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity" />
                    </div>
                </div>
            </nav>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#14171F] hover:bg-gray-50 rounded-lg transition-all"
        >
            {children}
        </Link>
    );
}
