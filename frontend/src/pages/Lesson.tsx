import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import Quiz from '../components/Quiz';
import { getLesson, completeLesson, submitQuiz, type Lesson as LessonType } from '../api';

export default function Lesson() {
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
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Lesson not found'}</p>
          <Link to="/learn" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      {notification && (
        <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg animate-float ${
          notification.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
        }`}>
          <div className="flex items-center space-x-2 text-white">
            {notification.type === 'success' && <Sparkles className="w-5 h-5" />}
            <span>{notification.message}</span>
            {notification.xp && (
              <span className="font-bold">+{notification.xp} XP</span>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Link
          to={`/module/${lesson.module_id}`}
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {lesson.module_title}
        </Link>

        <div className="bg-slate-800/50 rounded-2xl p-8 border border-purple-500/20 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
              <p className="text-gray-400">
                {lesson.duration} • {lesson.xp} XP
              </p>
            </div>
            {lessonCompleted && (
              <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Completed</span>
              </div>
            )}
          </div>

          {!showQuiz ? (
            <>
              <div className="markdown-content prose prose-invert max-w-none">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700 flex items-center justify-between">
                <button
                  onClick={handleComplete}
                  disabled={lessonCompleted || completing}
                  className={`px-6 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                    lessonCompleted
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
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
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Take Quiz</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setQuizResults(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Lesson</span>
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6">Quiz Time!</h2>
              <Quiz
                questions={lesson.quiz}
                onSubmit={handleQuizSubmit}
                results={quizResults}
                loading={submitting}
              />

              {quizResults && (
                <div className="mt-8 pt-6 border-t border-slate-700 flex justify-center">
                  <button
                    onClick={() => navigate(`/module/${lesson.module_id}`)}
                    className="btn-primary"
                  >
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
