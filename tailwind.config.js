/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    safelist: [
        'hidden',
        'sm:table-cell',
        'sm:block',
        'md:table-cell',
        'md:block',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                success: {
                    light: '#d1fae5',
                    DEFAULT: '#10b981',
                    dark: '#047857',
                },
                danger: {
                    light: '#fee2e2',
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                },
                warning: {
                    light: '#fef3c7',
                    DEFAULT: '#f59e0b',
                    dark: '#d97706',
                },
                info: {
                    light: '#dbeafe',
                    DEFAULT: '#3b82f6',
                    dark: '#1d4ed8',
                },
            },
        },
    },
    plugins: [],
}
