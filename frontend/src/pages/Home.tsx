import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code, LineChart, History } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Interviewer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice technical interviews with AI. Get instant feedback on coding, system design, 
            behavioral skills, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-blue-600" />}
            title="AI-Powered"
            description="Advanced Gemini AI provides realistic interview experiences"
          />
          <FeatureCard
            icon={<Code className="w-8 h-8 text-green-600" />}
            title="Multiple Skills"
            description="Coding, system design, DSA, behavioral, and tech stack"
          />
          <FeatureCard
            icon={<LineChart className="w-8 h-8 text-purple-600" />}
            title="Instant Feedback"
            description="Get detailed scores and personalized improvement tips"
          />
          <FeatureCard
            icon={<History className="w-8 h-8 text-orange-600" />}
            title="Track Progress"
            description="Review past interviews and monitor your improvement"
          />
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/setup')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default Home;