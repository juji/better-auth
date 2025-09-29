'use client';

import { useSession } from '@/lib/auth-client-hono';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-400 dark:text-yellow-300 animate-pulse">Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <p className="text-gray-400 dark:text-yellow-300 animate-pulse">You are not authorized to view this page.</p>
      </div>
    );
  }

  // Render children with smooth fade-in transition
  return (
    <div className="animate-in fade-in duration-500 ease-out">
      <main className="p-1 max-w-4xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}