import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://novaibeta.vercel.app'),
  title: "Novai Intelligence",
  description: "Real-time AI intelligence platform. Track global AI developments, market activity, and emerging signals. Powered by 70+ sources.",
  keywords: ["AI intelligence", "artificial intelligence news", "AI market", "tech intelligence", "real-time AI tracking"],
  authors: [{ name: "Novai Intelligence" }],
  openGraph: {
    title: "Novai Intelligence",
    description: "Real-time AI intelligence platform. Track global AI developments, market activity, and emerging signals from 70+ sources.",
    type: "website",
    url: "https://novaibeta.vercel.app",
    siteName: "Novai Intelligence",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Novai Intelligence - Real-time AI Intelligence Platform"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Novai Intelligence",
    description: "Real-time AI intelligence platform. Track global AI developments, market activity, and emerging signals.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5F6F8] text-[#0F172A] antialiased`}>
        {children}
      </body>
    </html>
  );
}
