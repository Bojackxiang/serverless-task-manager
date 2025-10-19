import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verificationStorage } from '@/lib/verification-storage';

const sendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Generate random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = sendVerificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Generate verification code
    const code = generateVerificationCode();

    // Set expiry time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store code
    verificationStorage.set(email, code, expiresAt);

    // In production, you would send this code via email service (SendGrid, Resend, etc.)
    // For now, return the code for testing purposes
    console.log(`Verification code for ${email}: ${code}`);

    return NextResponse.json({
      message: 'Verification code sent successfully',
      // TODO: Remove this in production - only for testing
      code,
    });
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending verification code' },
      { status: 500 }
    );
  }
}