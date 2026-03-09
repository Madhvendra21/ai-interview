import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { InterviewProvider } from './contexts/InterviewContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Interview from './pages/Interview';
import Results from './pages/Results';
import History from './pages/History';

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== '/interview';

  return (
    <>
      {showNav && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <InterviewProvider>
      <Router>
        <AppContent />
      </Router>
    </InterviewProvider>
  );
}

export default App;