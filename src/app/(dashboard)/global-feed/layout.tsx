import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Global Feed",
    description: "Real-time curated intelligence from 100+ sources across AI, tech, defense, and markets.",
    openGraph: {
        title: "Global Feed | Novai Intelligence",
        description: "Real-time curated intelligence from 100+ sources across AI, tech, defense, and markets.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
