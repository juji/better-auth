import { User } from "better-auth";
import { verifyJwt } from "./jwks";

export interface AuthResult {
  user: User | null;
  error: string | null
}

export async function authenticateRequest(request: Request): Promise<AuthResult> {
  

  // get authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      user: null,
      error: 'No token provided'
    };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return {
      user: null,
      error: 'No token provided'
    };
  }

  const audience = process.env.JWT_AUDIENCE || new URL(request.url).origin;

  if(!audience){
    return {
      user: null,
      error: 'No audience'
    };
  }

  try {

    const { payload } = await verifyJwt(
      token, 
      audience
    );

    if(!payload.user){
      return {
        user: null,
        error: 'No user in token'
      };
    }

    return {
      user: payload.user as User || null,
      error: null
    };

  } catch (error) {

    console.log('JWT verification error:', error);
    return {
      user: null,
      error: 'Invalid token'
    };
  }
}