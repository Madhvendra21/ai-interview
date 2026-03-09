import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Star, TrendingUp, Award, RotateCcw, Home } from 'lucide-react';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { currentInterview } = useInterview();

  if (!currentInterview || !currentInterview.evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">No Results Available</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { evaluation, config } = currentInterview;
  
  const radarData = [
    { subject: 'Technical', A: evaluation.overallScore * 10, fullMark: 100 },
    { subject: 'Communication', A: Math.min(100, (evaluation.overallScore + 1) * 10), fullMark: 100 },
    { subject: 'Problem Solving', A: Math.min(100, (evaluation.overallScore + 0.5) * 10), fullMark: 100 },
    { subject: 'Knowledge', A: Math.min(100, (evaluation.overallScore + 0.3) * 10), fullMark: 100 },
    { subject: 'Approach', A: Math.min(100, (evaluation.overallScore + 0.7) * 10), fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Interview Results</h1>
        <p className="text-gray-600 text-center mb-12 capitalize">
          {config.skillType.replace('_', ' ')} • {config.difficulty} Level
        </p>

        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBg(evaluation.overallScore)} mb-4`}>
                <span className={`text-5xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore.toFixed(1)}
                </span>
              </div>
              <p className="text-lg text-gray-600">Overall Score</p>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(10)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(evaluation.overallScore) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Strengths</h2>
            </div>
            <ul className="space-y-3">
              {evaluation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Areas for Improvement</h2>
            </div>
            <ul className="space-y-3">
              {evaluation.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">→</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
          <p className="text-gray-700 leading-relaxed">{evaluation.detailedFeedback}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
          <button
            onClick={() => navigate('/setup')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            New Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;