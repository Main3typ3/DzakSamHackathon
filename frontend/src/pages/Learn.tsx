import { useState, useEffect } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';
import { getModules, generateModule, type Module } from '../api';

export default function Learn() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

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
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Learning Modules</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose a module to begin your blockchain education journey.
            Complete lessons, take quizzes, and earn XP along the way.
          </p>
          
          {/* Generate New Module Button */}
          <button
            onClick={() => setShowGenerateModal(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Generate New Module with AI
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>

      {/* Generate Module Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => {
                setShowGenerateModal(false);
                setTopic('');
                setGenerateError(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                disabled={generating}
              />
            </div>

            {/* Suggested Topics */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setTopic(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition-colors"
                    disabled={generating}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {generateError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {generateError}
              </div>
            )}

            <button
              onClick={handleGenerateModule}
              disabled={generating || !topic.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Module...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Module
                </>
              )}
            </button>

            {generating && (
              <p className="text-center text-gray-400 text-sm mt-3">
                This may take 10-30 seconds...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
