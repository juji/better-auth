import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Return the protected data with session info
    return NextResponse.json({
      message: 42,
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