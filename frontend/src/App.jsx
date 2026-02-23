import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { IgdbAttribution } from './components/IgdbLink';
import { useAuth } from './context/AuthContext';

// Pages placeholders to be implemented
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import GameDetailPage from './pages/GameDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyListPage from './pages/MyListPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-accent-500 font-display text-xl animate-pulse">Loading Journal...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Auto-redirect Home wrapper
const DynamicHome = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-accent-500 font-display text-xl animate-pulse">Loading...</div>;

  // Logged in = Personalized Dashboard Shelves. Guest = Discover Browse page.
  return isAuthenticated ? <HomePage /> : <BrowsePage />;
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<DynamicHome />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/my-list"
            element={
              <ProtectedRoute>
                <MyListPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer className="border-t border-border mt-12 py-6 bg-surface text-center space-y-1">
        <p className="text-sm font-medium text-text-muted">
          <span className="font-display font-bold">QuestLog</span> &copy; {new Date().getFullYear()}
        </p>
        <IgdbAttribution />
      </footer>
    </div>
  );
};

export default App;

