import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://usenovai.live'),
  title: {
    default: "Novai Intelligence | Real-Time AI, Defense & Market Intelligence",
    template: "%s | Novai Intelligence"
  },
  description: "The central nervous system for the post-AI world. Real-time intelligence from CIA, FBI, NSA, DOD. AI news, antitrust tracking, earnings data, and War Room feeds from 109+ sources.",
  keywords: [
    "AI intelligence", "artificial intelligence news", "real-time AI tracking",
    "US intelligence news", "CIA news", "FBI updates", "NSA intelligence",
    "DOD news", "defense technology", "antitrust tracker", "Big Tech lawsuits",
    "DOJ antitrust", "FTC cases", "AI market intelligence", "tech earnings",
    "war room", "geopolitical intelligence", "OSINT", "open source intelligence",
    "robotics news", "AI policy", "cybersecurity news"
  ],
  authors: [{ name: "Novai Intelligence" }],
  creator: "Novai Intelligence",
  publisher: "Novai Intelligence",
  openGraph: {
    title: "Novai Intelligence | Real-Time AI & Defense Intelligence",
    description: "The central nervous system for the post-AI world. Real-time feeds from US Intelligence agencies, AI labs, and global markets.",
    type: "website",
    url: 'https://usenovai.live',
    siteName: "Novai Intelligence",
    locale: "en_US",
    images: [
      {
        url: 'https://usenovai.live/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Novai Intelligence - Global Intelligence For the AI Era',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Novai Intelligence",
    description: "Real-time intelligence from 109+ sources. AI news, US Intel, War Room, Antitrust tracking.",
    creator: "@NovaiIntel",
    images: ['https://usenovai.live/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  verification: {
    // Add these when you set up Search Console
    // google: 'verification-code',
  },
};

// JSON-LD Structured Data for rich search results
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://usenovai.live/#website',
      url: 'https://usenovai.live',
      name: 'Novai Intelligence',
      description: 'Real-time AI, defense, and market intelligence platform',
      publisher: {
        '@id': 'https://usenovai.live/#organization'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://usenovai.live/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      '@id': 'https://usenovai.live/#organization',
      name: 'Novai Intelligence',
      url: 'https://usenovai.live',
      logo: {
        '@type': 'ImageObject',
        url: 'https://usenovai.live/logo.png'
      },
      sameAs: [
        // Add social links when created
        // 'https://twitter.com/NovaiIntel',
        // 'https://linkedin.com/company/novai-intelligence'
      ]
    },
    {
      '@type': 'WebPage',
      '@id': 'https://usenovai.live/#webpage',
      url: 'https://usenovai.live',
      name: 'Novai Intelligence - Real-Time AI & Intelligence Dashboard',
      isPartOf: {
        '@id': 'https://usenovai.live/#website'
      },
      about: {
        '@id': 'https://usenovai.live/#organization'
      },
      description: 'Monitor 109+ high-signal sources for AI news, US Intelligence updates, antitrust cases, military developments, and market signals in real-time.'
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#F5F6F8] text-[#0F172A] antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
