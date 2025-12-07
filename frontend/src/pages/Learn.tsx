import { useState, useEffect } from 'react';
import { Loader2, Sparkles, X, BookOpen, Zap } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';
import { getModules, generateModule, type Module } from '../api';
import AuthRequired from '../components/AuthRequired';

function LearnContent() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await getModules();
      setModules(data);
      setError(null);
    } catch (err) {
      setError('Failed to load modules. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      // Trigger entrance animations after data loads
      setTimeout(() => setIsLoaded(true), 100);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleGenerateModule = async () => {
    if (!topic.trim()) {
      setGenerateError('Please enter a topic');
      return;
    }

    setGenerating(true);
    setGenerateError(null);

    try {
      const result = await generateModule(topic);
      if (result.success) {
        // Refresh the modules list
        await fetchModules();
        setShowGenerateModal(false);
        setTopic('');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Failed to generate module';
      setGenerateError(errorMessage);
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const suggestedTopics = [
    'Layer 2 Scaling Solutions',
    'Crypto Mining',
    'Stablecoins',
    'Blockchain Security',
    'Web3 Gaming',
    'Tokenomics'
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <BookOpen className="absolute inset-0 m-auto w-6 h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 animate-pulse">Loading modules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary btn-animated"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div 
            className={`transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">{modules.length} Modules Available</span>
            </div>
          </div>
          
          <h1 
            className={`text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Learning <span className="gradient-text-animated">Modules</span>
          </h1>
          
          <p 
            className={`text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Choose a module to begin your blockchain education journey.
            Complete lessons, take quizzes, and earn XP along the way.
          </p>
          
          {/* Generate New Module Button */}
          <button
            onClick={() => setShowGenerateModal(true)}
            className={`group mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:scale-105 btn-animated ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span>Generate New Module with AI</span>
            <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
          </button>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={`transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <ModuleCard module={module} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {modules.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No modules yet</h3>
            <p className="text-gray-400 mb-6">Generate your first module to get started!</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="btn-primary btn-animated"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Module
            </button>
          </div>
        )}
      </div>

      {/* Generate Module Modal */}
      {showGenerateModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !generating) {
              setShowGenerateModal(false);
              setTopic('');
              setGenerateError(null);
            }
          }}
        >
          <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 relative animate-scale-in border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <button
              onClick={() => {
                if (!generating) {
                  setShowGenerateModal(false);
                  setTopic('');
                  setGenerateError(null);
                }
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90"
              disabled={generating}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg animate-pulse">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Generate New Module</h2>
            </div>

            <p className="text-gray-400 mb-4">
              Enter a blockchain-related topic and our AI will create a complete learning module with lessons and quizzes.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Layer 2 Scaling Solutions"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                disabled={generating}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !generating && topic.trim()) {
                    handleGenerateModule();
                  }
                }}
              />
            </div>

            {/* Suggested Topics */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => setTopic(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-purple-500/30 hover:text-purple-300 hover:border-purple-500/50 border border-transparent transition-all duration-200 hover:scale-105"
                    disabled={generating}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {generateError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm animate-shake">
                {generateError}
              </div>
            )}

            <button
              onClick={handleGenerateModule}
              disabled={generating || !topic.trim()}
              className="group w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/30"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Module...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span>Generate Module</span>
                </>
              )}
            </button>

            {generating && (
              <div className="mt-4">
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shimmer" style={{ width: '60%' }} />
                </div>
                <p className="text-center text-gray-400 text-sm mt-3 animate-pulse">
                  This may take 10-30 seconds...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export wrapped component with auth requirement
export default function Learn() {
  return (
    <AuthRequired feature="Learning Modules">
      <LearnContent />
    </AuthRequired>
  );
}
