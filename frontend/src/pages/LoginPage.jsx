import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Invalid username or password.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-sm border border-border">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-accent-100 text-accent-600 rounded-xl mb-4">
                        <Gamepad2 size={32} />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-text">Resume Quest</h1>
                    <p className="text-text-muted mt-2">Log in to your QuestLog account</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 mb-6 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle size={18} className="shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text mb-1" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="hero_quest"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 mt-2 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-accent-500/20 disabled:opacity-70 transition-all font-display tracking-wide"
                    >
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-text-muted">
                    New adventurer? <Link to="/register" className="text-accent-600 hover:underline font-medium">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
