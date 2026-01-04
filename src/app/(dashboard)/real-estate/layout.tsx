import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Real Estate Intelligence",
    description: "Comprehensive coverage of residential and commercial real estate markets. Track housing trends, mortgage rates, commercial property deals, and REIT performance.",
    openGraph: {
        title: "Real Estate Intelligence | Novai",
        description: "Real-time residential and commercial real estate market intelligence.",
    },
};

export default function RealEstateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
