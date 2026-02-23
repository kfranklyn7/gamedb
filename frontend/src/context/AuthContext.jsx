import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

// Actually we don't need jwt-decode if we just use the token opaquely. Let's provide a basic manual decode to get user email.
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (err) {
        return null;
    }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.exp * 1000 > Date.now()) {
                setUser({ email: decoded.sub || decoded.email, token });
            } else {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);

        // Listen for the 401 custom event from Axios interceptor
        const handleUnauthorized = () => {
            setUser(null);
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        const token = data.token;
        localStorage.setItem('token', token);
        const decoded = decodeToken(token);
        setUser({ email: decoded.sub || decoded.email, token });
    };

    const register = async (userData) => {
        const data = await authApi.register(userData);
        const token = data.token;
        localStorage.setItem('token', token);
        const decoded = decodeToken(token);
        setUser({ email: decoded.sub || decoded.email, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
