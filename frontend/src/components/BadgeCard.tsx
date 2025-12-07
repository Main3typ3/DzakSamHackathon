import { Rocket, Trophy, BookOpen, Wallet, Code, BarChart3, MessageSquare, Star, Lock, Sparkles, Zap } from 'lucide-react';
import type { Badge } from '../api';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  trophy: Trophy,
  cube: BookOpen,
  wallet: Wallet,
  code: Code,
  chart: BarChart3,
  chat: MessageSquare,
  star: Star,
};

// Check if the icon is an emoji (not in iconMap)
const isEmoji = (icon: string) => !iconMap[icon];

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
}

export default function BadgeCard({ badge, earned = false }: BadgeCardProps) {
  const Icon = iconMap[badge.icon] || Trophy;
  const hasEmojiIcon = isEmoji(badge.icon);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative p-4 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
        earned
          ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1'
          : 'bg-slate-800/30 border-slate-700/50 opacity-60 hover:opacity-80 hover:border-slate-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect for earned badges */}
      {earned && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Floating particles for earned badges */}
      {earned && isHovered && (
        <>
          <Sparkles className="absolute top-3 right-10 w-3 h-3 text-yellow-400 animate-ping" style={{ animationDuration: '1.5s' }} />
          <Sparkles className="absolute bottom-4 left-8 w-2 h-2 text-purple-400 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        </>
      )}

      <div className="relative flex items-start space-x-3">
        <div
          className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500 ${
            earned
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg'
              : 'bg-slate-700 group-hover:bg-slate-600'
          }`}
        >
          {earned ? (
            hasEmojiIcon ? (
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{badge.icon}</span>
            ) : (
              <Icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
            )
          ) : (
            <Lock className="w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:scale-110" />
          )}
          
          {/* Pulse ring for earned badges */}
          {earned && (
            <div className="absolute inset-0 rounded-lg bg-purple-500/50 animate-ping opacity-0 group-hover:opacity-30" style={{ animationDuration: '2s' }} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold transition-colors duration-300 ${earned ? 'text-white group-hover:text-purple-200' : 'text-gray-500'}`}>
            {badge.name}
          </h4>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 transition-colors duration-300 group-hover:text-gray-300">{badge.description}</p>
          <div className="flex items-center mt-2 text-xs gap-1">
            <Zap className={`w-3 h-3 ${earned ? 'text-yellow-400' : 'text-gray-600'}`} />
            <span className={`font-medium ${earned ? 'text-yellow-400' : 'text-gray-600'}`}>
              +{badge.xp_reward} XP
            </span>
          </div>
        </div>
      </div>
      
      {/* Earned checkmark */}
      {earned && (
        <div className="absolute top-2 right-2 animate-bounce-in">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-transform duration-300 group-hover:scale-110">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Locked overlay hint */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/50 rounded-xl">
          <span className="text-xs text-gray-400">Keep learning to unlock!</span>
        </div>
      )}
    </div>
  );
}
