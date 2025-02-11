/** @type {import('tailwindcss').Config} */
module.exports = {
  //  content: ["./src/**/*.{js,jsx,ts,tsx}"],
   content: [
    // './pages/**/*.{js,ts,jsx,tsx}',
    //    './components/**/*.{js,ts,jsx,tsx}',
    // './src/widget/WidgetLayout/**/*.{js,ts,jsx,tsx}',
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // important: true,
  // content: [
  //   './templates/**/*.html',
  //   './static/js/**/*.js',
  //   './**/*.html',
  //   './**/*.js',
  //   "./src/**/*.{js,jsx,ts,tsx}"
  // ],
  theme: {
    screens:{
      sm:"420px" //770
     },
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
      screens: {
        xs: { max: "600px" },
      },
    },
  },
  plugins: [],
};
