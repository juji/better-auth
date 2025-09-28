'use client';

import { useSession, signOut } from '@/lib/auth-client-hono';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function ProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex h-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white">Protected Page</h2>
        </div>
        <nav className="px-4 space-y-2 flex-1">
          <Link
            href="/protected"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Home
          </Link>
          <Link
            href="/protected/change-password"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Change Password
          </Link>
          <Link
            href="/protected/multi-session"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Multiple Sessions
          </Link>
          <Link
            href="/protected/passkey"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Passkey Management
          </Link>
        </nav>

        {/* User info and logout at bottom */}
        <div className="p-4 pb-6 border-t border-white/10">
          <div className="text-base text-gray-400 mb-2 pb-2">
            {session?.user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors rounded cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile menu button */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-1 sm:p-6">
          <div className="animate-in fade-in duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}