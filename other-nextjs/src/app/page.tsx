
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

      {/* Cookie-based Authentication Section */}
      <div className="mb-12">

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
          </div>
        </div>
      </div>

    </div>
  );
}