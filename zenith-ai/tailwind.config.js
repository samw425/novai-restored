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
                // Zillow-inspired light theme colors
                zenith: {
                    blue: "#006AFF",
                    "blue-hover": "#0052CC",
                    "blue-light": "#E6F0FF",
                    green: "#10B981",
                    "green-light": "#D1FAE5",
                    red: "#EF4444",
                    "red-light": "#FEE2E2",
                    gold: "#F59E0B",
                    "gold-light": "#FEF3C7",
                },
                border: "var(--border)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "SF Mono", "monospace"],
            },
            boxShadow: {
                "card": "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
                "card-hover": "0 10px 40px rgba(0,0,0,0.1)",
                "card-lg": "0 20px 60px rgba(0,0,0,0.12)",
            },
            borderRadius: {
                "xl": "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
        },
    },
    plugins: [],
};
