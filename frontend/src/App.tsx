import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Module from './pages/Module';
import Lesson from './pages/Lesson';
import Chat from './pages/Chat';
import Progress from './pages/Progress';
import About from './pages/About';
import Adventures from './pages/Adventures';
import AdventureMode from './pages/AdventureMode';
import CodeExplainer from './pages/CodeExplainer';
import { getUserStats } from './api';

function AppContent() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();

  // Check if user has seen onboarding
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';

  useEffect(() => {
    const fetchStats = async () => {
      if (isAuthenticated) {
        try {
          const stats = await getUserStats();
          setXp(stats.xp);
          setLevel(stats.level);
        } catch (error) {
          console.error('Failed to fetch user stats:', error);
        }
      }
    };

    fetchStats();

    if (isAuthenticated) {
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Don't show navbar on auth pages
  const hideNavbar = location.pathname === '/onboarding' || 
                      location.pathname === '/login' || 
                      location.pathname === '/auth/callback';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding for first-time visitors who aren't authenticated
  if (!isAuthenticated && !hasSeenOnboarding && location.pathname === '/') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar xp={xp} level={level} />}
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Main app routes */}
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/module/:moduleId" element={<Module />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/about" element={<About />} />
        <Route path="/adventures" element={<Adventures />} />
        <Route path="/adventure/:chapterId" element={<AdventureMode />} />
        <Route path="/explainer" element={<CodeExplainer />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
