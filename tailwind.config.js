/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff63c1",
        secondary: "#ff6372",
        tri: "#ef63ff",
      },
      backgroundImage: () =>
        // theme
        ({
          primegr: "linear-gradient(#ff63c1, #ff6372)",
        }),
    },
  },
  plugins: [],
};
