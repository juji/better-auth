'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { multiSession, useSession } from '@/lib/auth-client-hono';
import type { Session, User } from 'better-auth';

interface SessionWithUser {
  session: Session;
  user: User;
}

export default function MultiSessionPage() {
  const [sessions, setSessions] = useState<SessionWithUser[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: currentSession } = useSession();

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await multiSession.listDeviceSessions();
      if (error) {
        setError(error.message || 'Failed to load sessions');
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      setError('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleAddSession = () => {
    // Redirect to home page with login view to create a new session
    router.push('/?view=login');
  };

  const handleActivateSession = async (session: Session) => {
    try {
      const { error } = await multiSession.setActive({
        sessionToken: session.token
      });
      if (error) {
        setError(error.message || 'Failed to activate session');
      } else {
        // Refresh the session list
        await loadSessions();
      }
    } catch (err) {
      setError('Failed to activate session');
    }
  };

  const handleRevokeSession = async (session: Session) => {
    try {
      const { error } = await multiSession.revoke({
        sessionToken: session.token
      });
      if (error) {
        setError(error.message || 'Failed to revoke session');
      } else {
        // Refresh the session list
        await loadSessions();
      }
    } catch (err) {
      setError('Failed to revoke session');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  const getDeviceInfo = (session: Session) => {
    const userAgent = session.userAgent || '';
    if (userAgent.includes('Mobile')) return '📱 Mobile';
    if (userAgent.includes('Tablet')) return '📱 Tablet';
    if (userAgent.includes('Windows')) return '💻 Windows';
    if (userAgent.includes('Mac')) return '💻 macOS';
    if (userAgent.includes('Linux')) return '💻 Linux';
    return '💻 Device';
  };

  return (
    <div className="text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Multiple Sessions</h1>
          <p className="text-gray-300 mb-4">
            Manage your active sessions across different devices and browsers.
          </p>
          <div className="p-4 bg-slate-500/10 border border-slate-500/20 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-2">How do I get multiple sessions?</h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong>Multiple devices:</strong> Log in from different devices (phone, tablet, computer)</li>
              <li>• <strong>Multiple browsers:</strong> Use different browsers on the same device</li>
              <li>• <strong>Incognito/Private mode:</strong> Each private browsing session creates a new session</li>
              <li>• <strong>Add New Session button:</strong> Click here to create an additional session</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-xl p-6 shadow-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-300">Loading sessions...</span>
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Your Sessions ({sessions.length})
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddSession}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded transition-all duration-200 cursor-pointer text-sm shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95"
                  >
                    Add New Session
                  </button>
                  <button
                    onClick={loadSessions}
                    className="px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded transition-all duration-200 cursor-pointer text-sm shadow-lg hover:shadow-gray-500/25 transform hover:scale-105 active:scale-95"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {sessions.map((sessionData, index) => (
                <div
                  key={sessionData.session.id || index}
                  className="p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">{getDeviceInfo(sessionData.session)}</span>
                        <div className="flex items-center space-x-2">
                          {currentSession?.session?.id === sessionData.session.id && (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
                              Current Session
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-400 space-y-1">
                        <div>
                          <span className="font-medium">User:</span> {sessionData.user.email}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span> {sessionData.session.ipAddress || 'Unknown'}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(sessionData.session.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Last Active:</span> {formatDate(sessionData.session.updatedAt)}
                        </div>
                        {sessionData.session.userAgent && (
                          <div>
                            <span className="font-medium">Browser:</span> {sessionData.session.userAgent}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {currentSession?.session?.id !== sessionData.session.id && (
                        <button
                          onClick={() => handleActivateSession(sessionData.session)}
                          className="px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-amber-500/25 transform hover:scale-105 active:scale-95"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleRevokeSession(sessionData.session)}
                        className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={currentSession?.session?.id === sessionData.session.id}
                      >
                        {currentSession?.session?.id === sessionData.session.id ? 'Current' : 'Revoke'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No active sessions</h3>
              <p className="text-gray-400">You don't have any active sessions to manage.</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-500/10 border border-slate-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Session Security</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>Add New Session:</strong> Create additional concurrent sessions for convenience</li>
            <li>• <strong>Activate:</strong> Switch to using this session on this device</li>
            <li>• <strong>Revoke:</strong> End this session (user will be logged out from that device)</li>
            <li>• <strong>Current Session:</strong> The session you're actively using right now</li>
            <li>• Sessions automatically expire based on your security settings</li>
            <li>• Regularly review and revoke suspicious sessions for better security</li>
            <li>• Each session represents a unique login from a device/browser combination</li>
          </ul>
        </div>
      </div>
    </div>
  );
}