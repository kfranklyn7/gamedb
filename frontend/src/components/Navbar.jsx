import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Gamepad2, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo & Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-accent-500 text-white rounded-xl group-hover:bg-accent-600 transition-colors shadow-md">
                            <Gamepad2 size={24} />
                        </div>
                        <span className="font-display font-bold text-xl tracking-wide hidden sm:block">QuestLog</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/" className="text-text hover:text-accent-500 font-medium transition-colors">
                                    Home
                                </Link>
                                <Link to="/browse" className="text-text hover:text-accent-500 font-medium transition-colors">
                                    Browse
                                </Link>
                                <Link to="/my-list" className="text-text hover:text-accent-500 font-medium transition-colors">
                                    My Quests
                                </Link>
                            </>
                        ) : (
                            <Link to="/" className="text-text hover:text-accent-500 font-medium transition-colors">
                                Browse
                            </Link>
                        )}
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="w-px h-6 bg-border hidden sm:block"></div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-text-muted hidden md:block">{user?.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-text bg-surface border border-border hover:border-accent-500 hover:text-accent-500 transition-colors"
                                >
                                    <LogIn size={16} />
                                    <span className="hidden sm:inline">Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 shadow-md transition-colors"
                                >
                                    <UserPlus size={16} />
                                    <span className="hidden sm:inline">Sign Up</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
