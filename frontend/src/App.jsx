import React, { useEffect, Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { IgdbAttribution } from './components/IgdbLink';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages placeholders
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import GameDetailPage from './pages/GameDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyListPage from './pages/MyListPage';
import UserProfilePage from './pages/UserProfilePage';
import CommunityPage from './pages/CommunityPage';
import UserListPage from './pages/UserListPage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-900 p-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Critical Rendering Error</h1>
            <pre className="text-sm bg-white p-4 rounded border border-red-200 overflow-auto max-w-full">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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

  return isAuthenticated ? <HomePage /> : <BrowsePage />;
};

const App = () => {
  useEffect(() => {
    console.log("App mounted - v2.5.0");
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col transition-colors duration-300">
          <Navbar />
          <main className="flex-grow w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 container-archive">
            <Routes>
              <Route path="/" element={<DynamicHome />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/game/:id" element={<GameDetailPage />} />
              <Route path="/profile/:username" element={<UserProfilePage />} />
              <Route path="/user/:username/list" element={<UserListPage />} />
              <Route path="/community" element={<CommunityPage />} />
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
              <span className="mx-2">•</span>
              <a 
                href="/swagger-ui/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent-400 transition-colors"
                title="View API Documentation"
              >
                API Docs
              </a>
            </p>
            <IgdbAttribution />
          </footer>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

