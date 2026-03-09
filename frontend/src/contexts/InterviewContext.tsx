import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Interview, InterviewConfig, Message, Evaluation } from '../types';
import { startInterview, sendMessage, evaluateInterview } from '../services/api';
import { saveInterview } from '../services/storage';

interface InterviewContextType {
  currentInterview: Interview | null;
  isLoading: boolean;
  error: string | null;
  startNewInterview: (config: InterviewConfig) => Promise<void>;
  sendUserMessage: (message: string) => Promise<void>;
  completeInterview: () => Promise<Evaluation | null>;
  clearError: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentInterview, setCurrentInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewInterview = useCallback(async (config: InterviewConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await startInterview(config);
      
      const newInterview: Interview = {
        id: response.interviewId,
        date: new Date().toISOString(),
        config,
        messages: [{ role: 'model', content: response.message }],
        completed: false,
      };
      
      setCurrentInterview(newInterview);
      saveInterview(newInterview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendUserMessage = useCallback(async (message: string) => {
    if (!currentInterview) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedMessages: Message[] = [
        ...currentInterview.messages,
        { role: 'user', content: message },
      ];
      
      const response = await sendMessage(message, currentInterview.messages, currentInterview.config.skillType);
      
      const finalMessages: Message[] = [
        ...updatedMessages,
        { role: 'model', content: response },
      ];
      
      const updatedInterview: Interview = {
        ...currentInterview,
        messages: finalMessages,
      };
      
      setCurrentInterview(updatedInterview);
      saveInterview(updatedInterview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [currentInterview]);

  const completeInterview = useCallback(async (): Promise<Evaluation | null> => {
    if (!currentInterview) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const evaluation = await evaluateInterview(currentInterview.messages, currentInterview.config.skillType);
      
      const completedInterview: Interview = {
        ...currentInterview,
        evaluation,
        completed: true,
      };
      
      setCurrentInterview(completedInterview);
      saveInterview(completedInterview);
      
      return evaluation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate interview');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentInterview]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <InterviewContext.Provider
      value={{
        currentInterview,
        isLoading,
        error,
        startNewInterview,
        sendUserMessage,
        completeInterview,
        clearError,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};