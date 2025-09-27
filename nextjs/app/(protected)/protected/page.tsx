
import { AccessProtectedResource } from "@/components/access-protected-resource";


export default function ProtectedPage() {
  return (
    <div className="text-white p-8">
      {/* Page content goes here */}
      <div className="mb-12 space-y-6">
        <h1 className="text-4xl font-bold text-white mb-6">Protected Resource Demo</h1>
        <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
          This page shows how authenticated users can access protected API resources.
          Your session credentials are automatically included in requests to secure endpoints.
        </p>
      </div>
      <AccessProtectedResource url={process.env.NEXT_PUBLIC_HONO_SERVER + "/protected"} />
    </div>
  );
}