module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#001529",
        secondary: "#40A9FF"
      },
      fontFamily: {
        bitter: 'Bitter'
      },
      maxHeight: {
        mainContent: 'calc(100vh - 95px)'
      }
    },
  },
  plugins: [],
}
