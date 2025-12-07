import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Sparkles, MessageSquare, Code, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthRequiredProps {
  children: React.ReactNode;
  feature?: string;
  compact?: boolean;
}

// Full page auth gate for entire pages
export default function AuthRequired({ children, feature = 'this feature' }: AuthRequiredProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="relative inline-block">
            <Sparkles className="w-12 h-12 text-purple-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-purple-500/20 animate-ping"></div>
          </div>
          <p className="text-gray-400 mt-4 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
        </div>

        <div className="max-w-lg w-full relative z-10 animate-fade-in-up">
          <div className="bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 text-center">
            {/* Lock icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 shadow-lg shadow-purple-500/30 animate-bounce-in">
              <Lock className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3 animate-fade-in-up animation-delay-100">
              Sign In Required
            </h1>
            
            <p className="text-gray-400 mb-6 animate-fade-in-up animation-delay-200">
              Please sign in to access {feature}. This helps us track your progress and provide personalized learning experiences.
            </p>

            {/* Features list */}
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6 animate-fade-in-up animation-delay-300">
              <p className="text-sm text-gray-400 mb-3">Unlock features like:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center space-x-2 bg-purple-500/20 px-3 py-1.5 rounded-full text-sm text-purple-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Tutor</span>
                </div>
                <div className="flex items-center space-x-2 bg-pink-500/20 px-3 py-1.5 rounded-full text-sm text-pink-300">
                  <Code className="w-4 h-4" />
                  <span>Code Explainer</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1.5 rounded-full text-sm text-blue-300">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Adventures</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 animate-fade-in-up animation-delay-400">
              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-3 text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Inline auth prompt for specific features within a page
export function AuthPrompt({ 
  feature = 'this feature',
  onSignIn 
}: { 
  feature?: string;
  onSignIn?: () => void;
}) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-6 text-center animate-fade-in-up">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-600/30 rounded-full mb-4">
        <Lock className="w-7 h-7 text-purple-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">Sign In to Continue</h3>
      <p className="text-gray-400 text-sm mb-4">
        {feature} requires you to be signed in.
      </p>
      
      <button
        onClick={handleSignIn}
        className="btn-primary px-6 py-2 flex items-center justify-center space-x-2 mx-auto group"
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In</span>
      </button>
    </div>
  );
}
