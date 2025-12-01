'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { RightRail } from '@/components/navigation/RightRail';
import { BreadcrumbHeader } from '@/components/navigation/BreadcrumbHeader';
import { Footer } from '@/components/ui/Footer';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F5F6F8] flex flex-col">
            <MobileNav />
            <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 lg:py-8 flex-grow w-full">
                <div className="grid grid-cols-12 gap-8">

                    {/* Left Sidebar */}
                    <aside className="hidden lg:block col-span-3 sticky top-8 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
                        <Sidebar />
                    </aside>

                    {/* Main Content Area */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col">
                        <BreadcrumbHeader />

                        <div className="grid grid-cols-12 gap-8 flex-grow">
                            {/* Feed / Main */}
                            <main className="col-span-12 lg:col-span-8">
                                {children}
                            </main>

                            {/* Right Rail */}
                            <aside className="hidden lg:block col-span-4 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
                                <RightRail />
                            </aside>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}
