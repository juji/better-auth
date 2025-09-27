export function AppDescription() {
  return (
    <div className="text-center h-full flex flex-col justify-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Better Auth Experiment
      </h2>

      <div className="space-y-4 mb-6">
        <p className="text-gray-300 text-lg leading-relaxed">
          Welcome to our cutting-edge authentication showcase! This application demonstrates the power and simplicity of{' '}
          <a
            href="https://www.better-auth.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors"
          >
            Better Auth
          </a>
          {' '}— the most comprehensive authentication framework for TypeScript.
        </p>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">Next.js 15</span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">TypeScript</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">Tailwind CSS</span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">PostgreSQL</span>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium">Hono</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-gray-400 text-sm">
          Explore the future of authentication with Better Auth — simple, secure, and developer-friendly.
        </p>
      </div>
    </div>
  );
}