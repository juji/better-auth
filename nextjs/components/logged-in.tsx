import { signOut, useSession } from '@/lib/auth-client-hono';

export function LoggedIn() {
  const { data: session } = useSession();

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
      <p className="text-gray-300 mb-6">Successfully logged in as</p>
      <div className="bg-black/30 rounded-lg p-4 mb-6">
        <p className="text-white font-medium">{session?.user?.email}</p>
        <p className="text-gray-400 text-sm">{session?.user?.name}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
}