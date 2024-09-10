const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: colors.blue[600],
          dark: colors.blue[500],
        },
        secondary: {
          light: colors.gray[600],
          dark: colors.gray[400],
        },
        background: {
          light: colors.gray[100],
          dark: colors.gray[900],
        },
        surface: {
          light: colors.white,
          dark: colors.gray[800],
        },
        text: {
          light: colors.gray[900],
          dark: colors.gray[100],
        },
        // New color definitions
        button: {
          primary: {
            bg: colors.blue[600],
            text: colors.white,
            hover: colors.blue[700],
          },
          secondary: {
            bg: colors.gray[300],
            text: colors.gray[800],
            hover: colors.gray[400],
          },
          danger: {
            bg: colors.red[600],
            text: colors.white,
            hover: colors.red[700],
          },
        },
        input: {
          border: colors.gray[300],
          focus: colors.blue[500],
        },
        success: colors.green[500],
        warning: colors.yellow[500],
        error: colors.red[500],
      },
    },
  },
  plugins: [],
}