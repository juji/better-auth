'use client'

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

export function AccessProtectedResource({ url }: { url: string }) {

  const { data, error, isLoading } = useSWR(url, fetcher)
  const [ showData, setShowData ] = useState<boolean>(true);

  function toggleData() {
    setShowData(!showData);
  }

  function reloadData() {
    mutate(url);
  }

  if (isLoading) {
    return (
      <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
          <p className="text-orange-400 font-medium">Accessing protected resource...</p>
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
            <p className="text-red-400 font-medium">Access Failed: {url}</p>
            <p className="text-red-300/80 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-lg bg-black/20 border border-yellow-500/30 rounded-xl p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-yellow-400 font-medium truncate">{url}</p>
            <p className="text-yellow-300/80 text-sm">Successfully retrieved data</p>
          </div>
        </div>
        <div className="flex space-x-2 flex-shrink-0 justify-end">
          <button
            onClick={reloadData}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
          >
            Reload
          </button>
          <button
            onClick={toggleData}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-teal-500/25 text-sm sm:text-base"
          >
            {showData ? 'Hide Data' : 'Show Data'}
          </button>
        </div>
      </div>

      {showData && (
        <div className="mt-4">
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto">
            <pre className="text-orange-300 text-sm font-mono whitespace-pre-wrap break-all">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}