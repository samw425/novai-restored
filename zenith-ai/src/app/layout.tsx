import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Zenith | Buy & Sell Off-Market Properties",
  description: "The P2P real estate marketplace for off-market properties. Buy directly from owners, sell without agents. Save thousands on commissions.",
  openGraph: {
    title: "Zenith | Buy & Sell Off-Market Properties",
    description: "The P2P real estate marketplace for off-market properties. Buy directly from owners, skip the agent, save thousands.",
    url: "https://zenith.homes",
    siteName: "Zenith",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zenith - P2P Real Estate Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith | Buy & Sell Off-Market Properties",
    description: "The P2P real estate marketplace for off-market properties. Save thousands on agent commissions.",
    images: ["/og-image.png"],
  },
  keywords: [
    "off-market properties",
    "FSBO",
    "for sale by owner",
    "P2P real estate",
    "no agent fees",
    "direct buyer seller",
    "real estate marketplace",
    "pre-foreclosure",
    "motivated sellers",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
