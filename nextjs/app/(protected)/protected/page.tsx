
import { AccessProtectedResource } from "@/components/access-protected-resource";
import { ZoomableImage } from "@/components/zoomable-image";

/*

  This page demonstrates the two main authentication patterns:

  1. Cookie-based authentication for same-domain API access
  2. JWT-based authentication for cross-domain service communication

  The primary usage is cookie authentication for seamless API integration,
  while JWTs enable secure communication with external services.

*/

export default function ProtectedPage() {
  return (
    <div className="text-white p-8">
      {/* Header */}
      <div className="mb-12 space-y-6">
        <h1 className="text-4xl font-bold text-white mb-6">An Authentication Experiment</h1>
        <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">
          This is an experiment to implement authentication systems using{' '}
          <a 
            href="https://www.better-auth.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Better Auth
          </a>. 
          It demonstrates how services can be built with proper separation of concerns between 
          authentication and application logic, creating a separate entity in the application 
          stack - in this case, a{' '}
          <a 
            href="https://hono.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Hono
          </a>{' '}
          server for auth with its own dedicated database.
        </p>
        
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-yellow-200 text-sm">
            💡 <strong>Philosophy:</strong> There are plenty of auth services out there, which signals that 
            authentication is something that will eventually need to be separated and scaled independently. 
            This architecture prepares for that future.
          </p>
        </div>
      </div>

      {/* First Section: Simple Client-Server Connection */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">First: A Simple Client-Server Connection</h2>
        
        <div className="mb-8">
          <p className="text-gray-300 leading-relaxed text-lg max-w-4xl mb-6">
            The client (what you are using right now) is{' '}
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Next.js
            </a>, and the API server is Hono. 
            You are currently authenticating your session with the Hono server. I prefer 
            separating concerns between the main app and other services, so I chose this architecture.
          </p>
          
          <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">
            The login process goes to Hono, and it sends HTTP-only cookies on success. 
            HTTP-only cookies are better for security as they cannot be accessed by client-side JavaScript.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="mb-8">
          <ZoomableImage
            src="/auth-init.png"
            alt="Initial Authentication Flow"
            width={800}
            height={400}
            priority
          />
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">🏗️ Why This Architecture?</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-400">Separation of Concerns</h4>
              <p className="text-gray-300">
                Authentication logic is isolated from the main application, making both 
                easier to maintain, scale, and secure independently.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-green-400">Better API Development</h4>
              <p className="text-gray-300">
                Hono and Express provide better API development experiences compared to 
                handling everything in Next.js API routes.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Cookie-Based Authentication Test</h3>
          <p className="text-gray-400 text-sm mb-3">
            Below you can see the result of requesting data from the Hono server. If it's green, 
            you are authenticated. The data is an echo of your authenticated user data retrieved from the database.
          </p>
          <AccessProtectedResource url={process.env.NEXT_PUBLIC_HONO_SERVER + "/protected"} />
        </div>
      </div>

      {/* Second Section: Communicating with Other Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">Second: Communicating with Other Services</h2>
        
        <div className="mb-8">
          <p className="text-gray-300 leading-relaxed text-lg max-w-4xl mb-6">
            How do we persist this authenticated state when communicating with other services? 
            This communication should be agnostic - meaning it should not need to connect to 
            the auth database to know who the user is.
          </p>
          
          <p className="text-gray-300 leading-relaxed text-lg max-w-4xl mb-6">
            The answer: <strong>JWT and JWKS</strong>. Learn more at{' '}
            <a 
              href="https://www.better-auth.com/docs/plugins/jwt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Better Auth JWT Documentation
            </a>
          </p>
        </div>

        {/* JWT Diagram */}
        <div className="mb-8">
          <ZoomableImage
            src="/jwt.png"
            alt="JWT Authentication Flow"
            width={800}
            height={400}
            priority
          />
        </div>

        <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-orange-200 mb-4">⚠️ The Cost of Separation</h3>
          <p className="text-orange-100 text-sm mb-3">
            This approach is rather expensive since we need to request a JWT every time we need to 
            authenticate a request. But that is the expense of separating concerns - we don't want 
            the auth database to be accessed by NextJS or Express directly.
          </p>
          <div className="bg-orange-800/30 rounded p-4 mt-4">
            <h4 className="font-medium text-orange-200 mb-2">💡 Solution: In-Memory Caching</h4>
            <p className="text-orange-100 text-sm">
              We cache JWTs in memory on the client side. JWTs are short-lived (15 minutes in this app) 
              and caching them in memory makes sense while preventing security vulnerabilities from using localStorage.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">JWT-Based Service Communication</h3>
          <p className="text-gray-400 text-sm mb-4">
            The requests below do not touch the auth database. They carry user data in the JWT token. 
            Notice the 'honoServerTimestamp' values - they should be the same, showing we don't request 
            a new JWT for each request but store it in memory with a 15-minute TTL.
          </p>

          <div>
            <h4 className="text-lg font-medium text-cyan-400 mb-2">NextJS API Routes</h4>
            <p className="text-gray-400 text-sm mb-3">
              Same-domain API endpoints using JWT token verification
            </p>
            <AccessProtectedResource url={"/api/protected"} />
          </div>

          <div>
            <h4 className="text-lg font-medium text-cyan-400 mb-2">Express API Server</h4>
            <p className="text-gray-400 text-sm mb-3">
              External API server using JWT verification - completely separate from the auth database
            </p>
            <AccessProtectedResource url={process.env.NEXT_PUBLIC_EXPRESS_SERVER + "/protected"} />
          </div>
        </div>
      </div>

      {/* Third Section: Cross-Subdomain Access */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Third: Cross-Subdomain Accessibility</h2>
        
        <div className="mb-6">
          <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">
            The authentication system can be made accessible across different subdomains by adding 
            them to the CORS origins configuration in the Hono server. This demonstrates the flexibility 
            of the JWT-based approach for distributed systems while maintaining proper security boundaries.
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🌐 Cross-Domain Authentication</h3>
          <p className="text-gray-300 text-sm mb-4">
            Check out the Burgundy subdomain - it uses the same authentication system seamlessly:
          </p>
          
          {/* Burgundy iframe */}
          <div className="mb-6">
            <div className="bg-gray-900/50 rounded p-3 mb-3">
              <a 
                href={process.env.NEXT_PUBLIC_BURGUNDY_SERVER || 'http://burgundy.localhost:3001'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 font-mono text-sm hover:text-cyan-300 hover:underline transition-colors"
              >
                {process.env.NEXT_PUBLIC_BURGUNDY_SERVER || 'burgundy.localhost:3001'}
              </a>
              <p className="text-gray-400 text-xs mt-1">
                Live preview of the Burgundy subdomain using the same auth system
              </p>
            </div>
            
            <div className="border border-gray-600 rounded-lg overflow-hidden">
              <iframe
                src={process.env.NEXT_PUBLIC_BURGUNDY_SERVER || 'http://burgundy.localhost:3001'}
                width="100%"
                height="600"
                className="w-full"
                title="Burgundy Subdomain"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
              />
            </div>
          </div>
          
          <div className="bg-green-900/20 border border-green-600/30 rounded p-3">
            <p className="text-green-200 text-xs">
              ✅ <strong>Configuration complete</strong> - after adding the subdomain to CORS origins, the JWT approach handles cross-domain authentication seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Summary */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">🏗️ Architecture Benefits</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-green-400 mb-2">Scalable Architecture</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Auth service scales independently</li>
              <li>• Separation of auth and business logic</li>
              <li>• Dedicated auth database</li>
              <li>• Easy to add new services</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-cyan-400 mb-2">Security & Performance</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• HTTP-only cookies for sessions</li>
              <li>• Short-lived JWT tokens (15 min)</li>
              <li>• In-memory token caching</li>
              <li>• JWKS for remote verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}