import type { Interview } from '../types';

const STORAGE_KEY = 'ai_interviewer_history';

export const saveInterview = (interview: Interview): void => {
  const history = getInterviewHistory();
  const existingIndex = history.findIndex(i => i.id === interview.id);
  
  if (existingIndex >= 0) {
    history[existingIndex] = interview;
  } else {
    history.push(interview);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getInterviewHistory = (): Interview[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getInterviewById = (id: string): Interview | undefined => {
  const history = getInterviewHistory();
  return history.find(i => i.id === id);
};

export const deleteInterview = (id: string): void => {
  const history = getInterviewHistory().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};