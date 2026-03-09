import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import { SKILL_TYPES, DIFFICULTY_LEVELS } from '../types';
import { Code, Layout, Users, Database, Layers } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-6 h-6" />,
  Layout: <Layout className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
};

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { startNewInterview, isLoading } = useInterview();
  
  const [skillType, setSkillType] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('intermediate');
  const [techStack, setTechStack] = useState<string>('');
  const [duration, setDuration] = useState<number>(30);

  const handleStart = async () => {
    if (!skillType) return;
    
    await startNewInterview({
      skillType: skillType as any,
      difficulty: difficulty as any,
      techStack: skillType === 'tech_stack' ? techStack : undefined,
      duration,
    });
    
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Configure Your Interview</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Skill Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">Select Skill Type</label>
            <div className="grid md:grid-cols-3 gap-4">
              {SKILL_TYPES.map((skill) => (
                <button
                  key={skill.value}
                  onClick={() => setSkillType(skill.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    skillType === skill.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={skillType === skill.value ? 'text-blue-600' : 'text-gray-600'}>
                      {iconMap[skill.icon]}
                    </div>
                    <span className="font-medium text-gray-900">{skill.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack Input (conditional) */}
          {skillType === 'tech_stack' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specify Tech Stack</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React, Node.js, Python"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Difficulty Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">Difficulty Level</label>
            <div className="flex gap-4">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setDifficulty(level.value)}
                  className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    difficulty === level.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Estimated Duration: {duration} minutes
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>10 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleStart}
              disabled={!skillType || isLoading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Starting...' : 'Start Interview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;