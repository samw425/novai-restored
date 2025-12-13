import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['rss-parser'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion', '@supabase/supabase-js']
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;
