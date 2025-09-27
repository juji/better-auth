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
        {/* Left side - Heading and description or logged in state */}
        {session && !shouldShowForm ? (
          <LoggedIn />
        ) : (
          <AuthHeader />
        )}

        {/* Right side - Login form or success state */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            {!session ? (
              /* Login/Register forms */
              <>

                {currentView === 'login' ? (
                  <LoginForm onSwitchToRegister={handleSwitchToRegister} />
                ) : (
                  <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
                )}

              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}