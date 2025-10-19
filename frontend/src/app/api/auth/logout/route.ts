import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie, clearAuthCookie, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (token) {
      // Verify token to get user info
      const payload = await verifyToken(token);

      if (payload) {
        // Delete session from database
        await prisma.session.deleteMany({
          where: { token },
        });
      }

      // Clear auth cookie
      await clearAuthCookie();
    }

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}