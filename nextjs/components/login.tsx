'use client';

import { useId, useState } from 'react';

export type OnSignInParams = { 
  email: string
  password: string
  rememberMe: boolean
  fetchOptions?: {
    onSuccess?: () => void;
    onError?: ( err: string ) => void;
  }
};

type LoginFormProps = {
  className?: string
  onSignIn: (params: OnSignInParams) => Promise<void>
  title: string
  onRegisterClicked: () => void
  onForgotPasswordClicked: () => void
}

export function LoginForm({ 
  className = '', 
  onSignIn, title, 
  onRegisterClicked, 
  onForgotPasswordClicked 
}: LoginFormProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('remember') === 'on';

    await onSignIn({ 
      email, 
      password, 
      rememberMe,
      fetchOptions: {
        onSuccess: () => {
          setIsLoading(false);
          setError(null);
        },
        onError: (err) => {
          setError(err)
          setIsLoading(false);
        }
      }
    });
  }

  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  return (
    <div className={`p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
              dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id={passwordId}
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
              dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id={rememberId}
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 
                border-gray-300 rounded"
            />
            <label htmlFor={rememberId} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <button
              onClick={onForgotPasswordClicked}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
            rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Don't have an account?{' '}
        <button onClick={onRegisterClicked} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
          Create one
        </button>
      </p>
    </div>
  );
}
