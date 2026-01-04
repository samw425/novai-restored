import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Research Intelligence",
    description: "Direct feeds from leading AI research labs and academic institutions.",
    openGraph: {
        title: "Research Intelligence | Novai Intelligence",
        description: "Direct feeds from leading AI research labs and academic institutions.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
