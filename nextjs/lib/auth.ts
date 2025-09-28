import { Session, User } from "better-auth";
import { verifyJwt } from "./jwks.js";
import { getUserSession } from "./auth-client.js";

export interface AuthResult {
  session: Session | null;
  user: User | null;
  error: {
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
} | null | string;
}

export async function authenticateRequest(request: Request): Promise<AuthResult> {
  // Get Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return { session: null, user: null, error: 'No authorization header' };
  }

  const token = authHeader.split(' ')[1]; // Assuming Bearer token
  if (!token) {
    return { session: null, user: null, error: 'No token provided' };
  }

  // Get current host as audience
  const url = new URL(request.url);
  const audience = url.host;

  // First verify the JWT token
  await verifyJwt(token, audience);

  // Then get the user session
  const { session, error } = await getUserSession({ token });

  return {
    session: session?.session || null,
    user: session?.user || null,
    error: error
  };
}