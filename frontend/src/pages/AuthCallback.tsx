import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { handleGoogleCallback } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!code) {
      setError('No authorization code received.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    const completeAuth = async () => {
      try {
        const { access_token, user } = await handleGoogleCallback(code);
        login(access_token, user);
        navigate('/');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Failed to complete authentication. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    completeAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 card-glow">
          {error ? (
            <>
              <div className="text-red-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
                <p className="text-gray-400">{error}</p>
              </div>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </>
          ) : (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-spin" />
              <h2 className="text-2xl font-bold text-gradient mb-2">Completing Sign In</h2>
              <p className="text-gray-400">Please wait while we verify your credentials...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
