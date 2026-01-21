
import React, { useState, useEffect } from 'react';
import { View } from './types';
import LandingView from './views/LandingView';
import OnboardingView from './views/OnboardingView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);

  // Simple navigation listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toUpperCase();
      if (Object.values(View).includes(hash as View)) {
        setCurrentView(hash as View);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: View) => {
    window.location.hash = view.toLowerCase();
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING:
        return <LandingView onStart={() => navigate(View.ONBOARDING)} />;
      case View.ONBOARDING:
        return <OnboardingView onComplete={() => navigate(View.PROFILE)} onBack={() => navigate(View.LANDING)} />;
      case View.PROFILE:
        return (
          <ProfileView 
            onAdmin={() => navigate(View.ADMIN)} 
            onLogout={() => navigate(View.LANDING)} 
          />
        );
      case View.ADMIN:
        return <AdminView onLogout={() => navigate(View.LANDING)} onProfile={() => navigate(View.PROFILE)} />;
      default:
        return <LandingView onStart={() => navigate(View.ONBOARDING)} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark selection:bg-primary selection:text-black">
      {renderView()}
    </div>
  );
};

export default App;
