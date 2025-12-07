import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle, Sparkles, Loader2, Zap } from 'lucide-react';
import Quiz from '../components/Quiz';
import { getLesson, completeLesson, submitQuiz, type Lesson as LessonType } from '../api';
import AuthRequired from '../components/AuthRequired';

function LessonContent() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    xp?: number;
  } | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      try {
        const data = await getLesson(lessonId);
        setLesson(data);
        setLessonCompleted(data.completed || false);
      } catch (err) {
        setError('Failed to load lesson. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleComplete = async () => {
    if (!lessonId || lessonCompleted) return;
    
    setCompleting(true);
    try {
      const result = await completeLesson(lessonId);
      setLessonCompleted(true);
      
      if (!result.already_completed) {
        setNotification({
          type: 'success',
          message: result.leveled_up ? 'Lesson completed! Level Up!' : 'Lesson completed!',
          xp: result.xp_gained,
        });
        
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: 'Failed to mark lesson as complete',
      });
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizSubmit = async (answers: number[]) => {
    if (!lessonId) return;
    
    setSubmitting(true);
    try {
      const results = await submitQuiz(lessonId, answers);
      setQuizResults(results);
      
      if (results.xp_gained) {
        setNotification({
          type: 'success',
          message: results.leveled_up ? 'Quiz completed! Level Up!' : 'Quiz completed!',
          xp: results.xp_gained,
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="relative inline-block">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-purple-500/20 animate-ping"></div>
          </div>
          <p className="text-gray-400 mt-4 animate-pulse">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <p className="text-red-400 mb-4">{error || 'Lesson not found'}</p>
          <Link to="/learn" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
      </div>

      {/* XP Notification */}
      {notification && (
        <div className={`fixed top-24 right-4 z-50 animate-bounce-in`}>
          <div className={`p-4 rounded-xl shadow-xl ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : 'bg-gradient-to-r from-red-500 to-rose-500'
          }`}>
            <div className="flex items-center space-x-3 text-white">
              {notification.type === 'success' && <Sparkles className="w-5 h-5 animate-wiggle" />}
              <span className="font-semibold">{notification.message}</span>
              {notification.xp && (
                <span className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">+{notification.xp} XP</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          to={`/module/${lesson.module_id}`}
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-all duration-300 hover:-translate-x-1 animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {lesson.module_title}
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8 animate-fade-in-up animation-delay-100 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
              <p className="text-gray-400">
                {lesson.duration} • {lesson.xp} XP
              </p>
            </div>
            {lessonCompleted && (
              <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full animate-bounce-in">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Completed</span>
              </div>
            )}
          </div>

          {!showQuiz ? (
            <>
              <div className="markdown-content prose prose-invert max-w-none animate-fade-in-up animation-delay-200">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700 flex items-center justify-between animate-fade-in-up animation-delay-300">
                <button
                  onClick={handleComplete}
                  disabled={lessonCompleted || completing}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    lessonCompleted
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-slate-700 text-white hover:bg-slate-600 hover:scale-105'
                  }`}
                >
                  {completing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : lessonCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : null}
                  <span>{lessonCompleted ? 'Completed' : 'Mark as Complete'}</span>
                </button>

                {lesson.quiz && lesson.quiz.length > 0 && (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="btn-primary flex items-center space-x-2 group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span>Take Quiz</span>
                    <Sparkles className="w-4 h-4 group-hover:animate-wiggle" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 animate-fade-in-up">
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setQuizResults(null);
                  }}
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 hover:-translate-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Lesson</span>
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2 animate-fade-in-up animation-delay-100">
                <span>🎯</span>
                <span>Quiz Time!</span>
              </h2>
              <div className="animate-fade-in-up animation-delay-200">
                <Quiz
                  questions={lesson.quiz}
                  onSubmit={handleQuizSubmit}
                  results={quizResults}
                  loading={submitting}
                />
              </div>

              {quizResults && (
                <div className="mt-8 pt-6 border-t border-slate-700 flex justify-center animate-fade-in-up animation-delay-300">
                  <button
                    onClick={() => navigate(`/module/${lesson.module_id}`)}
                    className="btn-primary group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    Continue Learning
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Export wrapped component with auth requirement
export default function Lesson() {
  return (
    <AuthRequired feature="Lessons & Quizzes">
      <LessonContent />
    </AuthRequired>
  );
}
