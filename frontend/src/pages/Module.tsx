import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Zap, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { getModule, type Module as ModuleType, type Lesson } from '../api';

export default function Module() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<ModuleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      if (!moduleId) return;
      try {
        const data = await getModule(moduleId);
        setModule(data);
      } catch (err) {
        setError('Failed to load module. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="relative inline-block">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-purple-500/20 animate-ping"></div>
          </div>
          <p className="text-gray-400 mt-4 animate-pulse">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <p className="text-red-400 mb-4">{error || 'Module not found'}</p>
          <Link to="/learn" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = module.lessons.filter(l => l.completed).length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          to="/learn"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-all duration-300 hover:-translate-x-1 animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Link>

        <div className={`bg-gradient-to-r ${module.color} p-[1px] rounded-2xl mb-8 animate-fade-in-up animation-delay-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300`}>
          <div className="bg-slate-900 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">{module.title}</h1>
            <p className="text-gray-400 mb-4">{module.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{module.lessons.length} lessons</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <CheckCircle className="w-4 h-4" />
                <span>{completedCount} / {module.lessons.length} completed</span>
              </div>
            </div>

            <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000 ease-out`}
                style={{ width: `${(completedCount / module.lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {module.lessons.map((lesson: Lesson, index: number) => (
            <Link
              key={lesson.id}
              to={`/lesson/${lesson.id}`}
              className="block group animate-fade-in-up"
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                lesson.completed
                  ? 'border-green-500/30 hover:border-green-500/50 hover:shadow-green-500/10'
                  : 'border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      lesson.completed
                        ? 'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20'
                        : 'bg-slate-700 text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-400'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold text-lg">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span>{lesson.xp} XP</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
