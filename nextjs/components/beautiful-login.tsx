'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client-hono';
import { useRouter } from 'next/navigation';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { ForgotPasswordForm } from './forgot-password-form';
import { AuthHeader } from './auth-header';
import { LoggedIn } from './logged-in';

export default function BeautifulLogin() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [ currentView, setCurrentView ] = useState<'login' | 'register' | 'forgot-password' | 'loggedin'>('login');
  const [ viewFromUrl, setViewFromUrl ] = useState<'login' | 'register' | 'forgot-password' | 'loggedin' | null>(null);

  // Get view from query parameter using useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view') as 'login' | 'register' | 'forgot-password' | null;
      if (viewParam) {
        setViewFromUrl(viewParam);
      }
    }
  }, []);

  const updateView = (view: 'login' | 'register' | 'forgot-password') => {
    setCurrentView(view);
  };

  const handleSwitchToRegister = () => updateView('register');
  const handleSwitchToLogin = () => updateView('login');
  const handleSwitchToForgotPassword = () => updateView('forgot-password');

  // Reset to login view when user logs out
  useEffect(() => {
    if(viewFromUrl) {
      setCurrentView(viewFromUrl);
    } else if (session && !viewFromUrl) {
      setCurrentView('loggedin');
    } else {
      setCurrentView('login');
    }
  }, [session, viewFromUrl]);

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