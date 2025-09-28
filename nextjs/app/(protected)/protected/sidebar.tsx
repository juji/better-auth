'use client';

import { useSession, signOut } from '@/lib/auth-client-hono';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NavigationLink {
  href?: string;
  text: string;
  children?: NavigationLink[];
}

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

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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

  // Auto-expand sections containing active children
  useEffect(() => {
    const sectionsToExpand = new Set(expandedSections);

    navigationLinks.forEach(link => {
      if (link.children) {
        const hasActiveChild = link.children.some(child =>
          child.href === pathname || (child.children && child.children.some(grandChild => grandChild.href === pathname))
        );
        if (hasActiveChild) {
          sectionsToExpand.add(link.text);
        }
      }
    });

    setExpandedSections(sectionsToExpand);
  }, [pathname]);

  const renderNavigationLink = (link: NavigationLink, level: number = 0): React.JSX.Element => {
    const hasChildren = link.children && link.children.length > 0;
    const isExpanded = expandedSections.has(link.text);
    const paddingLeft = level * 8 + 27; // 27px base + 8px per level

    // Check if this link or any of its children are active
    const isActive = link.href === pathname || (hasChildren && link.children!.some(child =>
      child.href === pathname || (child.children && child.children.some(grandChild => grandChild.href === pathname))
    ));

    // Check if any child is active (for parent highlighting)
    const hasActiveChild = hasChildren && link.children!.some(child =>
      child.href === pathname || (child.children && child.children.some(grandChild => grandChild.href === pathname))
    );

    if (hasChildren) {
      return (
        <div key={link.text}>
          <button
            onClick={() => toggleSection(link.text)}
            className={`w-full text-left py-2 pr-6 transition-colors rounded flex items-center justify-between cursor-pointer ${
              hasActiveChild
                ? 'text-white bg-black'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <span>{link.text}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ease-in-out ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-1">
              {link.children!.map((child) => renderNavigationLink(child, level + 1))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={link.text}
        href={link.href || '#'}
        onClick={() => setSidebarOpen(false)}
        className={`block py-2 pr-6 transition-colors rounded cursor-pointer ${
          isActive
            ? 'text-white bg-black font-medium'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
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
          <nav className="py-4 space-y-1">
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