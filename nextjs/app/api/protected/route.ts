import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const { session, user, error } = await authenticateRequest(request);

    if (error || !session || !user) {
      return NextResponse.json(
        { error: error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Return the protected data with session info
    return NextResponse.json({
      message: 'Successfully accessed protected API route!',
      session: session,
      user: user,
      accessedVia: 'Next.js API Route',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Protected API error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}