/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./presets/**/*.html",
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [
        require('tailwindcss-primeui'),
        require('@tailwindcss/typography'),
    ],
}
