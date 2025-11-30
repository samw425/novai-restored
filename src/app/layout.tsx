import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Novai Intelligence (Live)",
  description: "Novai is a real-time AI intelligence system providing a global feed, market pulse, and risk monitoring for the AI landscape. Separate signal from noise.",
  openGraph: {
    title: "Novai OS | The AI Intelligence Terminal",
    description: "Real-time global intelligence feed for the AI era. Track models, risks, and market pulses in one terminal.",
    type: "website",
    url: "https://gonovai.vercel.app",
    images: ["https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop"],
  },
  twitter: {
    card: "summary_large_image",
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
