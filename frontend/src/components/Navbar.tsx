import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageSquare, Trophy, Home, Zap, Users, Sparkles, Code, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  xp?: number;
  level?: number;
}

export default function Navbar({ xp = 0, level = 1 }: NavbarProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [prevXp, setPrevXp] = useState(xp);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // XP change animation
  useEffect(() => {
    if (xp !== prevXp && xp > prevXp) {
      setXpAnimating(true);
      const timer = setTimeout(() => setXpAnimating(false), 600);
      setPrevXp(xp);
      return () => clearTimeout(timer);
    }
    setPrevXp(xp);
  }, [xp, prevXp]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/adventures', icon: Sparkles, label: 'Adventures' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/explainer', icon: Code, label: 'Explainer' },
    { path: '/chat', icon: MessageSquare, label: 'AI Tutor' },
    { path: '/progress', icon: Trophy, label: 'Progress' },
    { path: '/about', icon: Users, label: 'About' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-purple-500/10' 
        : 'bg-slate-900/80 backdrop-blur-lg'
    } border-b border-purple-500/20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with hover animation */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-purple-500/50">
              <Zap className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-xl font-bold text-gradient transition-all duration-300 group-hover:tracking-wide">ChainQuest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }, index) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                  isActive(path)
                    ? 'bg-purple-600/30 text-purple-300 shadow-lg shadow-purple-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/80'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive(path) ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'
                }`} />
                <span className="relative">
                  {label}
                  {isActive(path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-scale-in" />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Right side - XP and User */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className={`flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg border transition-all duration-300 ${
                xpAnimating 
                  ? 'border-yellow-400/60 shadow-lg shadow-yellow-500/30 scale-105' 
                  : 'border-purple-500/30 hover:border-purple-400/50'
              }`}>
                <Zap className={`w-4 h-4 text-yellow-400 transition-all duration-300 ${
                  xpAnimating ? 'animate-bounce scale-125' : ''
                }`} />
                <span className={`text-yellow-400 font-semibold tabular-nums transition-all duration-300 ${
                  xpAnimating ? 'scale-110' : ''
                }`}>{xp} XP</span>
                <span className="text-gray-500">|</span>
                <span className="text-purple-400 font-semibold">Lvl {level}</span>
              </div>
            )}
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg border border-purple-500/30 transition-all duration-300 hover:border-purple-400/50 hover:bg-slate-700/50 group">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full ring-2 ring-purple-500/50 transition-all duration-300 group-hover:ring-purple-400 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm text-gray-300 hidden lg:block transition-colors duration-300 group-hover:text-white">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 btn-primary px-4 py-2 btn-animated group"
              >
                <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 animate-scale-in" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 stagger-children">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-purple-600/30 text-purple-300 translate-x-2'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800 hover:translate-x-2'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive(path) ? 'animate-wiggle' : ''}`} />
                <span className="font-medium">{label}</span>
                {isActive(path) && (
                  <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
