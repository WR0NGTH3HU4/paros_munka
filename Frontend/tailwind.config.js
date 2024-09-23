/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./Assets/**/*.html",
    "./Assets/**/*.js",
    "./Controllers/**/*.js",
    "./Views/**/*.html",
    "./index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
