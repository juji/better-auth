import React from 'react';
import { signUp, signIn, useSession } from '@/lib/auth-client-hono';
import { SocialButtons } from './social-buttons';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const { refetch } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting registration:', { email });

    try {
      console.log('Calling signUp.email');
      const result = await signUp.email({
        email,
        password,
        name: email.split('@')[0], // Use email prefix as name
      });
      console.log('signUp.email result:', result);

      // Check if the result contains an error
      if (result?.error) {
        console.log('Signup error in result:', result.error);
        setError(result.error.message || 'Registration failed');
        return;
      }

      console.log('Registration successful - refreshing session');
      // After successful registration, refresh the session
      refetch();

      console.log('Registration successful');
      // Clear form fields after successful registration
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Join Us</h2>
        <p className="text-gray-300">Create your new account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/70 border border-red-500/50 rounded-lg text-red-100 text-sm flex items-start">
          <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Registration Error</p>
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
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

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
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          Already have an account? <span className="font-semibold">Sign In</span>
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-sm"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500/20 rounded-full blur-sm"></div>
    </div>
    </div>
    </div>
  );
}