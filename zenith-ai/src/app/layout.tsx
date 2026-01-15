import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // Use standardized fonts
import "./globals.css";
import "leaflet/dist/leaflet.css"; // Global Map Styles

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Define variable for Tailwind
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "ZENITH | THE OFF-MARKET ENGINE",
  description: "Direct-to-owner real estate intelligence. Access unlisted properties, pre-foreclosures, and motivated sellers with live data feeds.",
};

// Static Export Mode

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-zenith-black text-zenith-accent h-screen w-screen overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
