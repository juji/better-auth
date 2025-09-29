import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

// Create remote JWKS for token verification
const JWKS = jose.createRemoteJWKSet(new URL(`${process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3001"}/auth/jwks`));

async function verifyJwt(token: string, audience: string) {
  return jose.jwtVerify(token, JWKS, {
    issuer: process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3001",
    audience: audience,
  });
}

// GET /api/auth/token - Set httpOnly cookie with JWT
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Use the request host as audience
    const url = new URL(request.url);
    const audience = url.host;

    // Verify the JWT
    await verifyJwt(token, audience);

    // Create response with httpOnly cookie
    const response = NextResponse.json({ success: true });

    const maxAge = parseInt(process.env.COOKIE_MAX_AGE || '86400'); // Default 24 hours in seconds
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: request.url.startsWith('https://'),
      sameSite: 'strict',
      maxAge: maxAge,
    });

    return response;
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// DELETE /api/auth/token - Clear the httpOnly cookie
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  response.cookies.set('authToken', '', {
    httpOnly: true,
    secure: request.url.startsWith('https://'),
    sameSite: 'strict',
    maxAge: 0, // Expire immediately
  });

  return response;
}