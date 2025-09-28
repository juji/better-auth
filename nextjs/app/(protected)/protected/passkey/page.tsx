'use client';

import { useState, useEffect } from 'react';
import { passkey } from '@/lib/auth-client-hono';
import type { Passkey } from 'better-auth/plugins/passkey';

export default function PasskeyPage() {
  const [passkeys, setPasskeys] = useState<Passkey[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const loadPasskeys = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await passkey.listUserPasskeys();
      if (error) {
        setError(error.message || 'Failed to load passkeys');
      } else {
        setPasskeys(data || []);
      }
    } catch (err) {
      setError('Failed to load passkeys');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPasskeys();
  }, []);

  const handleRegisterPasskey = async () => {
    setIsRegistering(true);
    setError(null);
    try {
      await passkey.addPasskey();
      // Refresh the passkey list
      await loadPasskeys();
    } catch (err: any) {
      setError(err?.message || 'Failed to register passkey');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    try {
      await passkey.deletePasskey({ id: passkeyId });
      // Refresh the passkey list
      await loadPasskeys();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete passkey');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Passkey Management</h1>
          <p className="text-gray-300 mb-4">
            Manage your passkeys for passwordless authentication. Passkeys provide secure, convenient access without passwords.
          </p>
          <div className="p-4 bg-slate-500/10 border border-slate-500/20 rounded-lg">
            <h3 className="text-sm font-medium text-slate-400 mb-2">What are Passkeys?</h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• <strong>Passwordless:</strong> Sign in without remembering passwords</li>
              <li>• <strong>Secure:</strong> Uses biometric data or device security</li>
              <li>• <strong>Unique:</strong> Each passkey is tied to a specific website and device</li>
              <li>• <strong>Private:</strong> Your biometric data never leaves your device</li>
              <li>• <strong>Backup:</strong> Passkeys can be synced across your devices</li>
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
              <span className="ml-3 text-gray-300">Loading passkeys...</span>
            </div>
          ) : passkeys && passkeys.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-white">
                  Your Passkeys ({passkeys.length})
                </h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleRegisterPasskey}
                    disabled={isRegistering}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded transition-all duration-200 cursor-pointer text-sm shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegistering ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-2"></div>
                        Registering...
                      </div>
                    ) : (
                      'Add Passkey'
                    )}
                  </button>
                  <button
                    onClick={loadPasskeys}
                    className="px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white rounded transition-all duration-200 cursor-pointer text-sm shadow-lg hover:shadow-gray-500/25 transform hover:scale-105 active:scale-95"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {passkeys.map((passkeyData, index) => (
                <div
                  key={passkeyData.id || index}
                  className="p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors"
                >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 mb-4 sm:mb-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">🔐</span>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                              Passkey
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-400 space-y-1">
                          <div>
                            <span className="font-medium">Name:</span> {passkeyData.name || 'Unnamed Passkey'}
                          </div>
                          <div>
                            <span className="font-medium">Device Type:</span> {passkeyData.deviceType}
                          </div>
                          <div>
                            <span className="font-medium">Backed Up:</span> {passkeyData.backedUp ? 'Yes' : 'No'}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {formatDate(passkeyData.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeletePasskey(passkeyData.id)}
                          className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95"
                        >
                          Delete
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
              <h3 className="text-lg font-medium text-gray-300 mb-2">No passkeys registered</h3>
              <p className="text-gray-400 mb-6">Register your first passkey to enable passwordless authentication.</p>
              <button
                onClick={handleRegisterPasskey}
                disabled={isRegistering}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full mr-2"></div>
                    Registering Passkey...
                  </div>
                ) : (
                  'Register Your First Passkey'
                )}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-slate-500/10 border border-slate-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Passkey Security Tips</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>Device Security:</strong> Keep your device secure with a strong PIN or biometric</li>
            <li>• <strong>Backup:</strong> Enable passkey syncing in your browser settings</li>
            <li>• <strong>Multiple Devices:</strong> Register passkeys on multiple trusted devices</li>
            <li>• <strong>Regular Updates:</strong> Keep your browser and OS updated for security</li>
            <li>• <strong>Recovery:</strong> Have backup authentication methods available</li>
            <li>• <strong>Monitor:</strong> Regularly check your registered passkeys for suspicious activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}