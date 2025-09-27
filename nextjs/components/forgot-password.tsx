'use client';

import { useId, useState } from 'react';

export type ForgotPasswordSubmitParams = {
  email: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

interface ForgotPasswordProps {
  className?: string;
  title?: string;
  onSubmit: ( params: ForgotPasswordSubmitParams ) => Promise<void>;
  onLoginClicked: () => void; // Prop for handling back to login click
}

export function ForgotPassword({ 
  className = '', 
  title = 'Reset Password',
  onSubmit,
  onLoginClicked 
}: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  
  async function onSubmitLocal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    await onSubmit({
      email,
      onSuccess: () => {
        setEmailSent(true);
        setIsLoading(false);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      }
    });

  }

  const emailId = useId();

  return (
    <div className={`p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {emailSent ? (
        <div className="text-center">
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Password reset link has been sent to your email address.
          </div>
          <p className="mb-4">Please check your inbox and follow the instructions in the email.</p>
          <button
            onClick={onLoginClicked}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={onSubmitLocal} className="space-y-4">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Remember your password?{' '}
            <button onClick={onLoginClicked} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer">
              Back to login
            </button>
          </p>
        </>
      )}
    </div>
  );
}
