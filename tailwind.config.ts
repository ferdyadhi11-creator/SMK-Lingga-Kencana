import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff7ff",
          100: "#dceeff",
          500: "#0b66c3",
          600: "#0758a8",
          700: "#064985",
          900: "#06284a",
        },
        accent: "#fdbb24",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(7, 73, 133, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;