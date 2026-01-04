import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Robotics Intelligence",
    description: "Tracking advances in robotics, automation, and human-machine integration.",
    openGraph: {
        title: "Robotics Intelligence | Novai Intelligence",
        description: "Tracking advances in robotics, automation, and human-machine integration.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
