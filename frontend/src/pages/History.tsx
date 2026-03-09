import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviewHistory, deleteInterview, clearHistory } from '../services/storage';
import type { Interview } from '../types';
import { Calendar, Clock, Trash2, Eye, Award, AlertTriangle } from 'lucide-react';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    setInterviews(getInterviewHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteInterview(id);
    setInterviews(getInterviewHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setInterviews([]);
    setShowConfirmClear(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSkillLabel = (skillType: string) => {
    const labels: Record<string, string> = {
      coding: 'Coding',
      system_design: 'System Design',
      behavioral: 'Behavioral',
      dsa: 'DSA',
      tech_stack: 'Tech Stack',
    };
    return labels[skillType] || skillType;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back Home
            </button>
            {interviews.length > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No interviews yet</h2>
            <p className="text-gray-500 mb-6">Complete your first interview to see it here</p>
            <button
              onClick={() => navigate('/setup')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((interview) => (
                <div
                  key={interview.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getSkillLabel(interview.config.skillType)} Interview
                        </h3>
                        {interview.completed && interview.evaluation && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            interview.evaluation.overallScore >= 8
                              ? 'bg-green-100 text-green-700'
                              : interview.evaluation.overallScore >= 6
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            Score: {interview.evaluation.overallScore.toFixed(1)}/10
                          </span>
                        )}
                        {!interview.completed && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                            In Progress
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(interview.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {interview.config.duration} min
                        </span>
                        <span className="capitalize">{interview.config.difficulty}</span>
                      </div>

                      {interview.completed && interview.evaluation && (
                        <div className="mt-3 flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            {interview.evaluation.strengths.length} strengths identified
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // TODO: Load interview into context and navigate
                          navigate('/results');
                        }}
                        disabled={!interview.completed}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="View Results"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(interview.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Confirm Clear Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900">Clear All History?</h2>
              </div>
              <p className="text-gray-600 mb-6">
                This will permanently delete all {interviews.length} interview records. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;