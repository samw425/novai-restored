'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { RightRail } from '@/components/navigation/RightRail';
import { BreadcrumbHeader } from '@/components/navigation/BreadcrumbHeader';
import { Footer } from '@/components/ui/Footer';

import { NewsTicker } from '@/components/ui/NewsTicker';

import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isEarningsPage = pathname === '/earnings';
    const isFullWidthPage = ['/war-room', '/us-intel', '/earnings'].includes(pathname);

    return (
        <div className="min-h-screen bg-[#F5F6F8] flex flex-col pt-10">
            <NewsTicker />
            <MobileNav />
            <div className={`max-w-[1600px] mx-auto flex-grow w-full ${isEarningsPage ? 'p-0' : 'px-4 lg:px-6 py-4 lg:py-8'}`}>
                <div className="grid grid-cols-12 gap-8">

                    {/* Left Sidebar */}
                    <aside className="hidden lg:block col-span-3 sticky top-8 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
                        <Sidebar />
                    </aside>

                    {/* Main Content Area */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col min-h-[calc(100vh-4rem)]">
                        <BreadcrumbHeader />

                        <div className="grid grid-cols-12 gap-8 flex-1">
                            {/* Feed / Main */}
                            <main className={`col-span-12 ${isFullWidthPage ? '' : 'lg:col-span-8'}`}>
                                {children}
                            </main>

                            {/* Right Rail */}
                            {!isFullWidthPage && (
                                <aside className="hidden lg:block col-span-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
                                    <RightRail />
                                </aside>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}
