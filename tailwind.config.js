/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/konsta/**/*.{html,js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    screens: {
      xs: "528px",
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#3060FF",
        whiteCust: "#EEF0FD",
        orangeCust: "#F87931",
        blackCust: "#222222",
        secondary: "#1F50F5",
        greenCust: "#9DD33E",
        grayCust: "#E8E8E8",
        blueCust: "#1017E2",
        cream: "#FFD2BA",
      },
    },
  },
  plugins: [],
};
