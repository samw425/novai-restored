/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'background': '#0a0a0f',
                'surface': '#12121a',
                'accent': '#FF4500', // STELAR signature orange-red
                'signal-purple': '#a855f7',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient-xy': 'gradient-xy 15s infinite',
                'slide-up': 'slide-up 0.5s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
            },
            keyframes: {
                'gradient-xy': {
                    '0%, 100%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                },
                'slide-up': {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
