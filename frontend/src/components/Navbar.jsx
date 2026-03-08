import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Gamepad2, LogOut, LogIn, UserPlus, Settings, X, Sun, Moon, Zap, Layout, CornerUpLeft } from 'lucide-react';

const Navbar = () => {
    const { logout, isAuthenticated } = useAuth();
    const {
        mode, toggleMode, palette, setPalette,
        density, setDensity, corners, setCorners,
        effects, setEffects
    } = useTheme();
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const palettes = [
        { id: 'terminal', name: 'Terminal (Green)', color: '#22c55e' },
        { id: 'hacker', name: 'Hacker (Cyan)', color: '#06b6d4' },
        { id: 'retro', name: 'Retro (Amber)', color: '#f59e0b' },
        { id: 'archive', name: 'Archive (Indigo)', color: '#6366f1' },
        { id: 'rose', name: 'Rose (Pink)', color: '#f43f5e' },
        { id: 'crimson', name: 'Crimson (Blood)', color: '#dc2626' },
        { id: 'neon', name: 'Neon (Magenta)', color: '#d946ef' },
        { id: 'void', name: 'Void (Purple)', color: '#8b5cf6' },
        { id: 'slayer', name: 'Slayer (Red)', color: '#e11d48' },
        { id: 'ocean', name: 'Ocean (Blue)', color: '#3b82f6' },
        { id: 'forest', name: 'Forest (Emerald)', color: '#10b981' },
        { id: 'sunset', name: 'Sunset (Orange)', color: '#f97316' },
        { id: 'ghost', name: 'Ghost (Slate)', color: '#64748b' }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border transition-all duration-300 nav-container shadow-retro">
            <div className="max-w-[2000px] mx-auto px-4 density-pad">
                <div className="flex justify-between items-center h-full">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-accent-500 text-white rounded-dynamic group-hover:bg-accent-600 transition-colors shadow-retro">
                            <Gamepad2 size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-display font-bold tracking-tight text-text group-hover:text-accent-500 transition-colors">
                                QUESTLOG
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-text hover:text-accent-500 font-medium transition-colors">
                            {'>'} HOME
                        </Link>
                        <Link to="/browse" className="text-text hover:text-accent-500 font-medium transition-colors">
                            {'>'} BROWSE
                        </Link>
                        <Link to="/community" className="text-text hover:text-accent-500 font-medium transition-colors">
                            {'>'} COMMUNITY
                        </Link>
                        {isAuthenticated && (
                            <Link to="/my-list" className="text-text hover:text-accent-500 font-medium transition-colors">
                                {'>'} JOURNAL
                            </Link>
                        )}
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleMode}
                            aria-label="Toggle Theme"
                            className="p-2 hover:bg-accent-50 text-text-muted hover:text-accent-500 transition-colors rounded-dynamic"
                        >
                            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            aria-label="Settings"
                            className="p-2 hover:bg-accent-50 text-text-muted hover:text-accent-500 transition-colors rounded-dynamic"
                        >
                            <Settings size={20} />
                        </button>

                        <div className="w-px h-6 bg-border hidden sm:block"></div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-2 rounded-dynamic-btn text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">LOGOUT</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-3 py-2 rounded-dynamic-btn text-sm font-medium text-text bg-surface border border-border hover:border-accent-500 hover:text-accent-500 transition-colors"
                                >
                                    LOGIN
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-2 rounded-dynamic-btn text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 shadow-retro transition-colors"
                                >
                                    SIGN UP
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="bg-surface border-2 border-accent-500 rounded-dynamic shadow-2xl w-full max-w-lg md:max-w-xl animate-scale-in flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="p-4 bg-accent-500 text-white flex justify-between items-center shrink-0">
                            <h2 className="font-display font-bold text-lg flex items-center gap-2">
                                <Settings size={20} /> UI_SYSTEM // CONFIG
                            </h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                            {/* Palette */}
                            <section>
                                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap size={14} /> Color Palette
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {palettes.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setPalette(p.id)}
                                            className={`flex items-center gap-3 p-3 rounded-dynamic-btn border-2 transition-all ${palette === p.id
                                                ? 'border-accent-500 bg-accent-50'
                                                : 'border-border hover:border-accent-300'
                                                }`}
                                        >
                                            <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: p.color }}></div>
                                            <span className="text-sm font-medium">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Corners */}
                                <section>
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CornerUpLeft size={14} /> Corners
                                    </h3>
                                    <div className="flex bg-background p-1 rounded-dynamic-btn border border-border">
                                        <button
                                            onClick={() => setCorners('sharp')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-dynamic-btn transition-all ${corners === 'sharp' ? 'bg-accent-500 text-white shadow-md' : 'text-text-muted hover:text-text'
                                                }`}
                                        >
                                            SHARP
                                        </button>
                                        <button
                                            onClick={() => setCorners('rounded')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-dynamic-btn transition-all ${corners === 'rounded' ? 'bg-accent-500 text-white shadow-md' : 'text-text-muted hover:text-text'
                                                }`}
                                        >
                                            ROUND
                                        </button>
                                    </div>
                                </section>

                                {/* Density */}
                                <section>
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Layout size={14} /> Density
                                    </h3>
                                    <div className="flex bg-background p-1 rounded-dynamic-btn border border-border">
                                        <button
                                            onClick={() => setDensity('comfortable')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-dynamic-btn transition-all ${density === 'comfortable' ? 'bg-accent-500 text-white shadow-md' : 'text-text-muted hover:text-text'
                                                }`}
                                        >
                                            COMFORT
                                        </button>
                                        <button
                                            onClick={() => setDensity('compact')}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-dynamic-btn transition-all ${density === 'compact' ? 'bg-accent-500 text-white shadow-md' : 'text-text-muted hover:text-text'
                                                }`}
                                        >
                                            COMPACT
                                        </button>
                                    </div>
                                </section>
                            </div>

                            {/* Effects */}
                            <section>
                                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Visual Effects</h3>
                                <div className="flex bg-background p-1 rounded-dynamic-btn border border-border">
                                    {['on', 'dim', 'off'].map(eff => (
                                        <button
                                            key={eff}
                                            onClick={() => setEffects(eff)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-dynamic-btn transition-all uppercase ${effects === eff ? 'bg-accent-500 text-white shadow-md' : 'text-text-muted hover:text-text'
                                                }`}
                                        >
                                            {eff}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="p-4 bg-background border-t border-border flex justify-end shrink-0">
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="px-6 py-2 bg-accent-500 text-white font-bold rounded-dynamic-btn hover:bg-accent-600 transition-all shadow-retro"
                            >
                                CLOSE // SAVE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
