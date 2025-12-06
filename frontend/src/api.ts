import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xp: number;
  content: string;
  quiz: QuizQuestion[];
  completed?: boolean;
  module_id?: string;
  module_title?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface QuizResult {
  question: string;
  your_answer: string;
  correct_answer: string;
  is_correct: boolean;
  feedback: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
}

export interface UserStats {
  xp: number;
  level: number;
  level_progress: {
    current: number;
    needed: number;
    percentage: number;
  };
  badges: Badge[];
  completed_lessons: number;
  quiz_scores: Record<string, { score: number; total: number; date: string }>;
  ai_chat_count: number;
  correct_answers: number;
  all_badges: Badge[];
}

export interface ChatResponse {
  response: string;
  chat_count: number;
  new_badges: Badge[];
}

export const getModules = async (userId = 'default'): Promise<Module[]> => {
  const response = await api.get(`/modules?user_id=${userId}`);
  return response.data.modules;
};

export const getModule = async (moduleId: string, userId = 'default'): Promise<Module> => {
  const response = await api.get(`/modules/${moduleId}?user_id=${userId}`);
  return response.data.module;
};

export const getLesson = async (lessonId: string, userId = 'default'): Promise<Lesson> => {
  const response = await api.get(`/lessons/${lessonId}?user_id=${userId}`);
  return response.data.lesson;
};

export const completeLesson = async (lessonId: string, userId = 'default') => {
  const response = await api.post(`/lessons/${lessonId}/complete`, { lesson_id: lessonId, user_id: userId });
  return response.data;
};

export const submitQuiz = async (lessonId: string, answers: number[], userId = 'default') => {
  const response = await api.post(`/lessons/${lessonId}/quiz`, {
    lesson_id: lessonId,
    answers,
    user_id: userId,
  });
  return response.data;
};

export const sendChatMessage = async (message: string, userId = 'default'): Promise<ChatResponse> => {
  const response = await api.post('/chat', { message, user_id: userId });
  return response.data;
};

export const clearChatHistory = async () => {
  const response = await api.post('/chat/clear');
  return response.data;
};

export const getUserStats = async (userId = 'default'): Promise<UserStats> => {
  const response = await api.get(`/user/stats?user_id=${userId}`);
  return response.data.stats;
};

export const executeBlockchainTool = async (operation: string, params?: Record<string, unknown>) => {
  const response = await api.post('/tools/execute', { operation, params });
  return response.data;
};

export const getAvailableTools = async () => {
  const response = await api.get('/tools/list');
  return response.data;
};
