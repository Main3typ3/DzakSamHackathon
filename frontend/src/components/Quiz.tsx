import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Sparkles, Trophy, Zap, ArrowLeft } from 'lucide-react';
import type { QuizQuestion, QuizResult } from '../api';

interface QuizProps {
  questions: QuizQuestion[];
  onSubmit: (answers: number[]) => Promise<void>;
  results?: {
    results: QuizResult[];
    score: number;
    total: number;
    percentage: number;
    xp_gained: number;
    leveled_up: boolean;
  };
  loading?: boolean;
}

export default function Quiz({ questions, onSubmit, results, loading }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counting
  useEffect(() => {
    if (showResults && results) {
      setShowCelebration(results.percentage >= 70);
      const duration = 1000;
      const steps = 30;
      const increment = results.percentage / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= results.percentage) {
          setAnimatedScore(results.percentage);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [showResults, results]);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnimation(optionIndex);
    setTimeout(() => setSelectedAnimation(null), 300);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(answers);
    setShowResults(true);
  };

  const allAnswered = answers.every(a => a !== -1);

  if (showResults && results) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Celebration particles */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  backgroundColor: ['#a855f7', '#ec4899', '#facc15', '#22c55e'][Math.floor(Math.random() * 4)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className={`text-center p-8 bg-slate-800/50 rounded-2xl border transition-all duration-500 ${
          results.percentage >= 70 
            ? 'border-green-500/50 shadow-lg shadow-green-500/20' 
            : results.percentage >= 50 
            ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
            : 'border-red-500/50 shadow-lg shadow-red-500/20'
        }`}>
          {/* Score circle */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(animatedScore / 100) * 352} 352`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold tabular-nums ${
                results.percentage >= 70 ? 'text-green-400' : results.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {animatedScore}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            {results.percentage >= 70 && <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />}
            <p className="text-white text-lg font-medium">
              {results.percentage >= 70 ? 'Excellent!' : results.percentage >= 50 ? 'Good effort!' : 'Keep learning!'}
            </p>
          </div>
          
          <p className="text-gray-400">
            You got <span className="text-white font-semibold">{results.score}</span> out of <span className="text-white font-semibold">{results.total}</span> questions correct
          </p>
          
          {results.xp_gained > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full animate-bounce-in">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-400">+{results.xp_gained} XP earned!</span>
            </div>
          )}
          
          {results.leveled_up && (
            <div className="mt-3 flex items-center justify-center gap-2 text-purple-400 font-semibold animate-pulse">
              <Sparkles className="w-5 h-5" />
              <span>Level Up!</span>
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {results.results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all duration-500 animate-fade-in-up hover:scale-[1.01] ${
                result.is_correct
                  ? 'bg-green-900/20 border-green-500/30 hover:border-green-500/50'
                  : 'bg-red-900/20 border-red-500/30 hover:border-red-500/50'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  result.is_correct ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {result.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{result.question}</p>
                  <p className="text-sm mt-2">
                    <span className="text-gray-400">Your answer: </span>
                    <span className={`font-medium ${result.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                      {result.your_answer}
                    </span>
                  </p>
                  {!result.is_correct && (
                    <p className="text-sm">
                      <span className="text-gray-400">Correct answer: </span>
                      <span className="text-green-400 font-medium">{result.correct_answer}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-300 mt-2 italic bg-slate-800/50 p-2 rounded-lg">{result.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span className="flex items-center gap-2">
          <span className="text-purple-400 font-semibold">Q{currentQuestion + 1}</span>
          <span>of {questions.length}</span>
        </span>
        <div className="flex space-x-1.5">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentQuestion(index);
                  setIsTransitioning(false);
                }, 200);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentQuestion
                  ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/50'
                  : answers[index] !== -1
                  ? 'bg-green-500 hover:bg-green-400'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className={`bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 transition-all duration-300 ${
        isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      }`}>
        <h3 className="text-xl font-semibold text-white mb-6 animate-fade-in">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`group w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                answers[currentQuestion] === index
                  ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-[1.02]'
                  : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-purple-500/50 hover:bg-slate-700 hover:scale-[1.01]'
              } ${selectedAnimation === index ? 'animate-pop' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  answers[currentQuestion] === index
                    ? 'border-purple-500 bg-purple-500 scale-110'
                    : 'border-gray-500 group-hover:border-purple-400'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full animate-scale-in" />
                  )}
                </div>
                <span className="transition-colors duration-300 group-hover:text-white">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="group flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Previous</span>
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === -1}
            className="group btn-primary flex items-center space-x-2 disabled:opacity-50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="group btn-primary flex items-center space-x-2 disabled:opacity-50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
          >
            <span>{loading ? 'Submitting...' : 'Submit Quiz'}</span>
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : 'transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110'}`} />
          </button>
        )}
      </div>
    </div>
  );
}
