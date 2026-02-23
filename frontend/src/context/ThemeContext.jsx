import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Read from localStorage or default to system preference
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('theme-mode');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [palette, setPalette] = useState(() => {
        return localStorage.getItem('theme-palette') || 'indigo';
    });

    // Apply classes to HTML element when mode or palette changes
    useEffect(() => {
        const root = window.document.documentElement;

        // Handle dark/light mode
        if (mode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme-mode', mode);

        // Handle palette
        // First remove existing palette classes
        root.className = root.className.replace(/palette-\w+/g, '').trim();
        // Add new palette if not default
        if (palette !== 'indigo') {
            root.classList.add(`palette-${palette}`);
        }
        localStorage.setItem('theme-palette', palette);

    }, [mode, palette]);

    const toggleMode = () => setMode(m => m === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ mode, palette, toggleMode, setMode, setPalette }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
