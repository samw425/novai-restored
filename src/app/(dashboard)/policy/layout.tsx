import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Policy & Regulation",
    description: "AI governance, tech regulation, and policy developments shaping the future of technology.",
    openGraph: {
        title: "Policy & Regulation | Novai Intelligence",
        description: "AI governance, tech regulation, and policy developments shaping the future of technology.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
