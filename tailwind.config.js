/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // сканируем все файлы в src
        "./index.html"
    ],
    theme: {
        extend: {}, // можно добавлять кастомные цвета, шрифты и т.д.
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: true,      // подключает все стандартные темы DaisyUI
        darkTheme: "dark", // тема по умолчанию для dark-mode
    },
};
