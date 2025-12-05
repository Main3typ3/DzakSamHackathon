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
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/learn"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Link>

        <div className={`bg-gradient-to-r ${module.color} p-[1px] rounded-2xl mb-8`}>
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

            <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${module.color}`}
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
              className="block group"
            >
              <div className={`bg-slate-800/50 rounded-xl p-6 border transition-all duration-200 ${
                lesson.completed
                  ? 'border-green-500/30 hover:border-green-500/50'
                  : 'border-purple-500/20 hover:border-purple-500/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.completed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700 text-gray-400'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
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
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
