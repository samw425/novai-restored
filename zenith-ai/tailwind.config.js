/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                zenith: {
                    black: "#0A0A0B", // Main background
                    panel: "#121214", // Card background
                    border: "#27272A", // Subtle borders
                    red: "#FF3333", // Motivation signal (Foreclosure)
                    orange: "#FF9933", // Motivation signal (Absentee)
                    green: "#00FF99", // FSBO / Active
                    accent: "#FFFFFF", // Primary text
                    muted: "#A1A1AA", // Secondary text
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "monospace"],
            },
        },
    },
    plugins: [],
};
