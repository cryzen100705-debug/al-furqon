module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F9D58",
        gold: "#D4AF37",
        dark: "#0B3D2E",
      },
      fontFamily: {
        heading: ["var(--font-cairo)"],
        body: ["var(--font-poppins)"],
        arabic: ["var(--font-amiri)"],
      },
    },
  },
  plugins: [],
};
