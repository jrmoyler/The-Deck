import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import WorkoutSession from './views/WorkoutSession';
import Coach from './views/Coach';
import NavBar from './components/NavBar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/workout'; // Hide nav during active workout

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black relative shadow-2xl overflow-hidden">
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
      {showNav && <NavBar />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workout" element={<WorkoutSession />} />
          <Route path="/coach" element={<Coach />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
};

export default App;
