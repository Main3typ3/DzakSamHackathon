import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Sparkles, ArrowRight, Trophy, XCircle, CheckCircle, Star } from 'lucide-react';
import { getAdventure, submitAdventureAnswer, type Adventure, type AdventureResponse } from '../api';

export default function AdventureMode() {
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
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading adventure...</p>
        </div>
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{adventure.title}</h1>
              <p className="text-gray-400">{adventure.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{score}</div>
              <div className="text-sm text-gray-500">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {stage === 'challenge' && (
            <div className="bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
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
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/30">
            <div className="prose prose-invert max-w-none mb-8">
              <ReactMarkdown>{adventure.narrative_intro}</ReactMarkdown>
            </div>
            
            <button
              onClick={handleStartAdventure}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Begin Your Quest</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Story Stage: Challenge */}
        {stage === 'challenge' && currentChallenge && (
          <div className="space-y-6">
            {/* Challenge Narrative */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-purple-500/30">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{currentChallenge.narrative}</ReactMarkdown>
              </div>
            </div>

            {/* Question and Choices */}
            {!showFeedback ? (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentChallenge.question}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {currentChallenge.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg transition-all border-2 ${
                        selectedAnswer === index
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-slate-600 bg-slate-700/50 text-gray-300 hover:border-purple-400 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedAnswer === index
                              ? 'border-purple-400 bg-purple-500'
                              : 'border-slate-500'
                          }`}
                        >
                          {selectedAnswer === index && (
                            <CheckCircle className="w-5 h-5 text-white" />
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
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              /* Feedback Display */
              <div
                className={`rounded-2xl p-6 border-2 ${
                  feedback?.is_correct
                    ? 'bg-green-900/20 border-green-500/50'
                    : 'bg-red-900/20 border-red-500/50'
                }`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  {feedback?.is_correct ? (
                    <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        feedback?.is_correct ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {feedback?.is_correct ? 'Correct!' : 'Not Quite...'}
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{feedback?.feedback || ''}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                {feedback?.xp_gained && feedback.xp_gained > 0 && (
                  <div className="flex items-center space-x-2 text-purple-400 mb-4">
                    <Star className="w-5 h-5" />
                    <span>+{feedback.xp_gained} XP</span>
                  </div>
                )}

                {feedback?.leveled_up && (
                  <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3 mb-4">
                    <p className="text-purple-300 font-semibold">
                      🎉 Level Up! You're now level {feedback.new_level}!
                    </p>
                  </div>
                )}

                {feedback?.new_badges && feedback.new_badges.length > 0 && (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
                    <p className="text-yellow-300 font-semibold">
                      🏆 Badge Earned: {feedback.new_badges[0].name}!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleNextChallenge}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <span>{feedback?.chapter_complete ? 'View Results' : 'Next Challenge'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Story Stage: Conclusion */}
        {stage === 'conclusion' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/50">
              <div className="text-center mb-6">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Chapter Complete!</h2>
              </div>
              
              <div className="prose prose-invert max-w-none mb-6">
                <ReactMarkdown>{adventure.narrative_conclusion}</ReactMarkdown>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-purple-400">{score}</div>
                    <div className="text-sm text-gray-400">Correct Answers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-pink-400">
                      {adventure.completion_xp}
                    </div>
                    <div className="text-sm text-gray-400">Bonus XP</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContinueToNext}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <span>
                    {chapterId === 'chapter_3' ? 'View All Adventures' : 'Next Chapter'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/learn')}
                  className="flex-1 px-6 py-3 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-500/10 transition-all"
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
