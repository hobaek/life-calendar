import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFF8F0",
        "card-bg": "#FFFFFF",
        coral: { DEFAULT: "#F4845F", light: "#FDDDD2" },
        lavender: { DEFAULT: "#B8B8F3", light: "#E8E8FC" },
        mint: { DEFAULT: "#7EC8A0", light: "#D4F0E0" },
        "lc-text": { DEFAULT: "#3D3535", light: "#8A7E7E" },
        empty: "#F0E6DC",
        today: "#FF6B6B",
        "filled-alt": "#FFB088",
        "warm-gray": "#6B6161",
        "light-gray": "#E8E0D8",
      },
      fontFamily: {
        serif: ["Lora", "serif"],
        sans: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        button: "50px",
        cell: "2.5px",
      },
      boxShadow: {
        card: "0 2px 16px rgba(61,53,53,0.08)",
        "card-hover": "0 4px 24px rgba(61,53,53,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
