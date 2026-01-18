/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vue-black': '#000000',
        'vue-red': '#DC2626', // Blood red - primary accent
        'vue-maroon': '#DC2626', // alias
        'vue-orange': '#DC2626', // alias
        'vue-green': '#DC2626', // alias for compatibility
        'vue-blue': '#DC2626', // alias for compatibility
        'vue-gray': '#6B7280', // gray for PASS
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '-apple-system', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
