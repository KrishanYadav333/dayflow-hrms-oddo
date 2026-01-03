module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1A3B67',      // Dark Blue - headers, navbars, footers
          medium: '#265D93',    // Medium Blue - buttons, links, charts
          bright: '#1976D2',    // Bright Blue - CTAs, highlights
          900: '#1B3C69',
          700: '#265E99',
          500: '#0076BE',
        },
        accent: {
          melon: '#F26A42',     // Orange-red - icons, buttons, emphasis
          lemon: '#FBB533',     // Yellow - warnings, highlights, secondary CTAs
        },
        neutral: {
          white: '#FFFFFF',     // Backgrounds
          gray: '#CCCCCC',      // Subtle sections
        }
      }
    },
  },
  plugins: [],
}
