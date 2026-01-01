import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'War Room | Novai Intelligence',
    description: 'Real-time global conflict monitoring and tactical intelligence streams.',
    openGraph: {
        title: 'War Room | Novai Intelligence',
        description: 'Real-time global conflict monitoring and tactical intelligence streams.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'War Room | Novai Intelligence',
        description: 'Real-time global conflict monitoring and tactical intelligence streams.',
    },
};

export default function WarRoomLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
