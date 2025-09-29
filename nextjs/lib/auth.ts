import { Session, User } from "better-auth";
import { verifyJwt } from "./jwks";
import { getUserSession } from "./auth-client";

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
  let token: string | null = null;

  // First try to get token from httpOnly cookie
  if (request instanceof Request && 'cookies' in request) {
    // Next.js request object
    const nextRequest = request as any;
    token = nextRequest.cookies?.get?.('authToken')?.value || null;
  }

  // Fallback to Authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return { session: null, user: null, error: 'No token provided' };
  }

  // Get current host as audience
  const url = new URL(request.url);
  const audience = url.host;

  try {
    // First verify the JWT token
    await verifyJwt(token, audience);

    // Then get the user session
    const { session, error } = await getUserSession({ token });

    return {
      session: session?.session || null,
      user: session?.user || null,
      error: error
    };
  } catch (error) {
    return {
      session: null,
      user: null,
      error: 'Invalid token'
    };
  }
}