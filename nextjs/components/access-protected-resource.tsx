'use client'

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string, options?: RequestInit) => fetch(url, {
  ...options||{},
  ...url.startsWith('http') && !url.startsWith(window.location.origin) ? {
    mode: 'cors',
    credentials: 'include'
  } : {}
}).then(res => res.json())

export function AccessProtectedResource({ url }: { url: string }) {

  const { data, error, isLoading } = useSWR(url, fetcher)
  const [ showData, setShowData ] = useState<boolean>(true);

  function toggleData() {
    setShowData(!showData);
  }

  if (isLoading) {
    return (
      <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
          <p className="text-cyan-400 font-medium">Accessing protected resource...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-lg bg-black/20 border border-red-500/30 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-medium">Access Failed</p>
            <p className="text-red-300/80 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-lg bg-black/20 border border-green-500/30 rounded-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-green-400 font-medium">Protected Resource Accessed</p>
            <p className="text-green-300/80 text-sm">Successfully retrieved data</p>
          </div>
        </div>
        <button
          onClick={toggleData}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-cyan-500/25"
        >
          {showData ? 'Hide Data' : 'Show Data'}
        </button>
      </div>

      {showData && (
        <div className="mt-4">
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto">
            <pre className="text-cyan-300 text-sm font-mono whitespace-pre-wrap break-all">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}