'use client'

import { Session, User } from "better-auth"
import { Passkey } from "better-auth/plugins/passkey"
import { useEffect, useId, useState } from "react"
import useSWR from 'swr'


export type OnChangePasswordParams = {
  oldPassword: string
  newPassword: string
  fetchOptions?: {
    onSuccess?: () => void;
    onError?: ( err: string ) => void;
  }
}

const fetcher = (url: string, options?: RequestInit) => fetch(url, {
  ...options||{},
  ...url.startsWith('http') && !url.startsWith(window.location.origin) ? {
    mode: 'cors',
    credentials: 'include'
  } : {}
}).then(res => res.json())

function AccessProtectedResource({ url }: { url: string }) {

  const { data, error, isLoading } = useSWR(url, fetcher)
  const [ showData, setShowData ] = useState<boolean>(false);

  function toggleData() {
    setShowData(!showData);
  }

  return isLoading ? <p>Accessing protected resource...</p> : 
    error ? <p className="text-red-500">Error accessing protected resource: {error instanceof Error ? error.message : 'Unknown error'}</p> : 
    <div>
      <p className="text-green-500">
        Protected resource accessed successfully:&nbsp;
        <button className={`text-white underline cursor-pointer`} onClick={toggleData}>{showData ? 'Hide data' : 'Show data'}</button>
      </p>
      {showData ? (
        <blockquote className="p-4 bg-gray-100 dark:bg-gray-800 rounded my-2 overflow-x-scroll">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </blockquote> 
      ) : null}
    </div>
}

function ChangePasswordForm({
  onChangePassword,
}:{
  onChangePassword: (params: OnChangePasswordParams) => void
}){

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

  const oldPasswordId = useId()
  const newPasswordId = useId()

  function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    setIsChangingPassword(true);
    onChangePassword({
      oldPassword,
      newPassword,
      fetchOptions: {
        onSuccess: () => {
          setChangePasswordError(null);
          setIsChangingPassword(false);
          setChangePasswordSuccess('Password changed successfully');
          form.reset();
        },
        onError: (err) => {
          setChangePasswordError(err);
          setIsChangingPassword(false);
          form.reset();
        }
      }
    });
  }

  const [ isOpen, setIsOpen ] = useState<boolean>(false);

  return (
      <div className="my-6 p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">

        <div className="flex justify-between">
          <h3>Change Password</h3>
          <button type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer">{isOpen ? 'Close' : 'Open'}</button>
        </div>
        { isOpen ? (<form onSubmit={changePassword}>
          {changePasswordSuccess && <p className="text-green-500">{changePasswordSuccess}</p>}
          {changePasswordError && <p className="text-red-500">{changePasswordError}</p>}
          <br />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor={oldPasswordId}>Old Password</label>
            <input
              type="password"
              name="oldPassword"
              id={oldPasswordId}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor={newPasswordId}>New Password</label>
            <input
              type="password"
              name="newPassword"
              id={newPasswordId}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            disabled={isChangingPassword}
            type="submit"
            className="mt-2 mb-0 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium 
              rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>) : null }
        
      </div>
  );

}

function SessionList({ 
  sessions,
  currentSession,
  addSession,
  revokeSession,
  activateSession
}: { 
  currentSession: {session: Session, user: User},
  sessions: {session: Session, user: User}[],
  addSession?: () => void,
  revokeSession?: (session: Session) => void,
  activateSession?: (session: Session) => void
}) {

  console.log('Rendering SessionList with sessions:', sessions);
  console.log('Current session:', currentSession);

  return (<>
    <div className="my-1 mb-8 p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
      <h3 className="mb-4 flex justify-between items-center">
        Sessions
        <small className="text-gray-500 dark:text-gray-400 text-sm">({sessions.length} active)</small>
      </h3>
      {sessions.length === 0 ? (
        <p>No active sessions.</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map(({ session, user }, index) => (
            <li key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded">
              <p><strong>Token:</strong> {session.token}</p>
              <p><strong>User:</strong> {user.email} {user.name ? `(${user.name})` : ''}</p>
              <p><strong>Created At:</strong> {new Date(session.createdAt).toLocaleString()}</p>
              {sessions.length > 1 && session.token === currentSession.session.token ? (
                <p className="flex justify-between mt-1">
                  <span className="text-green-600 font-semibold">current session.</span>
                  <button onClick={() => revokeSession && revokeSession(session)} className="text-red-400 hover:text-red-200 cursor-pointer">Revoke</button>
                </p>
              ) : <p className="flex justify-between mt-1">
                <button onClick={() => activateSession && activateSession(session)} className="text-blue-400 hover:text-blue-200 cursor-pointer">Activate</button>
                <button onClick={() => revokeSession && revokeSession(session)} className="text-red-400 hover:text-red-200 cursor-pointer">Revoke</button>
              </p>}
            </li>
          ))}
        </ul>
      )}

      {/* Add Session button */}
    {addSession ? (
      <div className="pt-1 mt-5">
        <button
          onClick={() => {
            addSession();
          }}
          className="p-2 bg-amber-700 hover:bg-amber-600 text-white font-medium cursor-pointer
            rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
            w-full"
        >
          Add Session
        </button>
      </div>
    ) : null}
    </div>
    
  </>);
}

export function Authenticated({
  session,
  onSignOut,
  onChangePassword,
  hello = 'Hello',
  protectedResourceUrl,
  onPasskeyRegistration,
  listSessions,
  addSession,
  revokeSession,
  activateSession
}: {
  session: { user: User, session: Session },
  onSignOut: () => void
  onChangePassword: (params: OnChangePasswordParams) => void
  hello?: string
  protectedResourceUrl?: string
  onPasskeyRegistration?: () => void
  listSessions?: () => Promise<{session: Session, user: User}[] | null>
  addSession?: () => void
  revokeSession?: (session: Session) => void
  activateSession?: (session: Session) => void
}) {

  const [ sessions, setSessions ] = useState<{session: Session, user: User}[] | null>(null);

  useEffect(() => {
    if(listSessions){
      (async () => {
        const ss = await listSessions();
        setSessions(ss);
      })();
    }
  },[ listSessions ]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{hello}!</h2>
      <p className="mb-4">Welcome, {session.user.name || session.user.email}!</p>
      <p className="mb-4">You are logged in with the email: {session.user.email}</p>

      {protectedResourceUrl ? (
        <div className="py-1" key={session.session.token}>
          <AccessProtectedResource url={protectedResourceUrl} />
        </div>
      ) : null}

      <div className="py-1">
        <ChangePasswordForm onChangePassword={onChangePassword} />
      </div>

      { sessions ? (<SessionList 
        addSession={addSession} 
        revokeSession={revokeSession}
        activateSession={activateSession}
        sessions={sessions} 
        currentSession={session} />) : null }

      { onPasskeyRegistration ? (<div className="pb-1 mb-5">
        <button
          onClick={() => {
            onPasskeyRegistration();
          }}
          className="p-2 bg-amber-700 hover:bg-amber-600 text-white font-medium cursor-pointer
            rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
            w-full"
        >
          Register Passkey
        </button> 
      </div>) : null }

      <button
        onClick={() => {
          onSignOut()
        }}
        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer
          rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>
  );
}