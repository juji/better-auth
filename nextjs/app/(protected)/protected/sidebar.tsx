'use client';

import { useSession, signOut } from '@/lib/auth-client-hono';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white">Protected Page</h2>
        </div>
        <nav className="px-4 space-y-2 flex-1">
          <Link
            href="/protected"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Home
          </Link>
          <Link
            href="/protected/change-password"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Change Password
          </Link>
          <Link
            href="/protected/session-management"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Session Management
          </Link>
          <Link
            href="/protected/multi-session"
            onClick={() => setSidebarOpen(false)}
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            Multiple Sessions
          </Link>
          <Link
            href="/protected/passkey"
            onClick={() => setSidebarOpen(false)}
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
    </>
  );
}