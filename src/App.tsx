import { useState, useEffect } from 'react';
import type { UserProfile, ScreeningResult, ScreeningSession } from './types';
import { DEFAULT_PROFILE, MOCK_HISTORY } from './utils/mockData';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScreeningFlow } from './pages/ScreeningFlow';
import { HistoryPage } from './pages/HistoryPage';
import { EducationPage } from './pages/EducationPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  // Navigation & routing state
  const [view, setView] = useState<
    'landing' | 'login' | 'register' | 'onboarding' | 'dashboard' | 'screening' | 'history' | 'profile' | 'education'
  >('landing');
  
  // App core state
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cardiolung_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [history, setHistory] = useState<ScreeningResult[]>(() => {
    const saved = localStorage.getItem('cardiolung_history');
    return saved ? JSON.parse(saved) : MOCK_HISTORY;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cardiolung_logged_in') === 'true';
  });

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  // Persist State
  useEffect(() => {
    localStorage.setItem('cardiolung_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('cardiolung_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('cardiolung_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  // Routing checks
  useEffect(() => {
    if (isLoggedIn && view === 'landing') {
      setView('dashboard');
    } else if (!isLoggedIn && view !== 'landing' && view !== 'login' && view !== 'register') {
      setView('landing');
    }
  }, [isLoggedIn, view]);

  // Handlers
  const handleLoginSuccess = (userName: string) => {
    setProfile(prev => ({ ...prev, name: userName }));
    setIsLoggedIn(true);
    setView('dashboard');
  };

  const handleRegisterSuccess = (userName: string) => {
    setProfile(prev => ({ ...prev, name: userName }));
    setIsLoggedIn(true);
    setView('onboarding');
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setView('dashboard');
  };

  const handleScreeningComplete = (session: ScreeningSession) => {
    if (session.result) {
      setHistory(prev => [...prev, session.result!]);
    }
    setView('dashboard');
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
  };

  // Render subviews
  const renderContent = () => {
    switch (view) {
      case 'landing':
        return (
          <LandingPage
            onStart={() => setView('login')}
            onLogin={() => { setView('login'); }}
            onRegister={() => { setView('register'); }}
          />
        );
      case 'login':
        return (
          <AuthPages
            type="login"
            onSuccess={handleLoginSuccess}
            onCancel={() => setView('landing')}
            onSwitchType={() => setView('register')}
          />
        );
      case 'register':
        return (
          <AuthPages
            type="register"
            onSuccess={handleRegisterSuccess}
            onCancel={() => setView('landing')}
            onSwitchType={() => setView('login')}
          />
        );
      case 'onboarding':
        return (
          <OnboardingPage
            onComplete={handleOnboardingComplete}
          />
        );
      case 'screening':
        return (
          <ScreeningFlow
            profile={profile}
            onCompleteSession={handleScreeningComplete}
            onCancel={() => setView('dashboard')}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            profile={profile}
            history={history}
            onStartNewScreening={() => setView('screening')}
            onViewReport={(_id) => {
              setView('history');
              // Highlight the report details (simulated in history page)
            }}
            onReadArticle={(id) => {
              setSelectedArticleId(id);
              setView('education');
            }}
          />
        );
      case 'history':
        return (
          <HistoryPage
            history={history}
            onViewReport={(id) => {
              // Standard layout will open details. For this mock, we trigger browser alert
              const item = history.find(h => h.id === id);
              if (item) {
                alert(`Detail Hasil Skrining #${id} (${new Date(item.date).toLocaleDateString()})\n\nSkor Kesehatan: ${item.score}/100\nKondisi Jantung: ${item.heartStatus.toUpperCase()}\nTemuan Jantung:\n- ${item.heartFindings.join('\n- ')}\n\nKondisi Paru: ${item.lungStatus.toUpperCase()}\nTemuan Paru:\n- ${item.lungFindings.join('\n- ')}`);
              }
            }}
            onClearHistory={handleClearHistory}
          />
        );
      case 'education':
        return (
          <EducationPage
            selectedArticleId={selectedArticleId}
            onSelectArticle={setSelectedArticleId}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            profile={profile}
            onUpdateProfile={setProfile}
            onLogout={handleLogout}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  // Nav highlights helper
  const isNavActive = (views: string[]) => {
    return views.includes(view) ? 'text-ink font-[500] border-b-2 border-ink pb-1' : 'text-graphite hover:text-ink pb-1';
  };

  const showNavbar = isLoggedIn && view !== 'onboarding' && view !== 'screening';

  return (
    <div className="min-h-screen bg-pure-white text-ink">
      
      {/* Global Header Bar */}
      {showNavbar && (
        <nav className="sticky top-0 bg-pure-white border-b border-dove/40 h-[64px] flex items-center px-6 z-40">
          <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
            
            {/* Logo */}
            <div 
              onClick={() => setView('dashboard')}
              className="flex items-center cursor-pointer space-x-2"
            >
              <img 
                src="/logo.png" 
                alt="AIRA Logo" 
                className="w-10 h-10 rounded-[10px] object-contain" 
              />
              <img 
                src="/name.png" 
                alt="AIRA" 
                className="h-7 object-contain" 
              />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-[24px] text-[15px] font-sohne font-[450] tracking-[-0.009em] h-[64px]">
              <button 
                onClick={() => setView('dashboard')}
                className={`transition-colors cursor-pointer ${isNavActive(['dashboard'])}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setView('history')}
                className={`transition-colors cursor-pointer ${isNavActive(['history'])}`}
              >
                Riwayat
              </button>
              <button 
                onClick={() => { setSelectedArticleId(null); setView('education'); }}
                className={`transition-colors cursor-pointer ${isNavActive(['education'])}`}
              >
                Edukasi
              </button>
              <button 
                onClick={() => setView('profile')}
                className={`transition-colors cursor-pointer ${isNavActive(['profile'])}`}
              >
                Profil
              </button>
            </div>

            {/* Header Right utilities */}
            <div className="flex items-center space-x-4">
              
              {/* Avatar Initial - Pastel Mint/Sky/Peach circle badge */}
              <div 
                onClick={() => setView('profile')}
                className="w-9 h-9 rounded-full bg-apricot-wash text-ink flex items-center justify-center font-sohne font-[500] text-[13px] cursor-pointer border border-rust/20 shadow-sm"
              >
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
            </div>

          </div>
        </nav>
      )}

      {/* Main Core View Area */}
      <div className="w-full">
        {renderContent()}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {showNavbar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-pure-white border-t border-dove/40 px-6 py-3 flex justify-between items-center z-40 shadow-lg">
          <button
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center space-y-0.5 cursor-pointer ${isNavActive(['dashboard'])}`}
          >
            <span className="text-[12px] font-sohne font-[450]">Dashboard</span>
          </button>
          
          <button
            onClick={() => setView('history')}
            className={`flex flex-col items-center space-y-0.5 cursor-pointer ${isNavActive(['history'])}`}
          >
            <span className="text-[12px] font-sohne font-[450]">Riwayat</span>
          </button>

          <button
            onClick={() => { setSelectedArticleId(null); setView('education'); }}
            className={`flex flex-col items-center space-y-0.5 cursor-pointer ${isNavActive(['education'])}`}
          >
            <span className="text-[12px] font-sohne font-[450]">Edukasi</span>
          </button>

          <button
            onClick={() => setView('profile')}
            className={`flex flex-col items-center space-y-0.5 cursor-pointer ${isNavActive(['profile'])}`}
          >
            <span className="text-[12px] font-sohne font-[450]">Profil</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default App;

