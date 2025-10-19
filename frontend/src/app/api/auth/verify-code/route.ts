import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verificationStorage } from '@/lib/verification-storage';

const verifyCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = verifyCodeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, code } = validationResult.data;

    // Verify the code
    const isValid = verificationStorage.verify(email, code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Email verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'An error occurred while verifying code' },
      { status: 500 }
    );
  }
}