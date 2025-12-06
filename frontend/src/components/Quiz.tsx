import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
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

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    await onSubmit(answers);
    setShowResults(true);
  };

  const allAnswered = answers.every(a => a !== -1);

  if (showResults && results) {
    return (
      <div className="space-y-6">
        <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-purple-500/30">
          <div className={`text-6xl font-bold mb-2 ${
            results.percentage >= 70 ? 'text-green-400' : results.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {results.percentage}%
          </div>
          <p className="text-gray-400">
            You got {results.score} out of {results.total} questions correct
          </p>
          {results.xp_gained > 0 && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-yellow-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">+{results.xp_gained} XP earned!</span>
            </div>
          )}
          {results.leveled_up && (
            <div className="mt-2 text-purple-400 font-semibold animate-pulse">
              Level Up!
            </div>
          )}
        </div>

        <div className="space-y-4">
          {results.results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                result.is_correct
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-red-900/20 border-red-500/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                {result.is_correct ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-white font-medium">{result.question}</p>
                  <p className="text-sm mt-2">
                    <span className="text-gray-400">Your answer: </span>
                    <span className={result.is_correct ? 'text-green-400' : 'text-red-400'}>
                      {result.your_answer}
                    </span>
                  </p>
                  {!result.is_correct && (
                    <p className="text-sm">
                      <span className="text-gray-400">Correct answer: </span>
                      <span className="text-green-400">{result.correct_answer}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-300 mt-2 italic">{result.feedback}</p>
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
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentQuestion
                  ? 'bg-purple-500'
                  : answers[index] !== -1
                  ? 'bg-green-500'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-semibold text-white mb-6">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                answers[currentQuestion] === index
                  ? 'bg-purple-600/30 border-purple-500 text-white'
                  : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-purple-500/50 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  answers[currentQuestion] === index
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-500'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === -1}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Submitting...' : 'Submit Quiz'}</span>
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
