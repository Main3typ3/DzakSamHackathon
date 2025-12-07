import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Chrome, Sparkles } from 'lucide-react';
import { getGoogleAuthUrl } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { auth_url } = await getGoogleAuthUrl();
      // Redirect to Google OAuth
      window.location.href = auth_url;
    } catch (err) {
      setError('Failed to initiate Google login. Please try again.');
      setLoading(false);
      console.error('Google login error:', err);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 text-4xl opacity-10 animate-float">🔐</div>
        <div className="absolute top-1/3 right-1/4 text-3xl opacity-10 animate-float animation-delay-200">⛓️</div>
        <div className="absolute bottom-1/3 left-1/3 text-3xl opacity-10 animate-float animation-delay-400">🚀</div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 card-glow animate-fade-in-up hover:border-purple-500/40 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-lg shadow-purple-500/30 animate-bounce-in">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2 animate-fade-in-up animation-delay-100">Welcome Back</h1>
            <p className="text-gray-400 animate-fade-in-up animation-delay-200">Sign in to continue your blockchain learning journey</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-wiggle">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up animation-delay-300 group relative overflow-hidden shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <Chrome className="w-6 h-6" />
            <span className="text-lg">{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="mt-6 text-center animate-fade-in-up animation-delay-400">
            <p className="text-sm text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Features reminder */}
          <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in-up animation-delay-500">
            <p className="text-xs text-gray-500 text-center mb-3">What awaits you:</p>
            <div className="flex justify-center space-x-6 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>AI Tutor</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🎮</span>
                <span>Adventures</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🏆</span>
                <span>Badges</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center animate-fade-in-up animation-delay-500">
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300 transition-all duration-300 hover:-translate-x-1 inline-flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
