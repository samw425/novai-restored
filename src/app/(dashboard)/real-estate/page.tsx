'use client';

import { Building2, Home, Building } from 'lucide-react';
import { useState, Suspense } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FeedContainer } from '@/components/feed/FeedContainer';

export default function RealEstatePage() {
    const [activeTab, setActiveTab] = useState<'real-estate-residential' | 'real-estate-commercial'>('real-estate-residential');

    return (
        <div className="space-y-6">
            <PageHeader
                title="Real Estate Intelligence"
                description="Comprehensive coverage of residential and commercial real estate markets. Track housing trends, mortgage rates, commercial property deals, and REIT performance."
                insight="Real estate remains a fundamental driver of wealth and economic activity. Understanding market dynamics across residential and commercial sectors provides critical insight into broader economic health and investment opportunities."
                icon={<Building2 className="w-8 h-8 text-emerald-500" />}
            />

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 sticky top-16 z-20 bg-white/80 backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('real-estate-residential')}
                    className={`px-6 py-4 font-mono text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'real-estate-residential'
                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30'
                        : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Home size={16} />
                    RESIDENTIAL
                </button>
                <button
                    onClick={() => setActiveTab('real-estate-commercial')}
                    className={`px-6 py-4 font-mono text-xs md:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'real-estate-commercial'
                        ? 'border-blue-500 text-blue-600 bg-blue-50/30'
                        : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Building size={16} />
                    COMMERCIAL
                </button>
            </div>

            {/* Context Info */}
            <div className="px-4">
                {activeTab === 'real-estate-residential' ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-emerald-800 mb-1">Residential Market Coverage</h3>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                            Aggregating data on housing prices, mortgage rates, homebuilder sentiment, and national inventory levels from over 30 vetted sources including NAR, HUD, HousingWire, and major financial research departments.
                        </p>
                    </div>
                ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-bold text-blue-800 mb-1">Commercial Real Estate (CRE) Coverage</h3>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Institutional-grade intelligence on multi-family, office, industrial, and retail assets. Monitoring REIT performance, deal flow, and cap rate shifts via CoStar, CBRE, Real Capital Analytics, and leading CRE publications.
                        </p>
                    </div>
                )}
            </div>

            {/* Feed Section */}
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <Building2 className="w-12 h-12 text-gray-200 mb-4" />
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Hydrating Neural Feed...</p>
                </div>
            }>
                <FeedContainer
                    forcedCategory={activeTab}
                    showTicker={false}
                    key={activeTab} // Use key to force a clean remount when switching tabs
                />
            </Suspense>
        </div>
    );
}
