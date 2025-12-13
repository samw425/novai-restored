'use client';

import dynamic from 'next/dynamic';

const PremiumGlobe = dynamic(
    () => import('./PremiumGlobe').then((mod) => mod.PremiumGlobe),
    { ssr: false }
);

export function PremiumGlobeClient() {
    return <PremiumGlobe />;
}
