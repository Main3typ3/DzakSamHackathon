import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, CheckCircle, ArrowRight, BookOpen, Trophy } from 'lucide-react';
import { getAdventures, type Adventure } from '../api';
import AuthRequired from '../components/AuthRequired';

// Skeleton loader for adventure cards
const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 animate-pulse">
    <div className="flex items-start space-x-6">
      <div className="w-20 h-20 rounded-2xl bg-slate-700"></div>
      <div className="flex-1 space-y-4">
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-slate-700 rounded w-24"></div>
          <div className="h-4 bg-slate-700 rounded w-20"></div>
        </div>
        <div className="h-10 bg-slate-700 rounded w-40"></div>
      </div>
    </div>
  </div>
);

function AdventuresContent() {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdventures = async () => {
      try {
        const data = await getAdventures();
        setAdventures(data);
      } catch (error) {
        console.error('Failed to load adventures:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdventures();
  }, []);

  const getChapterIcon = (chapterIndex: number) => {
    const icons = ['🔑', '📜', '💎'];
    return icons[chapterIndex] || '⭐';
  };

  const isChapterUnlocked = (index: number) => {
    if (index === 0) return true;
    // Verify all previous chapters are completed
    for (let i = 0; i < index; i++) {
      if (!adventures[i]?.completed) return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen pt-20 pb-8 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/4 text-4xl opacity-20 animate-float">⚔️</div>
        <div className="absolute top-1/2 right-1/4 text-3xl opacity-20 animate-float animation-delay-200">🏆</div>
        <div className="absolute bottom-1/3 left-1/3 text-3xl opacity-20 animate-float animation-delay-400">🎮</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6 animate-bounce-in">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse-slow" />
            <span className="text-purple-300 text-sm">Story-Based Learning</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            <span className="text-white">The </span>
            <span className="text-gradient">Blockchain Quest</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            Embark on an interactive adventure through the world of blockchain.
            Learn by doing as you progress through an engaging narrative with your AI Game Master.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="space-y-6">
            {adventures.map((adventure, index) => {
              const unlocked = isChapterUnlocked(index);
              const progress = adventure.user_progress;
              const progressPercent = progress
                ? (progress.completed_challenges.length / progress.total_challenges) * 100
                : 0;

              return (
                <div
                  key={adventure.id}
                  className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border transition-all duration-500 animate-fade-in-up ${
                    unlocked
                      ? 'border-purple-500/30 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10'
                      : 'border-slate-700 opacity-75'
                  } ${unlocked ? 'hover:scale-[1.02]' : ''}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Shine effect on hover */}
                  {unlocked && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  )}

                  <div className="flex items-start space-x-6">
                    {/* Chapter Icon */}
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 transition-all duration-300 ${
                        unlocked
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 adventure-card'
                          : 'bg-slate-700'
                      } ${adventure.completed ? 'animate-glow' : ''}`}
                    >
                      {unlocked ? (
                        <span className="transform hover:scale-110 transition-transform">{getChapterIcon(index)}</span>
                      ) : (
                        <Lock className="w-8 h-8 text-slate-500" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">
                              {adventure.title}
                            </h2>
                            {adventure.completed && (
                              <div className="flex items-center space-x-1 text-green-400 animate-bounce-in">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm">Completed</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400">{adventure.description}</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500 px-3 py-1 bg-slate-700/50 rounded-full">Chapter {index + 1}</div>
                        </div>
                      </div>

                      {/* Progress Bar (if started but not completed) */}
                      {progress && !adventure.completed && progressPercent > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-purple-400">
                              {progress.completed_challenges.length} / {progress.total_challenges} challenges
                            </span>
                          </div>
                          <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">
                            {adventure.challenges?.length || 0} Challenges
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-purple-400">
                          <Sparkles className="w-4 h-4 animate-pulse-slow" />
                          <span className="text-sm">
                            {adventure.completion_xp || 0} XP Reward
                          </span>
                        </div>
                        {adventure.completed && (
                          <div className="flex items-center space-x-2 text-yellow-400">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm">Mastered</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {unlocked ? (
                        <Link
                          to={`/adventure/${adventure.id}`}
                          className="inline-flex items-center space-x-2 btn-primary group relative overflow-hidden"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                          <span>
                            {adventure.completed
                              ? 'Play Again'
                              : progress && progressPercent > 0
                              ? 'Continue Adventure'
                              : 'Start Adventure'}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-700 text-gray-500 rounded-lg cursor-not-allowed">
                          <Lock className="w-4 h-4" />
                          <span>Complete previous chapter to unlock</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30 text-center animate-fade-in-up animation-delay-300 hover:border-purple-500/50 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready for Your Quest?
          </h2>
          <p className="text-gray-400 mb-6">
            Learn blockchain concepts through an interactive story with AI-powered guidance.
            Complete challenges, make choices, and earn rewards!
          </p>
          {adventures.length > 0 && !adventures[0].completed && (
            <Link
              to={`/adventure/${adventures[0].id}`}
              className="btn-primary inline-flex items-center space-x-2 group"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Export wrapped component with auth requirement
export default function Adventures() {
  return (
    <AuthRequired feature="Adventure Mode">
      <AdventuresContent />
    </AuthRequired>
  );
}
