import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'US Intel | Novai Intelligence',
    description: 'Real-time intelligence from CIA, FBI, NSA, DOD, DHS, and the full US Intelligence Community. Live feeds, agency dossiers, and strategic analysis.',
    openGraph: {
        title: 'US INTEL | Novai Intelligence',
        description: 'Real-time intelligence from CIA, FBI, NSA, DOD, and the full US Intelligence Community.',
        url: 'https://www.usenovai.live/us-intel',
        siteName: 'Novai Intelligence',
        images: [
            {
                url: 'https://www.usenovai.live/us-intel-header.png',
                width: 1200,
                height: 630,
                alt: 'US Intel - Novai Intelligence',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'US INTEL | Novai Intelligence',
        description: 'Real-time intelligence from CIA, FBI, NSA, DOD, and the full US Intelligence Community.',
        images: ['https://www.usenovai.live/us-intel-header.png'],
        creator: '@novai_intel',
    },
};

export default function USIntelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

