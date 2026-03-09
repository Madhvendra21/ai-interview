import type { InterviewConfig, Message, Evaluation } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const startInterview = async (config: InterviewConfig): Promise<{ message: string; interviewId: string }> => {
  const response = await fetch(`${API_URL}/api/start-interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data;
};

export const sendMessage = async (message: string, history: Message[], skillType: string): Promise<string> => {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, skillType }),
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.message;
};

export const evaluateInterview = async (history: Message[], skillType: string): Promise<Evaluation> => {
  const response = await fetch(`${API_URL}/api/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, skillType }),
  });
  
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.evaluation;
};