import { Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageSquare, Trophy, Home, Zap } from 'lucide-react';

interface NavbarProps {
  xp?: number;
  level?: number;
}

export default function Navbar({ xp = 0, level = 1 }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/chat', icon: MessageSquare, label: 'AI Tutor' },
    { path: '/progress', icon: Trophy, label: 'Progress' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">ChainQuest</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-purple-600/30 text-purple-300'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-purple-500/30">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{xp} XP</span>
              <span className="text-gray-500">|</span>
              <span className="text-purple-400 font-semibold">Lvl {level}</span>
            </div>
          </div>
        </div>

        <div className="md:hidden flex justify-around py-2 border-t border-purple-500/20">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                isActive(path)
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
