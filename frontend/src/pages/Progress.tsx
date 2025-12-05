import { useState, useEffect } from 'react';
import { Loader2, Zap, Trophy, BookOpen, MessageSquare, CheckCircle } from 'lucide-react';
import BadgeCard from '../components/BadgeCard';
import { getUserStats, type UserStats } from '../api';

export default function Progress() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Failed to load progress'}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
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
    },
    {
      icon: Trophy,
      label: 'Level',
      value: stats.level,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      icon: BookOpen,
      label: 'Lessons Completed',
      value: stats.completed_lessons,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: CheckCircle,
      label: 'Quiz Answers Correct',
      value: stats.correct_answers,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      icon: MessageSquare,
      label: 'AI Questions Asked',
      value: stats.ai_chat_count,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your Progress</h1>
          <p className="text-gray-400">
            Track your blockchain learning journey
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="text-6xl font-bold text-white mb-2">Level {stats.level}</div>
              <p className="text-gray-400">
                {stats.level_progress.current} / {stats.level_progress.needed} XP to next level
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${stats.level_progress.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Progress</span>
                <span>{stats.level_progress.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20 text-center"
            >
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span>Badges</span>
            <span className="text-sm text-gray-500 font-normal">
              ({stats.badges.length} / {stats.all_badges.length})
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.all_badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={earnedBadgeIds.includes(badge.id)}
              />
            ))}
          </div>
        </div>

        {Object.keys(stats.quiz_scores).length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quiz History</h2>
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
                  {Object.entries(stats.quiz_scores).map(([quizId, data]) => (
                    <tr key={quizId}>
                      <td className="px-6 py-4 text-white">{quizId}</td>
                      <td className="px-6 py-4">
                        <span className={`${
                          (data.score / data.total) >= 0.7 ? 'text-green-400' : 'text-yellow-400'
                        }`}>
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
