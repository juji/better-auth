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

  // Navigation links data
  const navigationLinks = [
    { href: '/protected', text: 'Home' },
    { href: '/protected/change-password', text: 'Change Password' },
    { href: '/protected/session-management', text: 'Session Management' },
    { href: '/protected/multi-session', text: 'Multiple Sessions' },
    { href: '/protected/passkey', text: 'Passkey Management' },
    { href: '#', text: 'Dashboard' },
    { href: '#', text: 'Analytics' },
    { href: '#', text: 'User Profile' },
    { href: '#', text: 'Settings' },
    { href: '#', text: 'Notifications' },
    { href: '#', text: 'Messages' },
    { href: '#', text: 'Reports' },
    { href: '#', text: 'Help & Support' },
    { href: '#', text: 'API Documentation' },
    { href: '#', text: 'System Status' },
  ];

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
        {/* Header Section */}
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Protected Page</h2>
        </div>

        {/* Center Section - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4 space-y-2">
            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded"
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="flex-shrink-0 p-4 border-t border-white/10">
          <div className="text-base text-gray-400 mb-3 pb-2">
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