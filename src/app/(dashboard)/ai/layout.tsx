import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Intelligence",
    description: "Breaking news and analysis from the frontier of artificial intelligence research and deployment.",
    openGraph: {
        title: "AI Intelligence | Novai Intelligence",
        description: "Breaking news and analysis from the frontier of artificial intelligence research and deployment.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
