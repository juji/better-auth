import React from 'react';
import { signIn, useSession, passkey } from '@/lib/auth-client-hono';
import { SocialButtons } from './social-buttons';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onSwitchToRegister, onSwitchToForgotPassword, onSuccess }: LoginFormProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(15);

  const { refetch } = useSession();

  // Countdown timer for magic link success message
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (magicLinkSent && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setMagicLinkSent(false);
      setCountdown(15);
    }
    return () => clearInterval(interval);
  }, [magicLinkSent, countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login:', { email, password: password ? '***' : 'empty' });

    try {
      // Check if password is empty - use magic link
      if (!password || password.trim() === '') {
        console.log('Password empty - using magic link authentication');
        const result = await signIn.magicLink({
          email,
          callbackURL: window.location.origin + '/protected',
          newUserCallbackURL: window.location.origin + '/protected',
          errorCallbackURL: window.location.origin + '/?error=magic-link-failed',
        });
        console.log('Magic link result:', result);

        if (result?.error) {
          console.log('Magic link error:', result.error);
          setError(result.error.message || 'Failed to send magic link');
          return;
        }

        console.log('Magic link sent successfully');
        setError('');
        setMagicLinkSent(true);
        return;
      }

      // Regular email/password login
      console.log('Using email/password authentication');
      const result = await signIn.email({
        email,
        password,
        rememberMe,
      });
      console.log('signIn.email result:', result);

      // Check if the result contains an error
      if (result?.error) {
        console.log('Login error in result:', result.error);
        setError(result.error.message || 'Invalid email or password');
        return;
      }

      console.log('Login successful - refreshing session');
      // After successful login, refresh the session
      refetch();

      console.log('Authentication successful');
      // Clear form fields after successful login
      setEmail('');
      setPassword('');
      
      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setIsPasskeyLoading(true);
    setError('');

    try {
      console.log('Attempting passkey login');
      const result = await signIn.passkey({
        autoFill: false,
      });
      console.log('Passkey login result:', result);

      if (result?.error) {
        console.log('Passkey login error:', result.error);
        setError(result.error.message || 'Passkey authentication failed');
        return;
      }

      console.log('Passkey login successful - refreshing session');
      refetch();

      console.log('Passkey authentication successful');
      onSuccess?.();
    } catch (err: any) {
      console.error('Passkey login error:', err);
      setError(err.message || 'An error occurred during passkey authentication');
    } finally {
      setIsPasskeyLoading(false);
    }
  };
  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {magicLinkSent ? (
            // Magic link sent success message
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email!</h2>
                <p className="text-gray-300 mb-4">
                  We've sent a magic link to <span className="font-semibold text-purple-400">{email}</span>
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Click the link in your email to sign in instantly. No password required!
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <p className="text-gray-300 text-sm">
                    Returning to login form in <span className="font-bold text-purple-400">{countdown}</span> seconds...
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(countdown / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMagicLinkSent(false);
                    setCountdown(15);
                  }}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </div>
          ) : (
            // Regular login form
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
                <p className="text-gray-300">Sign in to your account</p>
              </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/70 border border-red-500/50 rounded-lg text-red-100 text-sm flex items-start">
          <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Login Error</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
            required={false}
          />
          <p className="mt-1 text-xs text-gray-400 text-right">
            Leave empty for passwordless login
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center ${
                  rememberMe
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-600'
                    : 'bg-black/30 border-white/20 hover:border-white/40'
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300 cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {!password && email ? 'Sending Magic Link...' : 'Signing In...'}
            </div>
          ) : (
            !password && email ? 'Send Magic Link' : 'Sign In'
          )}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handlePasskeyLogin}
          disabled={isPasskeyLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
        >
          {isPasskeyLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Authenticating...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Sign In with Passkey
            </div>
          )}
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black/20 text-gray-300">Or continue with</span>
          </div>
        </div>

        <SocialButtons onError={setError} />
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          Don't have an account? <span className="font-semibold">Sign Up</span>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-sm"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500/20 rounded-full blur-sm"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}