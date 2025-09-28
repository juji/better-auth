'use client';

import { useState, useEffect } from 'react';
import { authClient, useSession } from '@/lib/auth-client-hono';
import type { Session } from 'better-auth';

export default function SessionManagementPage() {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: currentSession } = useSession();

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await authClient.listSessions();
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

  const handleRevokeSession = async (session: Session) => {
    try {
      const { error } = await authClient.revokeSession({
        token: session.token
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

  const handleRevokeOtherSessions = async () => {
    try {
      const { error } = await authClient.revokeOtherSessions();
      if (error) {
        setError(error.message || 'Failed to revoke other sessions');
      } else {
        // Refresh the session list
        await loadSessions();
      }
    } catch (err) {
      setError('Failed to revoke other sessions');
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const { error } = await authClient.revokeSessions();
      if (error) {
        setError(error.message || 'Failed to revoke all sessions');
      } else {
        // Refresh the session list
        await loadSessions();
      }
    } catch (err) {
      setError('Failed to revoke all sessions');
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
          <h1 className="text-3xl font-bold text-white mb-4">Session Management</h1>
          <p className="text-gray-300 mb-4">
            Manage your active sessions across all devices and browsers. You can view, revoke individual sessions, or revoke multiple sessions at once.
          </p>
          <div className="p-4 bg-slate-500/10 border border-slate-500/20 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Session Security</h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong>Active Sessions:</strong> View all your currently active sessions</li>
              <li>• <strong>Revoke Session:</strong> End a specific session from any device</li>
              <li>• <strong>Revoke Others:</strong> End all sessions except your current one</li>
              <li>• <strong>Revoke All:</strong> End all sessions including your current one</li>
              <li>• <strong>Automatic Expiry:</strong> Sessions expire after 7 days by default</li>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-white">
                  Active Sessions ({sessions.length})
                </h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleRevokeOtherSessions}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded transition-all duration-200 cursor-pointer text-sm shadow-lg hover:shadow-amber-500/25 transform hover:scale-105 active:scale-95"
                  >
                    Revoke Others
                  </button>
                  <button
                    onClick={handleRevokeAllSessions}
                    className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded transition-all duration-200 cursor-pointer text-sm shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95"
                  >
                    Revoke All
                  </button>
                  <button
                    onClick={loadSessions}
                    className="px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded transition-all duration-200 cursor-pointer text-sm shadow-lg hover:shadow-gray-500/25 transform hover:scale-105 active:scale-95"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {sessions.map((session, index) => (
                <div
                  key={session.id || index}
                  className="p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">{getDeviceInfo(session)}</span>
                        <div className="flex items-center space-x-2">
                          {currentSession?.session?.id === session.id && (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
                              Current Session
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-400 space-y-1">
                        <div>
                          <span className="font-medium">Session ID:</span> {session.id}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span> {session.ipAddress || 'Unknown'}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(session.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span> {formatDate(session.expiresAt)}
                        </div>
                        {session.userAgent && (
                          <div>
                            <span className="font-medium">Browser:</span> {session.userAgent}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRevokeSession(session)}
                        className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={currentSession?.session?.id === session.id}
                      >
                        {currentSession?.session?.id === session.id ? 'Current' : 'Revoke'}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No active sessions</h3>
              <p className="text-gray-400">You don't have any active sessions to manage.</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-500/10 border border-slate-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Session Management Tips</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>Regular Review:</strong> Check your sessions periodically for suspicious activity</li>
            <li>• <strong>Revoke on Suspicion:</strong> Immediately revoke sessions from unrecognized devices</li>
            <li>• <strong>Current Session:</strong> Your current session cannot be revoked from this interface</li>
            <li>• <strong>Automatic Logout:</strong> Sessions expire automatically based on your security settings</li>
            <li>• <strong>Password Change:</strong> Consider revoking other sessions when changing passwords</li>
            <li>• <strong>Public Devices:</strong> Always revoke sessions from shared or public computers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}