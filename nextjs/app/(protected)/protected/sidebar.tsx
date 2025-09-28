'use client';

import { useSession, signOut } from '@/lib/auth-client-hono';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavigationLink {
  href?: string;
  text: string;
  children?: NavigationLink[];
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Account Management', 'User Features']));

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  // Navigation links data with multi-level structure
  const navigationLinks: NavigationLink[] = [
    { href: '/protected', text: 'Home' },
    {
      text: 'Account Management',
      children: [
        { href: '/protected/change-password', text: 'Change Password' },
        { href: '/protected/session-management', text: 'Session Management' },
        { href: '/protected/multi-session', text: 'Multiple Sessions' },
        { href: '/protected/passkey', text: 'Passkey Management' },
      ]
    },
    {
      text: 'User Features',
      children: [
        { href: '#', text: 'Dashboard' },
        { href: '#', text: 'Analytics' },
        {
          text: 'Profile Settings',
          children: [
            { href: '#', text: 'Personal Information' },
            { href: '#', text: 'Security Settings' },
            { href: '#', text: 'Privacy Controls' },
            { href: '#', text: 'Notification Preferences' },
          ]
        },
        { href: '#', text: 'Messages' },
        {
          text: 'Reports',
          children: [
            { href: '#', text: 'Monthly Reports' },
            { href: '#', text: 'Performance Metrics' },
            { href: '#', text: 'Usage Statistics' },
            { href: '#', text: 'Export Data' },
          ]
        },
      ]
    },
    {
      text: 'System',
      children: [
        { href: '#', text: 'Help & Support' },
        { href: '#', text: 'API Documentation' },
        { href: '#', text: 'System Status' },
        {
          text: 'Developer Tools',
          children: [
            { href: '#', text: 'API Playground' },
            { href: '#', text: 'Webhook Tester' },
            { href: '#', text: 'Log Viewer' },
            { href: '#', text: 'Database Inspector' },
          ]
        },
      ]
    },
  ];

  const renderNavigationLink = (link: NavigationLink, level: number = 0): React.JSX.Element => {
    const hasChildren = link.children && link.children.length > 0;
    const isExpanded = expandedSections.has(link.text);
    const paddingLeft = level * 16 + 16; // 16px base + 16px per level

    if (hasChildren) {
      return (
        <div key={link.text}>
          <button
            onClick={() => toggleSection(link.text)}
            className={`w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded flex items-center justify-between cursor-pointer`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <span>{link.text}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isExpanded && (
            <div>
              {link.children!.map((child) => renderNavigationLink(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={link.text}
        href={link.href || '#'}
        onClick={() => setSidebarOpen(false)}
        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded cursor-pointer"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {link.text}
      </Link>
    );
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
        {/* Header Section */}
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Protected Page</h2>
        </div>

        {/* Center Section - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            {navigationLinks.map((link) => renderNavigationLink(link))}
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