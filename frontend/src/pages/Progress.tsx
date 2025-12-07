import { useState, useEffect, useRef } from 'react';
import { Zap, Trophy, BookOpen, MessageSquare, CheckCircle, Flame, Star } from 'lucide-react';
import BadgeCard from '../components/BadgeCard';
import { getUserStats, type UserStats } from '../api';

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [hasAnimated, end, duration]);

  return { count, ref };
};

// StatCard component to properly use the hook
interface StatCardProps {
  stat: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    color: string;
    bg: string;
    glow: string;
  };
  index: number;
  isLoaded: boolean;
}

function StatCard({ stat, index, isLoaded }: StatCardProps) {
  const { count, ref } = useAnimatedCounter(stat.value);
  
  return (
    <div
      ref={ref}
      className={`group bg-slate-800/50 rounded-xl p-4 border border-purple-500/20 text-center transition-all duration-500 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-lg ${stat.glow} ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${400 + index * 100}ms` }}
    >
      <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
        <stat.icon className={`w-5 h-5 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{count}</div>
      <div className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">{stat.label}</div>
    </div>
  );
}

export default function Progress() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [levelProgress, setLevelProgress] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load progress. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchStats();
  }, []);

  // Animate level progress bar
  useEffect(() => {
    if (stats && isLoaded) {
      setTimeout(() => {
        setLevelProgress(stats.level_progress.percentage);
      }, 500);
    }
  }, [stats, isLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <Trophy className="absolute inset-0 m-auto w-6 h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 animate-pulse">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-red-400 mb-4">{error || 'Failed to load progress'}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary btn-animated"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const earnedBadgeIds = stats.badges.map(b => b.id);

  const statCards = [
    {
      icon: Zap,
      label: 'Total XP',
      value: stats.xp,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      glow: 'group-hover:shadow-yellow-500/20',
    },
    {
      icon: Trophy,
      label: 'Level',
      value: stats.level,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      glow: 'group-hover:shadow-purple-500/20',
    },
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: stats.completed_lessons,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      glow: 'group-hover:shadow-blue-500/20',
    },
    {
      icon: CheckCircle,
      label: 'Quiz Answers Correct',
      value: stats.correct_answers,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      glow: 'group-hover:shadow-green-500/20',
    },
    {
      icon: MessageSquare,
      label: 'AI Questions Asked',
      value: stats.ai_chat_count,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
      glow: 'group-hover:shadow-pink-500/20',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className={`transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-purple-300 text-sm">Your Journey So Far</span>
            </div>
          </div>
          
          <h1 
            className={`text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Your <span className="gradient-text-animated">Progress</span>
          </h1>
          <p 
            className={`text-gray-400 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Track your blockchain learning journey
          </p>
        </div>

        {/* Level Card */}
        <div 
          className={`relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30 mb-8 overflow-hidden transition-all duration-700 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-purple-400/20 rounded-full animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Trophy className="w-12 h-12 text-yellow-400 animate-float" />
                  <Flame className="absolute -top-1 -right-1 w-5 h-5 text-orange-500 animate-pulse" />
                </div>
                <div className="text-6xl font-bold text-white">
                  Level {stats.level}
                </div>
              </div>
              <p className="text-gray-400">
                <span className="text-purple-400 font-semibold">{stats.level_progress.current}</span> / {stats.level_progress.needed} XP to next level
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out relative"
                  style={{ width: `${levelProgress}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Progress</span>
                <span className="text-purple-400 font-medium">{stats.level_progress.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {statCards.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isLoaded={isLoaded} />
          ))}
        </div>

        {/* Badges Section */}
        <div 
          className={`mb-8 transition-all duration-700 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-400 animate-float" />
            <span>Badges</span>
            <span className="text-sm text-gray-500 font-normal px-2 py-1 bg-slate-800 rounded-full">
              {stats.badges.length} / {stats.all_badges.length}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {stats.all_badges.map((badge, index) => (
              <div
                key={badge.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BadgeCard
                  badge={badge}
                  earned={earnedBadgeIds.includes(badge.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quiz History */}
        {Object.keys(stats.quiz_scores).length > 0 && (
          <div 
            className={`transition-all duration-700 delay-800 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Quiz History
            </h2>
            <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Quiz</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Score</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {Object.entries(stats.quiz_scores).map(([quizId, data], index) => (
                    <tr 
                      key={quizId}
                      className="transition-colors duration-200 hover:bg-slate-700/30"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 text-white">{quizId}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                          (data.score / data.total) >= 0.7 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {(data.score / data.total) >= 0.7 && <CheckCircle className="w-3 h-3" />}
                          {data.score} / {data.total}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(data.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
