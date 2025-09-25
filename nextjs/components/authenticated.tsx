'use client'

import { useEffect, useState } from "react"


export type OnChangePasswordParams = {
  oldPassword: string
  newPassword: string
  fetchOptions?: {
    onSuccess?: () => void;
    onError?: ( err: string ) => void;
  }
}

export function Authenticated({
  session,
  onSignOut,
  onChangePassword,
  hello = 'Hello'
}: {
  session: { user: { name?: string; email: string } },
  onSignOut: () => void
  onChangePassword: (params: OnChangePasswordParams) => void
  hello?: string
}) {

  const [ changePasswordError, setChangePasswordError ] = useState<string | null>(null);
  const [ changePasswordSuccess, setChangePasswordSuccess ] = useState<string | null>(null);
  const [ isChangingPassword, setIsChangingPassword ] = useState<boolean>(false);

  useEffect(() => {
    if(changePasswordSuccess) {
      const timer = setTimeout(() => {
        setChangePasswordSuccess(null);
      }, 5000); // Clear success message after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or when changePasswordSuccess changes
    }
  },[ changePasswordSuccess ])

  useEffect(() => {
    if(changePasswordError) {
      const timer = setTimeout(() => {
        setChangePasswordError(null);
      }, 5000); // Clear error message after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or when changePasswordError changes
    }
  },[ changePasswordError ])


  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{hello}!</h2>
      <p className="mb-4">Welcome, {session.user.name || session.user.email}!</p>
      <p className="mb-4">You are logged in with the email: {session.user.email}</p>

      <div className="mb-6 p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const oldPassword = formData.get('oldPassword') as string;
          const newPassword = formData.get('newPassword') as string;
          onChangePassword({ 
            oldPassword, 
            newPassword,
            fetchOptions: {
              onSuccess: () => {
                setChangePasswordError(null);
                setIsChangingPassword(false);
                setChangePasswordSuccess('Password changed successfully');
              },
              onError: (err) => {
                setChangePasswordError(err);
                setIsChangingPassword(false);
              }
            }
          });
        }}>
          <h3>Change Password</h3>
          {changePasswordSuccess && <p className="text-green-500">{changePasswordSuccess}</p>}
          {changePasswordError && <p className="text-red-500">{changePasswordError}</p>}
          <br />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            disabled={isChangingPassword}
            type="submit"
            className="mb-4 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium 
              rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Change Password
          </button>
        </form>
      </div>

      <button
        onClick={() => {
          onSignOut()
        }}
        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium 
          rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>
  );
}