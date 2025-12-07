import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  BookOpen, 
  MessageSquare, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  Chrome 
} from 'lucide-react';
import { getGoogleAuthUrl } from '../api';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to ChainQuest Academy',
    description: 'Your journey into blockchain technology starts here. Learn, practice, and master blockchain concepts through interactive lessons and real-world challenges.',
    icon: <Zap className="w-16 h-16" />,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    title: 'Learn Blockchain Fundamentals',
    description: 'Access interactive lessons covering blockchain basics, cryptography, smart contracts, and decentralized applications. Progress through structured modules at your own pace.',
    icon: <BookOpen className="w-16 h-16" />,
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    title: 'AI-Powered Blockchain Tutor',
    description: 'Get instant answers to your blockchain questions. Our AI tutor, powered by SpoonOS, provides personalized explanations and guides you through complex concepts.',
    icon: <MessageSquare className="w-16 h-16" />,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    title: 'Adventure Mode',
    description: 'Embark on story-driven blockchain adventures. Meet NPCs, solve challenges, and apply your knowledge in engaging narrative experiences.',
    icon: <Sparkles className="w-16 h-16" />,
    gradient: 'from-pink-600 to-orange-600',
  },
  {
    title: 'Track Your Progress',
    description: 'Earn XP, level up, and unlock badges as you master blockchain concepts. Compete with yourself and celebrate your achievements.',
    icon: <Trophy className="w-16 h-16" />,
    gradient: 'from-yellow-600 to-orange-600',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/login');
  };

  const handleGetStarted = async () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setLoading(true);
    try {
      const { auth_url } = await getGoogleAuthUrl();
      window.location.href = auth_url;
    } catch (err) {
      console.error('Error initiating Google login:', err);
      // Fallback to login page
      navigate('/login');
    }
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl w-full">
        {/* Main content */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-500/20 card-glow animate-fade-in-up">
          {/* Skip button */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all duration-300 text-sm hover:scale-110"
            >
              Skip
            </button>
          )}

          {/* Icon with gradient */}
          <div className="flex justify-center mb-8">
            <div 
              className={`inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r ${step.gradient} rounded-2xl text-white transform transition-all duration-500 hover:scale-110 shadow-lg animate-bounce-in`}
              key={currentStep}
            >
              {step.icon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-12 transition-all duration-500" key={`content-${currentStep}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6 animate-fade-in-up animation-delay-100">
              {step.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              {step.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center space-x-3 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-3 rounded-full transition-all duration-500 ${
                  index === currentStep
                    ? 'w-10 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30'
                    : index < currentStep
                    ? 'w-3 bg-purple-500/50'
                    : 'w-3 bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          {isLastStep ? (
            <div className="space-y-4 animate-fade-in-up animation-delay-300">
              <button
                onClick={handleGetStarted}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <Chrome className="w-6 h-6" />
                <span className="text-lg">{loading ? 'Loading...' : 'Sign in with Google'}</span>
              </button>
              <p className="text-center text-sm text-gray-400">
                🚀 Start your blockchain journey today
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between animate-fade-in-up animation-delay-300">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                  currentStep === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50 hover:-translate-x-1'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 btn-primary group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span>Next</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
