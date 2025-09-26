'use client';

import { useId, useState } from 'react';

export type onRegisterParams = {
  email: string
  password: string
  name: string,
  fetchOptions?: {
    onSuccess?: () => void;
    onError?: ( err: string ) => void;
  }
}

type RegisterFormProps = {
  className?: string
  onRegister: (params: onRegisterParams) => Promise<void>
  title: string
  onLoginClicked: () => void
}

export function RegisterForm({ className = '', onRegister, title, onLoginClicked }: RegisterFormProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if(password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    await onRegister({ email, password, name, fetchOptions: {
      onSuccess: () => {
        setIsLoading(false);
        setError(null);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      }
    }});

  }

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <div className={`p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title || 'Create an Account'}</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
              dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

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
            placeholder="Create a password"
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor={confirmPasswordId} className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id={confirmPasswordId}
            name="confirmPassword"
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
              dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
            rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <button onClick={onLoginClicked} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
          Sign in
        </button>
      </p>
    </div>
  );
}
