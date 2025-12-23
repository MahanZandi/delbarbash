/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        desktop: "0px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        desktop: "1280px",
      },
    },
    extend: {
      zIndex: {
        '60': '60',
      },
      fontFamily: {
        sans: [
          "LahzehFaNum",
          "Lahzeh",
          "sans-serif",
        ],
        lahzehFamily: ["LahzehFamily", "sans-serif"],
      },
      screens: {
        // خود breakpoint دسکتاپ تیلویند برای کلاس‌هایی مثل desktop:flex
        desktop: "1280px",

      },
      colors: {
        primary: {
          100: "#FFF5F5",
          200: "#EDE0D0",
          300: "#FDDDDF",
          350: "#CF7668",
          400: "#9A6767",
          450: "#984F53",
          500: "#A44A50",
          550: "#924335",
          600: "#C41818",
          700: "#860A0A",
          800: "#840B35",
        },
        secondary: {
          200: "#D2F8DE",
          400: "#E5F8D2",
          500: "#508F43",
          600: "#4BA100",
          800: "#3E644A",
          900: "#34954E",
        },
      },
    },
  },
  plugins: [],
}
