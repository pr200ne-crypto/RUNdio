/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0F172A", // 深いネイビー
          foreground: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#F97316", // エナジー系オレンジ
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#14B8A6", // ティール
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
