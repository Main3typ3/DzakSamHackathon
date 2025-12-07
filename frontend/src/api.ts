import axios from 'axios';

// Use environment variable for API URL, fallback to /api for local dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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

// Adventure Mode API
export interface Adventure {
  id: string;
  title: string;
  description: string;
  narrative_intro: string;
  challenges: Challenge[];
  narrative_conclusion: string;
  completion_xp: number;
  completion_badge?: string;
  completed?: boolean;
  user_progress?: {
    completed_challenges: string[];
    score: number;
    total_challenges: number;
  };
}

export interface Challenge {
  id: string;
  type: string;
  npc: string;
  narrative: string;
  question: string;
  choices: string[];
  correct: number;
  feedback_correct: string;
  feedback_incorrect: string;
  xp_reward: number;
}

export interface AdventureResponse {
  is_correct: boolean;
  feedback: string;
  xp_gained: number;
  chapter_complete: boolean;
  score: number;
  total_challenges: number;
  completion_xp?: number;
  leveled_up?: boolean;
  new_level?: number;
  new_badges?: Badge[];
}

export const getAdventures = async (userId = 'default'): Promise<Adventure[]> => {
  const response = await api.get(`/adventures?user_id=${userId}`);
  return response.data.adventures;
};

export const getAdventure = async (chapterId: string, userId = 'default'): Promise<Adventure> => {
  const response = await api.get(`/adventures/${chapterId}?user_id=${userId}`);
  return response.data.adventure;
};

export const submitAdventureAnswer = async (
  chapterId: string,
  challengeId: string,
  answer: number,
  userId = 'default'
): Promise<AdventureResponse> => {
  const response = await api.post(`/adventures/${chapterId}/answer`, {
    chapter_id: chapterId,
    challenge_id: challengeId,
    answer,
    user_id: userId,
  });
  return response.data;
};

export const generateModule = async (topic: string, userId = 'default'): Promise<{ success: boolean; module: Module; message: string }> => {
  const response = await api.post('/modules/generate', { topic, user_id: userId });
  return response.data;
};

export interface ContractGenerationResponse {
  success: boolean;
  contract: {
    code: string;
    explanation: string;
    warnings: string[];
  };
  xp_gained: number;
  leveled_up?: boolean;
  new_level?: number;
  new_badges: Badge[];
  contracts_generated: number;
}

export const generateContract = async (description: string, userId = 'default'): Promise<ContractGenerationResponse> => {
  const response = await api.post('/contracts/generate', { description, user_id: userId });
  return response.data;
};
