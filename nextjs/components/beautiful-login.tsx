'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client-hono';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { ForgotPasswordForm } from './forgot-password-form';
import { AuthHeader } from './auth-header';
import { LoggedIn } from './logged-in';

export default function BeautifulLogin() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Get view from query parameter, default to 'login'
  const viewParam = searchParams.get('view') as 'login' | 'register' | 'forgot-password' | null;
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot-password' | 'loggedin'>(viewParam || 'login');

  console.log('Session state:', { session, isPending });

  const updateView = (view: 'login' | 'register' | 'forgot-password') => {
    setCurrentView(view);
    // Update URL with query parameter
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('view', view);
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleSwitchToRegister = () => updateView('register');
  const handleSwitchToLogin = () => updateView('login');
  const handleSwitchToForgotPassword = () => updateView('forgot-password');

  // Reset to login view when user logs out
  useEffect(() => {
    if (session && !viewParam) {
      setCurrentView('loggedin');
    } else {
      // When logging out, go back to login view
      const newView = viewParam || 'login';
      setCurrentView(newView);
    }
  }, [session, viewParam]);

  // Update view when query parameter changes
  useEffect(() => {
    if (viewParam && !session) {
      setCurrentView(viewParam);
    }
  }, [viewParam, session]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex p-4 lg:px-16`}>
      <div className={`
        w-full max-w-6xl gap-6 grid mx-auto grid-cols-1 lg:grid-cols-2
        py-16
      `}>
        
        <AuthHeader />

        {/* Right side - Login form or success state */}
        {currentView === 'login' ? (
          <LoginForm 
            onSwitchToRegister={handleSwitchToRegister} 
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
            onSuccess={() => { router.push('/protected') }} />
        ) : currentView === 'forgot-password' ? (
          <ForgotPasswordForm 
            onSwitchToLogin={handleSwitchToLogin}
            onSuccess={() => {}} />
        ) : currentView === 'loggedin' ? (
          // <LoggedInRight />
          <LoggedIn />
        ) : (
          <RegisterForm 
            onSwitchToLogin={handleSwitchToLogin}
            onSuccess={() => { router.push('/protected')}} />
        )}
      </div>
    </div>
  );
}