import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ArrowRight, Trophy, XCircle, CheckCircle, Star, Zap } from 'lucide-react';
import { getAdventure, submitAdventureAnswer, type Adventure, type AdventureResponse } from '../api';
import AuthRequired from '../components/AuthRequired';

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue}</span>;
};

function AdventureModeContent() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<AdventureResponse | null>(null);
  const [stage, setStage] = useState<'intro' | 'challenge' | 'conclusion'>('intro');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadAdventure = async () => {
      if (!chapterId) return;
      
      setLoading(true);
      try {
        const data = await getAdventure(chapterId);
        setAdventure(data);
        
        // If already completed some challenges, start from there
        if (data.user_progress && data.user_progress.completed_challenges.length > 0) {
          setCurrentChallengeIndex(data.user_progress.completed_challenges.length);
          setScore(data.user_progress.score);
          
          // If all challenges completed, go to conclusion
          if (data.user_progress.completed_challenges.length >= data.challenges.length) {
            setStage('conclusion');
          } else {
            setStage('challenge');
          }
        }
      } catch (error) {
        console.error('Failed to load adventure:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAdventure();
  }, [chapterId]);

  const handleStartAdventure = () => {
    setStage('challenge');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showFeedback) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !adventure || !chapterId) return;

    const currentChallenge = adventure.challenges[currentChallengeIndex];
    
    try {
      const result = await submitAdventureAnswer(
        chapterId,
        currentChallenge.id,
        selectedAnswer
      );
      
      setFeedback(result);
      setShowFeedback(true);
      
      if (result.is_correct) {
        setScore(result.score);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleNextChallenge = () => {
    if (!adventure || !feedback) return;

    setShowFeedback(false);
    setSelectedAnswer(null);
    setFeedback(null);

    if (feedback.chapter_complete) {
      setStage('conclusion');
    } else {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    }
  };

  const handleContinueToNext = () => {
    // Determine next chapter safely
    const chapterMatch = chapterId?.match(/chapter_(\d+)/);
    const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 1;
    
    if (chapterNumber < 3) {
      navigate(`/adventure/chapter_${chapterNumber + 1}`);
    } else {
      navigate('/adventures');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin-slow" />
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-purple-500/20 animate-ping"></div>
          </div>
          <p className="text-gray-400 animate-pulse">Loading adventure...</p>
        </div>
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Adventure not found</p>
          <button
            onClick={() => navigate('/adventures')}
            className="btn-primary mt-4"
          >
            Back to Adventures
          </button>
        </div>
      </div>
    );
  }

  const currentChallenge = adventure.challenges[currentChallengeIndex];
  const progress = ((currentChallengeIndex + 1) / adventure.challenges.length) * 100;

  return (
    <div className="min-h-screen pt-20 pb-8 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header with Progress */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{adventure.title}</h1>
              <p className="text-gray-400">{adventure.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400 flex items-center space-x-2">
                <Zap className="w-6 h-6" />
                <AnimatedNumber value={score} />
              </div>
              <div className="text-sm text-gray-500">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {stage === 'challenge' && (
            <div className="bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-2">
            Challenge {Math.min(currentChallengeIndex + 1, adventure.challenges.length)} of {adventure.challenges.length}
          </div>
        </div>

        {/* Story Stage: Intro */}
        {stage === 'intro' && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/30 animate-fade-in-up animation-delay-100 hover:border-purple-500/50 transition-all duration-300">
            <div className="prose prose-invert max-w-none mb-8">
              <ReactMarkdown>{adventure.narrative_intro}</ReactMarkdown>
            </div>
            
            <button
              onClick={handleStartAdventure}
              className="btn-primary w-full flex items-center justify-center space-x-2 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span>Begin Your Quest</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Story Stage: Challenge */}
        {stage === 'challenge' && currentChallenge && (
          <div className="space-y-6">
            {/* Challenge Narrative */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-purple-500/30 animate-fade-in-up">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{currentChallenge.narrative}</ReactMarkdown>
              </div>
            </div>

            {/* Question and Choices */}
            {!showFeedback ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 animate-fade-in-up animation-delay-100">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentChallenge.question}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {currentChallenge.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-300 border-2 transform hover:scale-[1.02] animate-fade-in-up ${
                        selectedAnswer === index
                          ? 'border-purple-500 bg-purple-500/20 text-white shadow-lg shadow-purple-500/20'
                          : 'border-slate-600 bg-slate-700/50 text-gray-300 hover:border-purple-400 hover:bg-slate-700'
                      }`}
                      style={{ animationDelay: `${150 + index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            selectedAnswer === index
                              ? 'border-purple-400 bg-purple-500 scale-110'
                              : 'border-slate-500'
                          }`}
                        >
                          {selectedAnswer === index && (
                            <CheckCircle className="w-5 h-5 text-white animate-scale-in" />
                          )}
                        </div>
                        <span>{choice}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  Submit Answer
                </button>
              </div>
            ) : (
              /* Feedback Display */
              <div
                className={`rounded-2xl p-6 border-2 animate-bounce-in ${
                  feedback?.is_correct
                    ? 'bg-green-900/20 border-green-500/50'
                    : 'bg-red-900/20 border-red-500/50'
                }`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  {feedback?.is_correct ? (
                    <div className="relative">
                      <CheckCircle className="w-10 h-10 text-green-400 flex-shrink-0 animate-bounce-in" />
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-green-400/30 animate-ping"></div>
                    </div>
                  ) : (
                    <XCircle className="w-10 h-10 text-red-400 flex-shrink-0 animate-wiggle" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        feedback?.is_correct ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {feedback?.is_correct ? '🎉 Correct!' : 'Not Quite...'}
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{feedback?.feedback || ''}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                {feedback?.xp_gained && feedback.xp_gained > 0 && (
                  <div className="flex items-center space-x-2 text-purple-400 mb-4 animate-fade-in-up animation-delay-100">
                    <Star className="w-5 h-5 animate-wiggle" />
                    <span className="font-semibold">+{feedback.xp_gained} XP</span>
                  </div>
                )}

                {feedback?.leveled_up && (
                  <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 mb-4 animate-bounce-in animation-delay-200">
                    <p className="text-purple-300 font-semibold text-lg">
                      🎉 Level Up! You're now level {feedback.new_level}!
                    </p>
                  </div>
                )}

                {feedback?.new_badges && feedback.new_badges.length > 0 && (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4 animate-bounce-in animation-delay-300">
                    <p className="text-yellow-300 font-semibold text-lg">
                      🏆 Badge Earned: {feedback.new_badges[0].name}!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleNextChallenge}
                  className="btn-primary w-full flex items-center justify-center space-x-2 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span>{feedback?.chapter_complete ? 'View Results' : 'Next Challenge'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Story Stage: Conclusion */}
        {stage === 'conclusion' && (
          <div className="space-y-6">
            {/* Confetti effect */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="quiz-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    background: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'][i % 5]
                  }}
                />
              ))}
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/50 animate-bounce-in">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-float" />
                  <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-yellow-400/20 animate-ping"></div>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in-up animation-delay-100">
                  Chapter Complete!
                </h2>
              </div>
              
              <div className="prose prose-invert max-w-none mb-6 animate-fade-in-up animation-delay-200">
                <ReactMarkdown>{adventure.narrative_conclusion}</ReactMarkdown>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 animate-fade-in-up animation-delay-300">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <div className="text-4xl font-bold text-purple-400">
                      <AnimatedNumber value={score} />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Correct Answers</div>
                  </div>
                  <div className="p-4 bg-pink-500/10 rounded-lg">
                    <div className="text-4xl font-bold text-pink-400">
                      <AnimatedNumber value={adventure.completion_xp} />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Bonus XP</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-400">
                <button
                  onClick={handleContinueToNext}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span>
                    {chapterId === 'chapter_3' ? 'View All Adventures' : 'Next Chapter'}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/learn')}
                  className="flex-1 px-6 py-3 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-500/10 transition-all duration-300 hover:scale-105"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export wrapped component with auth requirement
export default function AdventureMode() {
  return (
    <AuthRequired feature="Adventure Mode">
      <AdventureModeContent />
    </AuthRequired>
  );
}
