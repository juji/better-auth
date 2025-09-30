import Link from "next/link";

export function AuthHeader() {
  return (
    <div className="text-center lg:text-left pt-20">
      <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        Experiment:
        <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Better Auth
        </span>
      </h1>
      <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto lg:max-w-xl lg:mx-0">
        An Experiment of using <a href="https://www.better-auth.com" className="text-purple-400 hover:text-purple-300 underline cursor-pointer" target="_blank" rel="noopener noreferrer">Better-Auth</a>: A modern open source authentication library, 
        The most comprehensive authentication framework for TypeScript. Try Signing in or Signing up.
      </p>
      <div className="flex flex-wrap justify-center lg:justify-start gap-4">
        <div className="flex items-center text-gray-400">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
          <span className="text-sm">Secure & Encrypted</span>
        </div>
        <div className="flex items-center text-gray-400">
          <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
          <span className="text-sm">Social Logins</span>
        </div>
        <div className="flex items-center text-gray-400">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
          <span className="text-sm">Multiple login mechanism support</span>
        </div>
      </div>

      <div className="mt-6">
        <p>Try accessing <Link className="hover:text-purple-300 underline" href="/protected">protected page</Link></p>
      </div>

      <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-xl p-6 mt-8 shadow-2xl max-w-[564px] mx-auto">
        <div className="w-full text-left mb-6">
          <h3 className="text-xl font-semibold text-white">Tech Stack</h3>
        </div>
        <div className="grid text-left grid-cols-2 sm:grid-cols-3 gap-4">
          <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <div>
              <div className="font-semibold text-white">Next.js 15</div>
              <div className="text-xs text-gray-400">React Framework</div>
            </div>
          </Link>
          <Link href="https://typescriptlang.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <div>
              <div className="font-semibold text-white">TypeScript</div>
              <div className="text-xs text-gray-400">Type Safety</div>
            </div>
          </Link>
          <Link href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <div>
              <div className="font-semibold text-white">Tailwind CSS</div>
              <div className="text-xs text-gray-400">Styling</div>
            </div>
          </Link>
          <Link href="https://better-auth.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <div>
              <div className="font-semibold text-white">Better Auth</div>
              <div className="text-xs text-gray-400">Authentication</div>
            </div>
          </Link>
          <Link href="https://postgresql.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <div>
              <div className="font-semibold text-white">PostgreSQL</div>
              <div className="text-xs text-gray-400">Database</div>
            </div>
          </Link>
          <Link href="https://hono.dev" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
            <div>
              <div className="font-semibold text-white">Hono</div>
              <div className="text-xs text-gray-400">API Server</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}