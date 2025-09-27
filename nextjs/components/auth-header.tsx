export function AuthHeader() {
  return (
    <div className="text-center lg:text-left">
      <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
        Experiment:
        <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Better Auth
        </span>
      </h1>
      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
        An Experiment for <a href="https://www.better-auth.com" className="text-purple-400 hover:text-purple-300 underline cursor-pointer" target="_blank" rel="noopener noreferrer">Better-Auth</a>: A modern open source authentication library, The most comprehensive authentication framework for TypeScript. Try Signing in.
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
    </div>
  );
}