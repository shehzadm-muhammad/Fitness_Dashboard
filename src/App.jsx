import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Auth from './components/Auth';
import Signup from './components/Signup';
import WelcomePage from './components/WelcomePage';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import ProgressChart from './components/ProgressChart';
import GoalsPage from './components/GoalsPage';
import Profile from './pages/Profile';


// ✅ Dark mode utility
const applySavedTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const toggleDarkMode = () => {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// ✅ Background wrapper with route-specific backgrounds
const BackgroundWrapper = ({ children }) => {
  const location = useLocation();
  const routeBackgrounds = {
    '/dashboard':
      'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1600&q=80',
    '/profile':
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1170&auto=format&fit=crop',
    '/signup':
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80',
    '/goals':
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1350&q=80',
    '/auth':
      'https://images.unsplash.com/photo-1573496267526-08a69e46a409?auto=format&fit=crop&w=1600&q=80',
    '/': 'https://images.unsplash.com/photo-1588776814546-ec7ff225d982?auto=format&fit=crop&w=1600&q=80',
    '/activities':
      'https://images.unsplash.com/photo-1594737625785-cb9f23fe4d69?auto=format&fit=crop&w=1600&q=80',
  };
  const backgroundImage =
    routeBackgrounds[location.pathname] || routeBackgrounds['/'];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative dark:bg-gray-900"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const App = () => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    applySavedTheme();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <Router>
      <BackgroundWrapper>
        <div className="px-4 py-8">
          <nav className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm z-50 p-4 flex justify-between items-center mb-6 max-w-5xl mx-auto rounded-lg">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              🏋️ FitTrack
            </h1>
            <div className="space-x-4 text-sm font-medium">
              <Link
                to="/"
                className="text-blue-600 hover:underline dark:text-blue-300"
              >
                🏠 Home
              </Link>
              <Link
                to="/goals"
                className="text-blue-600 hover:underline dark:text-blue-300"
              >
                🎯 Goals
              </Link>
              <Link
                to="/profile"
                className="text-blue-600 hover:underline dark:text-blue-300"
              >
                👤 Profile
              </Link>
              <Link
                to="/activities"
                className="text-blue-600 hover:underline dark:text-blue-300"
              >
                🏃 Activities
              </Link>

              <button
                onClick={toggleDarkMode}
                className="text-xs bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded transition"
              >
                🌓 Toggle Theme
              </button>
              {session && (
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded shadow-md hover:from-red-600 hover:to-pink-700 transition"
                >
                  🚪 Sign Out
                </button>
              )}
            </div>
          </nav>

          {/* ✅ ROUTES */}
          <Routes>
            {!session ? (
              <>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route
                  path="/dashboard"
                  element={<Dashboard session={session} />}
                />
                <Route
                  path="/goals"
                  element={<GoalsPage user={session.user} />}
                />
                <Route
                  path="/profile"
                  element={<Profile session={session} />}
                />
                <Route path="*" element={<Navigate to="/dashboard" />} />
                
              </>
            )}
          </Routes>
        </div>
      </BackgroundWrapper>
    </Router>
  );
};

export default App;
