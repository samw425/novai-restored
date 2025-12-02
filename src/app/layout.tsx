import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://novaibeta.vercel.app'),
  title: "Novai Intelligence",
  description: "The central nervous system for the post-AI world. Autonomously monitoring 70+ high-signal sources to provide a God's Eye View of the technological singularity.",
  keywords: ["AI intelligence", "artificial intelligence news", "AI market", "tech intelligence", "real-time AI tracking"],
  authors: [{ name: "Novai Intelligence" }],
  openGraph: {
    title: "Novai Intelligence",
    description: "The central nervous system for the post-AI world. Autonomously monitoring 70+ high-signal sources to provide a God's Eye View of the technological singularity.",
    type: "website",
    url: "https://novaibeta.vercel.app",
    siteName: "Novai Intelligence",
  },
  twitter: {
    card: "summary_large_image",
    title: "Novai Intelligence",
    description: "The central nervous system for the post-AI world. Autonomously monitoring 70+ high-signal sources.",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
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
