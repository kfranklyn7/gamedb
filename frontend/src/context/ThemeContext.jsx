import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Read from localStorage or default
    const [mode, setMode] = useState(() => localStorage.getItem('theme-mode') || 'dark');
    const [palette, setPalette] = useState(() => localStorage.getItem('theme-palette') || 'archive');
    const [density, setDensity] = useState(() => localStorage.getItem('theme-density') || 'comfortable');
    const [corners, setCorners] = useState(() => localStorage.getItem('theme-corners') || 'sharp');
    const [effects, setEffects] = useState(() => localStorage.getItem('theme-effects') || 'on');

    // Apply classes to HTML element
    useEffect(() => {
        const root = window.document.documentElement;

        // Mode
        if (mode === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
        localStorage.setItem('theme-mode', mode);

        // Palette
        root.className = root.className.replace(/palette-\w+/g, '').trim();
        root.classList.add(`palette-${palette}`);
        localStorage.setItem('theme-palette', palette);

        // Density
        root.classList.remove('density-compact');
        if (density === 'compact') root.classList.add('density-compact');
        localStorage.setItem('theme-density', density);

        // Corners
        root.classList.remove('border-rounded');
        if (corners === 'rounded') root.classList.add('border-rounded');
        localStorage.setItem('theme-corners', corners);

        // Effects
        root.classList.remove('effects-dim', 'effects-off');
        if (effects === 'dim') root.classList.add('effects-dim');
        if (effects === 'off') root.classList.add('effects-off');
        localStorage.setItem('theme-effects', effects);

    }, [mode, palette, density, corners, effects]);

    const toggleMode = () => setMode(m => m === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{
            mode, palette, density, corners, effects,
            toggleMode, setMode, setPalette, setDensity, setCorners, setEffects
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
