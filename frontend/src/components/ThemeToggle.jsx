import React from 'react';
import { Palette, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { mode, toggleMode, palette, setPalette } = useTheme();

    const palettes = ['indigo', 'emerald', 'rose', 'amber', 'cyan', 'violet'];

    return (
        <div className="flex items-center gap-2">
            <div className="flex bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                {palettes.map((p) => (
                    <button
                        key={p}
                        onClick={() => setPalette(p)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-all palette-${p} bg-accent-500 ${palette === p ? 'text-white shadow-inner scale-100 opacity-100' : 'opacity-60 hover:opacity-100 scale-90 hover:scale-100'
                            }`}
                        title={`Theme: ${p}`}
                    >
                        {palette === p && <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>}
                    </button>
                ))}
            </div>
            <button
                onClick={toggleMode}
                className="p-2 bg-surface border border-border rounded-lg text-text-muted hover:text-accent-500 hover:border-accent-500 transition-colors shadow-sm"
                title="Toggle Dark/Light Mode"
            >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    );
};

export default ThemeToggle;
