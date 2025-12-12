import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://usenovai.live'),
  title: "Novai Intelligence",
  description: "The central nervous system for the post-AI world. Autonomously monitoring 109+ high-signal sources to provide a God's Eye View of the technological singularity.",
  keywords: ["AI intelligence", "artificial intelligence news", "AI market", "tech intelligence", "real-time AI tracking"],
  authors: [{ name: "Novai Intelligence" }],
  openGraph: {
    title: "Novai Intelligence",
    description: "The central nervous system for the post-AI world. Autonomously monitoring 109+ high-signal sources to provide a God's Eye View of the technological singularity.",
    type: "website",
    url: 'https://usenovai.live',
    siteName: "Novai Intelligence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Novai Intelligence",
    description: "The central nervous system for the post-AI world. Autonomously monitoring 109+ high-signal sources.",
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#F5F6F8] text-[#0F172A] antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
