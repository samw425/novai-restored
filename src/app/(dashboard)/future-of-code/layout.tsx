import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Future of Code",
    description: "The cutting edge of software engineering, developer tools, and programming innovation.",
    openGraph: {
        title: "Future of Code | Novai Intelligence",
        description: "The cutting edge of software engineering, developer tools, and programming innovation.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
