'use client';

import { useId, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

export type ResetPasswordSubmitParams = {
  token: string;
  password: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

interface ResetPasswordProps {
  className?: string;
  title?: string;
  onSubmit: (params: ResetPasswordSubmitParams) => Promise<void>;
  loginUrl?: string;
  forgotPasswordUrl?: string;
}

export function ResetPassword({ 
  className = '', 
  title = 'Reset Password',
  onSubmit,
  loginUrl = '/?state=nextjs-login',
  forgotPasswordUrl = '/?state=nextjs-forgot-password'
}: ResetPasswordProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordReset, setPasswordReset] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string; // Get the token from URL parameters

  if (!token) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md ${className}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Invalid or missing token. Please check your reset link.
        </div>
        <Link
          href={forgotPasswordUrl}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
            rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Forgot Password Form
        </Link>
      </div>
    );
  }
  
  async function onSubmitLocal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    await onSubmit({
      token,
      password,
      onSuccess: () => {
        setPasswordReset(true);
        setIsLoading(false);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      }
    });
  }

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <div className={`p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {passwordReset ? (
        <div className="text-center">
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Your password has been successfully reset.
          </div>
          <p className="mb-4">You can now log in with your new password.</p>
          <Link
            href={loginUrl}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Create a new password for your account.
          </p>
          
          <form onSubmit={onSubmitLocal} className="space-y-4">
            <div>
              <label htmlFor={passwordId} className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                id={passwordId}
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor={confirmPasswordId} className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                id={confirmPasswordId}
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Remember your password?{' '}
            <Link href={loginUrl} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
              Back to login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export function ResetPasswordWithSuspense(props: ResetPasswordProps) {
  return <Suspense fallback={<div>Loading...</div>}>
    <ResetPassword {...props} />
  </Suspense>
}