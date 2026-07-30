/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                saffron: {
                    DEFAULT: '#FF9933',
                    light: '#FFB366',
                    dark: '#CC7A29',
                },
                maroon: {
                    DEFAULT: '#800000',
                    light: '#A52A2A',
                    dark: '#4D0000',
                },
                gold: {
                    DEFAULT: '#C5A059',
                    light: '#E5C07B',
                    dark: '#A38035',
                },
                parchment: '#F5E6D3',
            },
            fontFamily: {
                serif: ['Merriweather', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'mandala-pattern': "url('https://www.transparenttextures.com/patterns/black-scales.png')", // Placeholder texture
            }
        },
    },
    plugins: [],
}
