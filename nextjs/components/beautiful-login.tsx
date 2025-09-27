'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from '@/lib/auth-client-hono';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { AuthHeader } from './auth-header';
import { LoggedIn } from './logged-in';

export default function BeautifulLogin() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  const { data: session, isPending } = useSession();

  console.log('Session state:', { session, isPending });

    // Temporary debug: force show form if there's an error
  const shouldShowForm = !session;

  const handleSwitchToRegister = () => setCurrentView('register');
  const handleSwitchToLogin = () => setCurrentView('login');

  // Reset to login view when user logs out
  useEffect(() => {
    if (!session) {
      setCurrentView('login');
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Heading and description */}
        <AuthHeader />

        {/* Right side - Login form or success state */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            {/* Glassmorphism card */}
            <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl">
              {session && !shouldShowForm ? (
                <LoggedIn />
              ) : (
                /* Login/Register forms */
                <>

                  {currentView === 'login' ? (
                    <LoginForm onSwitchToRegister={handleSwitchToRegister} />
                  ) : (
                    <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
                  )}

                </>
              )}

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-sm"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}