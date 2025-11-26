/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

const colors = {
  primary: {
    50: "#f6f5fd",
    100: "#efedfa",
    200: "#e1ddf7",
    300: "#cbc1f1",
    400: "#b19ee7",
    500: "#9676dc",
    600: "#7f50cc",
    700: "#7546bb",
    800: "#623a9d",
    900: "#513181",
    950: "#331e57",
  },
  secondary: {
    50: "#f6f6f6",
    100: "#e7e7e7",
    200: "#d1d1d1",
    300: "#b0b0b0",
    400: "#888888",
    500: "#6d6d6d",
    600: "#5c5c5c",
    700: "#4f4f4f",
    800: "#454545",
    900: "#3d3d3d",
    950: "#262626",
  },
  danger: {
    50: "#fef2f2",
    100: "#fde3e3",
    200: "#fccccc",
    300: "#f8a9a9",
    400: "#f27777",
    500: "#e84b4b",
    600: "#d42e2e",
    700: "#b52323",
    800: "#942020",
    900: "#7b2121",
    950: "#430c0c",
  },
  warning: {
    50: "#fafcea",
    100: "#f1f8c9",
    200: "#e7f296",
    300: "#deea5a",
    400: "#dae22d",
    500: "#d6d620",
    600: "#b5a919",
    700: "#917d17",
    800: "#79631a",
    900: "#67521c",
    950: "#3c2d0c",
  },
  info: {
    50: "#eefdfd",
    100: "#d5f7f8",
    200: "#b0edf1",
    300: "#79dfe7",
    400: "#3bc8d5",
    500: "#23bfd0",
    600: "#1d8a9d",
    700: "#1e7080",
    800: "#215b69",
    900: "#1f4d5a",
    950: "#0f323d",
  },
  success: {
    50: "#f3f9ec",
    100: "#e4f2d5",
    200: "#c9e7af",
    300: "#a7d680",
    400: "#87c358",
    500: "#6cac3c",
    600: "#50852b",
    700: "#3f6625",
    800: "#355222",
    900: "#2e4621",
    950: "#16260d",
  },
  "dark": "#1f232f",
  "light": "#f5f6f7",
};

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  safelist: [
    { pattern: /grid-cols-\d+/ }, // Permite qualquer classe grid-cols-{N}
  ],
  theme: {
    extend: {
      colors: { ...colors },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'fade-slide-in-left': 'fadeSlideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'fade-slide-in-top': 'fadeSlideInTop 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        slideInLeft: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },

        fadeSlideInLeft: {
          '0%': {
            transform: 'translateX(-80px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },

        fadeSlideInTop: {
          '0%': {
            transform: 'translateY(-80px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({


        ".container":{
          "@apply sm:px-1 md:px-24 lg:px-32":{}
        },


        ".shadow-base":{
          "@apply hover:shadow-md hover:shadow-slate-600 dark:hover:shadow-black":{}
        },

        // BUTTONS
        // - base
        ".button-only-icon": {
          "@apply h-10 w-10 flex justify-center items-center p-2 font-bold shadow-base dark:hover:shadow-black rounded-md text-gray-700 transition-all border-none cursor-pointer focus:ring-2 active:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed":
            {},
        },

        ".button": {
          "@apply px-5 py-1 flex justify-center items-center font-semibold text-gray-700 transition-all shadow-base dark:hover:shadow-black dark:text-white dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-[#1f232f] border-none rounded-md cursor-pointer  focus:ring-2 active:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed":
            {},
        },


        // - colors
        ".button-primary": {
          "@apply bg-primary-600 hover:bg-primary-700 dark:hover:bg-primary-700 text-white focus:ring-primary-400":
            {},
        },
        ".button-secondary": {
          "@apply bg-secondary-500 hover:bg-secondary-700 dark:hover:bg-secondary-700 text-white focus:ring-secondary-400":
            {},
        },
        ".button-success": {
          "@apply bg-success-500 hover:bg-success-700 dark:hover:bg-success-700 text-white focus:ring-success-400":
            {},
        },
        ".button-danger": {
          "@apply bg-danger-500 hover:bg-danger-700 dark:hover:bg-danger-700 text-white focus:ring-danger-400":
            {},
        },
        ".button-warning": {
          "@apply bg-warning-500 hover:bg-warning-700 dark:hover:bg-warning-700 text-white focus:ring-warning-400":
            {},
        },
        ".button-info": {
          "@apply bg-info-500 hover:bg-info-700 dark:hover:bg-info-700 text-white focus:ring-info-400":
            {},
        },
        ".button-white": {
          "@apply bg-white hover:bg-slate-100 text-secondary-500 focus:ring-secondary-400 dark:text-gray-500":
            {},
        },
        ".button-black": {
          "@apply bg-black hover:bg-slate-900 text-secondary-200 focus:ring-secondary-800":
            {},
        },

        // - color-soft
        ".button-soft-primary": {
          "@apply bg-primary-200 dark:bg-primary-400 hover:bg-primary-700 dark:hover:bg-primary-700 text-primary-800 dark:text-primary-800 hover:text-white focus:ring-primary-400":
            {},
        },
        ".button-soft-secondary": {
          "@apply bg-secondary-200 dark:bg-secondary-400 hover:bg-secondary-700 dark:hover:bg-secondary-700 text-secondary-800 dark:text-secondary-800 hover:text-white focus:ring-secondary-400":
            {},
        },
        ".button-soft-success": {
          "@apply bg-success-200 dark:bg-success-400 hover:bg-success-700 dark:hover:bg-success-700 text-success-800 dark:text-success-800 hover:text-white focus:ring-success-400":
            {},
        },
        ".button-soft-danger": {
          "@apply bg-danger-200 dark:bg-danger-400 hover:bg-danger-700 dark:hover:bg-danger-700 text-danger-800 dark:text-danger-800 hover:text-white focus:ring-danger-400":
            {},
        },
        ".button-soft-warning": {
          "@apply bg-warning-200 dark:bg-warning-400 hover:bg-warning-700 dark:hover:bg-warning-700 text-warning-800 dark:text-warning-800 hover:text-white focus:ring-warning-400":
            {},
        },
        ".button-soft-info": {
          "@apply bg-info-200 dark:bg-info-400 hover:bg-info-700 dark:hover:bg-info-700 text-info-800 dark:text-info-800 hover:text-white focus:ring-info-400":
            {},
        },
        ".button-soft-white": {
          "@apply bg-slate-100 hover:bg-slate-50 dark:hover:bg-white text-secondary-500 focus:ring-secondary-400 dark:text-gray-500":
            {},
        },
        ".button-soft-black": {
          "@apply bg-slate-600 hover:bg-slate-800 text-secondary-200 focus:ring-secondary-800":
            {},
        },


        // -sizes
        ".button-xs": { "@apply text-xs p-1": {} },
        ".button-sm": { "@apply text-sm p-2": {} },
        ".button-lg": { "@apply text-lg p-3": {} },
        ".button-xl": { "@apply text-xl p-4": {} },
        ".button-2xl": { "@apply text-2xl p-6": {} },

        ".button-icon-xs": { "@apply w-8 h-8 text-xs p-1": {} },
        ".button-icon-sm": { "@apply w-9 h-9 text-xs p-1": {} },
        ".button-icon-lg": { "@apply w-12 h-12 text-xs p-0": {} },
        ".button-icon-xl": { "@apply w-16 h-16 text-xs p-0": {} },
        ".button-icon-2xl": { "@apply w-20 h-20 text-xs p-1": {} },



      });
    }),
  ],
};
