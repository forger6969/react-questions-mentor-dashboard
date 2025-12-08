import React, { useEffect, useState } from "react";

const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro",
    "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel",
    "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business",
    "acid", "lemonade", "night", "coffee", "winter"
];

export default function ThemeSwitcher() {
    const themeGet = JSON.parse(localStorage.getItem(`theme`)) || 'light'
    const [theme, setTheme] = useState(themeGet);


    const changeTheme = (t) => {
        setTheme(t);
        document.documentElement.setAttribute("data-theme", t);
        localStorage.setItem(`theme`, JSON.stringify(t))
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", themeGet);
    }, [])

    return (
        <div className="flex items-center gap-4">
            {/* Селект для выбора темы */}
            <select
                className="select select-bordered w-48"
                value={theme}
                onChange={(e) => changeTheme(e.target.value)}
            >
                {themes.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
        </div>
    );
}
