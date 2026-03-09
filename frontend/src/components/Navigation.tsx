import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, History, PlusCircle } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Interviewer</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              to="/setup"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/setup')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">New Interview</span>
            </Link>
            
            <Link
              to="/history"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/history')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;