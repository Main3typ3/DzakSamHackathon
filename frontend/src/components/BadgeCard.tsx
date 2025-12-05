import { Rocket, Trophy, BookOpen, Wallet, Code, BarChart3, MessageSquare, Star, Lock } from 'lucide-react';
import type { Badge } from '../api';

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

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
}

export default function BadgeCard({ badge, earned = false }: BadgeCardProps) {
  const Icon = iconMap[badge.icon] || Trophy;

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        earned
          ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50'
          : 'bg-slate-800/30 border-slate-700/50 opacity-60'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            earned
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-slate-700'
          }`}
        >
          {earned ? (
            <Icon className="w-6 h-6 text-white" />
          ) : (
            <Lock className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${earned ? 'text-white' : 'text-gray-500'}`}>
            {badge.name}
          </h4>
          <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
          <div className="flex items-center mt-2 text-xs">
            <span className={earned ? 'text-yellow-400' : 'text-gray-600'}>
              +{badge.xp_reward} XP
            </span>
          </div>
        </div>
      </div>
      {earned && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
