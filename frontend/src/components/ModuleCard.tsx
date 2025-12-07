import { Link } from 'react-router-dom';
import { BookOpen, Wallet, Code, BarChart3, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import type { Module } from '../api';
import { useState, useEffect } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cube: BookOpen,
  wallet: Wallet,
  code: Code,
  chart: BarChart3,
};

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const Icon = iconMap[module.icon] || BookOpen;
  const progress = module.progress || { completed: 0, total: 0, percentage: 0 };
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress.percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress.percentage]);

  return (
    <Link
      to={`/module/${module.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2 overflow-hidden">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
        
        <div className="relative">
          {/* Icon with animation */}
          <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}>
            <Icon className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
            
            {/* Completion sparkle */}
            {progress.percentage === 100 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce-in">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Title with hover effect */}
          <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-purple-200 flex items-center gap-2">
            {module.title}
            <ChevronRight className={`w-5 h-5 text-purple-400 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 transition-colors duration-300 group-hover:text-gray-300 line-clamp-2">{module.description}</p>

          {/* Stats row */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg">
                <BookOpen className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400">{module.lessons.length} lessons</span>
              </div>
            </div>
            
            {progress.percentage > 0 && (
              <div className="flex items-center space-x-2">
                {progress.percentage === 100 ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg">
                    <Sparkles className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 font-medium">Complete!</span>
                  </div>
                ) : (
                  <span className="text-purple-400 font-medium">{progress.percentage}%</span>
                )}
              </div>
            )}
          </div>

          {/* Animated progress bar */}
          <div className="relative h-2 bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000 ease-out relative`}
              style={{ width: `${animatedProgress}%` }}
            >
              {/* Shimmer effect on progress bar */}
              {progress.percentage > 0 && progress.percentage < 100 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              )}
            </div>
          </div>

          {/* Hover CTA */}
          <div className={`mt-4 flex items-center justify-center gap-2 text-purple-400 font-medium transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <span>{progress.percentage === 0 ? 'Start Learning' : progress.percentage === 100 ? 'Review Module' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </div>
    </Link>
  );
}
