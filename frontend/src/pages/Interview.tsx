import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const Interview: React.FC = () => {
  const navigate = useNavigate();
  const { currentInterview, isLoading, error, sendUserMessage, completeInterview, clearError } = useInterview();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentInterview) {
      navigate('/setup');
    }
  }, [currentInterview, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentInterview?.messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    await sendUserMessage(message);
  };

  const handleComplete = async () => {
    const evaluation = await completeInterview();
    if (evaluation) {
      navigate('/results');
    }
  };

  if (!currentInterview) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Interview</h1>
            <p className="text-sm text-gray-500 capitalize">
              {currentInterview.config.skillType.replace('_', ' ')} • {currentInterview.config.difficulty}
            </p>
          </div>
          <button
            onClick={handleComplete}
            disabled={isLoading || currentInterview.messages.length < 3}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Complete
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="container mx-auto flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={clearError} className="ml-auto text-sm underline">Dismiss</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl overflow-y-auto">
        <div className="space-y-6">
          {currentInterview.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white shadow-md border border-gray-200 text-gray-800'
                }`}
              >
                <div className="text-sm font-medium mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'AI Interviewer'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md border border-gray-200 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI is typing...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};

export default Interview;