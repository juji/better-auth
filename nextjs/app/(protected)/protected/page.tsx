
import { AccessProtectedResource } from "@/components/access-protected-resource";
import Image from "next/image";

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
      <div className="mb-12 space-y-6">
        <h1 className="text-4xl font-bold text-white mb-6">Authentication Architecture</h1>
        <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">
          This demo showcases a complete authentication architecture with multiple server types
          working together to provide secure access across different domains and use cases.
        </p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🏗️ System Architecture</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-3">
              <h3 className="font-medium text-blue-400">Hono API Server</h3>
              <p className="text-gray-300">
                A full-featured API server with integrated authentication capabilities. Handles user sessions,
                processes authentication requests, and provides secure cookie-based access to protected endpoints.
              </p>
              <div className="text-xs text-gray-400">
                <strong>Tech:</strong> Hono + Better Auth<br/>
                <strong>Auth:</strong> Sessions & Cookies<br/>
                <strong>Domain:</strong> {process.env.NEXT_PUBLIC_HONO_SERVER}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-green-400">Next.js Frontend</h3>
              <p className="text-gray-300">
                The main application frontend that authenticates users through the Hono API server
                and demonstrates JWT-based API access patterns.
              </p>
              <div className="text-xs text-gray-400">
                <strong>Tech:</strong> Next.js + React<br/>
                <strong>Auth:</strong> Client Integration + JWT<br/>
                <strong>Domain:</strong> {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-purple-400">Express API Server</h3>
              <p className="text-gray-300">
                An external API server demonstrating cross-domain JWT-based authentication
                for service-to-service communication.
              </p>
              <div className="text-xs text-gray-400">
                <strong>Tech:</strong> Express.js<br/>
                <strong>Auth:</strong> JWT Verification<br/>
                <strong>Domain:</strong> {process.env.NEXT_PUBLIC_EXPRESS_SERVER}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="mb-12">
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 flex justify-center">
          <Image
            src="/auth-infra.png"
            alt="Authentication Infrastructure Diagram"
            width={800}
            height={400}
            className="w-full h-auto rounded-lg max-h-[600px] object-contain bg-black"
            priority
          />
        </div>
      </div>

      <div className="mb-12 space-y-6">
        <h1 className="text-4xl font-bold text-white mb-6">Authentication Patterns</h1>
        <p className="text-gray-300 leading-relaxed text-lg max-w-4xl">
          This page demonstrates the two primary authentication approaches: cookie-based authentication
          for seamless API access, and JWT-based authentication for secure service communication.
        </p>
      </div>

      {/* Cookie-based Authentication Section */}
      <div className="mb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">🔐 Connecting to API using Cookies</h2>
          <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
            The primary authentication method uses HTTP-only cookies set by the auth server.
            This provides seamless, secure access to API endpoints without manual
            token management. Cookies are automatically included in requests and cannot be
            accessed by client-side JavaScript.
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">How Cookie Authentication Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-green-400">1. Auth Server Sets Cookie</h4>
              <p className="text-gray-300">
                Better Auth sets httpOnly, secure cookies containing session data.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-400">2. Automatic Inclusion</h4>
              <p className="text-gray-300">
                Browser automatically includes cookies in same-domain requests.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-400">3. Server Validation</h4>
              <p className="text-gray-300">
                API server validates cookie-based sessions for protected resources.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Cookie-Based API Access</h3>
          <div>
            <h4 className="text-lg font-medium text-green-400 mb-2">Hono Server</h4>
            <p className="text-gray-400 text-sm mb-3">
              The server that manages authentication via cookies and provides session-based API access
            </p>
            <AccessProtectedResource url={process.env.NEXT_PUBLIC_HONO_SERVER + "/protected"} />
          </div>
        </div>
      </div>

      {/* JWT-based Authentication Section */}
      <div className="mb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">🚀 Connecting to Other Services with JWT</h2>
          <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
            For cross-domain services or external APIs, JWT tokens provide a stateless,
            self-contained authentication method. Tokens are obtained from the auth server
            and included in Authorization headers for secure service-to-service communication.
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">How JWT Authentication Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-cyan-400">1. Token Generation</h4>
              <p className="text-gray-300">
                Auth server (Hono) generates JWTs with user data and signs them with private keys.
              </p>
              <p className="text-gray-300">
                Tokens are short-lived and can be refreshed as needed. The client (NextJs) handles token storage.
                Token is stored in memory (not in cookies).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cyan-400">2. Remote Verification</h4>
              <p className="text-gray-300">
                Services verify JWTs using public keys from remote JWKS endpoints.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-cyan-400">3. Payload Extraction</h4>
              <p className="text-gray-300">
                User data is extracted directly from verified JWT payloads.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">JWT-Based Service Access</h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-cyan-400 mb-2">Next.js API Routes</h4>
              <p className="text-gray-400 text-sm mb-3">
                Same-domain API endpoints using JWT token verification
              </p>
              <AccessProtectedResource url={"/api/protected"} />
            </div>

            <div>
              <h4 className="text-lg font-medium text-cyan-400 mb-2">Express API Server</h4>
              <p className="text-gray-400 text-sm mb-3">
                Cross-domain API server using JWT verification
              </p>
              <AccessProtectedResource url={process.env.NEXT_PUBLIC_EXPRESS_SERVER + "/protected"} />
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Summary */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">🏗️ Architecture Overview</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-green-400 mb-2">Cookie Authentication (Hono)</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• API server manages user sessions</li>
              <li>• Automatic browser cookie handling</li>
              <li>• Seamless authentication flow</li>
              <li>• Primary method for auth-enabled APIs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-cyan-400 mb-2">JWT Authentication (APIs)</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• API services verify JWT tokens</li>
              <li>• Stateless, self-contained tokens</li>
              <li>• Remote key verification (JWKS)</li>
              <li>• Flexible cross-service integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}