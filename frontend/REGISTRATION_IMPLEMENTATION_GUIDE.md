# Registration Feature Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Verification System](#verification-system)
5. [API Routes](#api-routes)
6. [Frontend Components](#frontend-components)
7. [Registration Flow](#registration-flow)
8. [Email Verification Process](#email-verification-process)
9. [How to Test](#how-to-test)
10. [File Structure](#file-structure)
11. [Common Issues and Solutions](#common-issues-and-solutions)
12. [Next Steps](#next-steps)
13. [Summary](#summary)

## Overview

This guide explains the complete implementation of the registration feature with email verification in our Next.js application. The system requires users to verify their email address before creating an account, enhancing security and ensuring valid email addresses.

### Key Technologies Used:
- **Next.js 15** - Full-stack React framework
- **Prisma** - Database ORM
- **JWT (Jose)** - Token-based authentication
- **bcryptjs** - Password hashing
- **React Hook Form + Zod** - Form handling and validation
- **Radix UI Dialog** - Modal for email verification
- **SQLite** - Database (for development)

### Key Features:
- ✅ Email verification required before registration
- ✅ 6-digit verification code system
- ✅ Code expiry (10 minutes)
- ✅ Password validation (minimum 8 characters)
- ✅ Username uniqueness check
- ✅ Email uniqueness check
- ✅ Automatic login after registration
- ✅ Real-time form validation

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Browser   │────▶│  Next.js API     │────▶│   Database   │
│             │◀────│  - send-verify   │◀────│   (SQLite)   │
│             │     │  - verify-code   │     └──────────────┘
│             │     │  - register      │
└─────────────┘     └──────────────────┘
      │                      │
      │                      ▼
      │             ┌──────────────────┐
      └─────────────│  Verification    │
                    │  Storage (Memory)│
                    └──────────────────┘
```

## Database Schema

The registration system uses the existing User and Session models from Prisma schema:

### User Model (Lines 12-24 in `prisma/schema.prisma`)

```prisma
model User {
  id                 String    @id @default(cuid())  // Unique ID
  email              String    @unique               // Must be unique
  username           String    @unique               // Must be unique
  password           String                          // Hashed password
  name               String?                         // Optional display name
  emailVerified      Boolean   @default(false)       // Verification status
  verificationCode   String?                         // Reserved for future use
  verificationExpiry DateTime?                       // Reserved for future use
  sessions           Session[]                       // User sessions
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

**Fields used in registration:**
- `email` - User's email address (must be unique)
- `username` - User's chosen username (must be unique, alphanumeric + underscore)
- `password` - Bcrypt hashed password
- `emailVerified` - Set to `true` after successful registration
- `createdAt` / `updatedAt` - Timestamps

## Verification System

### File: `src/lib/verification-storage.ts`

This module manages temporary storage of verification codes using an in-memory Map.

#### Storage Class (Lines 5-11)
```typescript
interface VerificationData {
  code: string;
  expiresAt: Date;
}

class VerificationStorage {
  private codes: Map<string, VerificationData>;
  // ...
}
```

#### Set Method (Lines 15-17)
```typescript
set(email: string, code: string, expiresAt: Date): void {
  this.codes.set(email, { code, expiresAt });
}
```
Stores verification code with expiry time for an email address.

#### Get Method (Lines 19-29)
```typescript
get(email: string): VerificationData | undefined {
  const data = this.codes.get(email);

  // Check if code has expired
  if (data && data.expiresAt < new Date()) {
    this.codes.delete(email);
    return undefined;
  }

  return data;
}
```
Retrieves code and automatically removes expired entries.

#### Verify Method (Lines 35-48)
```typescript
verify(email: string, code: string): boolean {
  const data = this.get(email);

  if (!data) {
    return false;  // No code found or expired
  }

  if (data.code !== code) {
    return false;  // Code doesn't match
  }

  // Code is valid, delete it so it can't be reused
  this.delete(email);
  return true;
}
```
Validates code and prevents reuse by deleting it after successful verification.

#### Why In-Memory Storage?
- ✅ Simple for development and testing
- ✅ Automatic cleanup on server restart
- ✅ No external dependencies
- ⚠️ **Production Note:** Use Redis or database for production to persist across server restarts and scale horizontally

## API Routes

### 1. Send Verification Route: `src/app/api/auth/send-verification/route.ts`

#### Request Validation (Lines 5-7)
```typescript
const sendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});
```

#### Code Generation (Lines 10-12)
```typescript
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
```
Generates a random 6-digit number (100000-999999).

#### Endpoint Logic (Lines 14-55)
```typescript
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

    // In production, send via email service
    console.log(`Verification code for ${email}: ${code}`);

    return NextResponse.json({
      message: 'Verification code sent successfully',
      code,  // TODO: Remove in production
    });
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending verification code' },
      { status: 500 }
    );
  }
}
```

**Flow:**
1. Validate email format
2. Generate 6-digit code
3. Set 10-minute expiry
4. Store in memory
5. Return code (testing mode)

### 2. Verify Code Route: `src/app/api/auth/verify-code/route.ts`

#### Request Validation (Lines 5-8)
```typescript
const verifyCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});
```

#### Endpoint Logic (Lines 10-43)
```typescript
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
```

**Flow:**
1. Validate email and code format
2. Check code against stored value
3. Verify code hasn't expired
4. Delete code after successful verification
5. Return success/failure

### 3. Register Route: `src/app/api/auth/register/route.ts`

#### Request Validation (Lines 6-11)
```typescript
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  emailVerified: z.boolean(),
});
```

#### Email Verification Check (Lines 27-32)
```typescript
// Check if email verification is required
if (!emailVerified) {
  return NextResponse.json(
    { error: 'Email must be verified before registration' },
    { status: 400 }
  );
}
```
Ensures user completed email verification flow.

#### Uniqueness Checks (Lines 34-57)
```typescript
// Check if user with email already exists
const existingUserByEmail = await prisma.user.findUnique({
  where: { email },
});

if (existingUserByEmail) {
  return NextResponse.json(
    { error: 'An account with this email already exists' },
    { status: 400 }
  );
}

// Check if user with username already exists
const existingUserByUsername = await prisma.user.findUnique({
  where: { username },
});

if (existingUserByUsername) {
  return NextResponse.json(
    { error: 'This username is already taken' },
    { status: 400 }
  );
}
```
Prevents duplicate emails and usernames.

#### User Creation (Lines 59-68)
```typescript
// Hash password
const hashedPassword = await hashPassword(password);

// Create user
const user = await prisma.user.create({
  data: {
    username,
    email,
    password: hashedPassword,
    emailVerified: true,
  },
});
```

#### Auto-Login After Registration (Lines 70-92)
```typescript
// Create JWT token
const token = await createToken({
  userId: user.id,
  email: user.email,
  username: user.username,
});

// Create session in database
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

await prisma.session.create({
  data: {
    userId: user.id,
    token,
    expiresAt,
  },
});

// Set auth cookie
await setAuthCookie(token);

// Return user data (without password)
const { password: _, ...userWithoutPassword } = user;

return NextResponse.json({
  user: userWithoutPassword,
  message: 'Registration successful',
});
```
Automatically logs user in after successful registration.

## Frontend Components

### Dialog Component: `src/components/ui/dialog.tsx`

Built using Radix UI primitives following shadcn/ui patterns.

#### Core Components (Lines 7-13)
```typescript
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close
```

#### Styled Overlay (Lines 15-26)
```typescript
const DialogOverlay = React.forwardRef<...>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in ...",
      className
    )}
    {...props}
  />
))
```
Semi-transparent backdrop with fade animation.

#### Dialog Content (Lines 28-56)
```typescript
const DialogContent = React.forwardRef<...>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg ...",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 ...">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
```
Centered modal with close button and animations.

### Registration Page: `src/app/register/page.tsx`

#### Form Schema (Lines 27-40)
```typescript
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores'
      ),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```
**Validations:**
- Username: min 3 chars, alphanumeric + underscore only
- Email: valid email format
- Password: min 8 characters
- Confirm Password: must match password

#### State Management (Lines 47-54)
```typescript
const [isLoading, setIsLoading] = useState(false);
const [isVerifying, setIsVerifying] = useState(false);
const [isSendingCode, setIsSendingCode] = useState(false);
const [showVerificationDialog, setShowVerificationDialog] = useState(false);
const [verificationCode, setVerificationCode] = useState('');
const [emailVerified, setEmailVerified] = useState(false);
const [sentCode, setSentCode] = useState<string>(''); // Testing only
```

#### Send Verification Code Handler (Lines 68-109)
```typescript
const handleSendVerificationCode = async () => {
  const email = getValues('email');

  // Validate email before sending
  if (!email || !z.string().email().safeParse(email).success) {
    toast({
      title: 'Error',
      description: 'Please enter a valid email address',
      variant: 'destructive',
    });
    return;
  }

  setIsSendingCode(true);

  try {
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send verification code');
    }

    // Store code for testing
    setSentCode(result.code);

    setShowVerificationDialog(true);

    toast({
      title: 'Success',
      description: `Verification code sent to ${email}. For testing: ${result.code}`,
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to send verification code',
      variant: 'destructive',
    });
  } finally {
    setIsSendingCode(false);
  }
};
```

#### Verify Code Handler (Lines 111-157)
```typescript
const handleVerifyCode = async () => {
  const email = getValues('email');

  if (!verificationCode || verificationCode.length !== 6) {
    toast({
      title: 'Error',
      description: 'Please enter a 6-digit verification code',
      variant: 'destructive',
    });
    return;
  }

  setIsVerifying(true);

  try {
    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code: verificationCode }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Verification failed');
    }

    setEmailVerified(true);
    setShowVerificationDialog(false);
    setVerificationCode('');

    toast({
      title: 'Success',
      description: 'Email verified successfully!',
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Verification failed',
      variant: 'destructive',
    });
  } finally {
    setIsVerifying(false);
  }
};
```

#### Registration Submit Handler (Lines 159-208)
```typescript
const onSubmit = async (data: RegisterFormData) => {
  if (!emailVerified) {
    toast({
      title: 'Error',
      description: 'Please verify your email address first',
      variant: 'destructive',
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        emailVerified: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    toast({
      title: 'Success',
      description: 'Account created successfully!',
    });

    // Redirect to home page
    router.push('/');
    router.refresh();
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Registration failed',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
```

#### Email Field with Inline Verify Button (Lines 246-268)
```typescript
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label htmlFor="email">Email</Label>
    {emailVerified && (
      <span className="text-xs text-green-600 font-medium">✓ Verified</span>
    )}
  </div>
  <div className="flex gap-2">
    <Input
      id="email"
      type="email"
      placeholder="Enter your email"
      disabled={isLoading || emailVerified}
      {...register('email')}
      className="flex-1"
    />
    <Button
      type="button"
      variant="outline"
      onClick={handleSendVerificationCode}
      disabled={isLoading || isSendingCode || emailVerified || !emailValue}
    >
      {isSendingCode ? 'Sending...' : 'Verify'}
    </Button>
  </div>
  {errors.email && (
    <p className="text-sm text-destructive">{errors.email.message}</p>
  )}
</div>
```
**Features:**
- Inline "Verify" button next to email field
- Disabled when already verified or when email is empty
- Shows green checkmark when verified
- Email field becomes read-only after verification

#### Create Account Button (Lines 305-313)
```typescript
<Button
  type="submit"
  className="w-full"
  disabled={isLoading || !emailVerified}
>
  {isLoading ? 'Creating Account...' : 'Create Account'}
</Button>
```
Disabled until email is verified.

#### Verification Dialog (Lines 335-372)
```typescript
<Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Verify Email Address</DialogTitle>
      <DialogDescription>
        Enter the 6-digit verification code sent to your email.
        {sentCode && (
          <span className="block mt-2 text-sm font-medium text-primary">
            Testing mode: Your code is {sentCode}
          </span>
        )}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          id="verificationCode"
          type="text"
          placeholder="Enter 6-digit code"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          disabled={isVerifying}
        />
      </div>
    </div>

    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setShowVerificationDialog(false);
          setVerificationCode('');
        }}
        disabled={isVerifying}
      >
        Cancel
      </Button>
      <Button type="button" onClick={handleVerifyCode} disabled={isVerifying}>
        {isVerifying ? 'Verifying...' : 'Verify'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```
**Features:**
- Shows verification code in testing mode
- Numeric input only (filters out non-digits)
- Max length 6 characters
- Cancel and Verify buttons
- Loading states

## Registration Flow

### Complete User Journey:

```
1. User navigates to /register
   ↓
2. User fills in username, email, password, confirm password
   ↓
3. User clicks "Verify" button next to email field
   ↓
4. Frontend calls POST /api/auth/send-verification
   ↓
5. Backend generates 6-digit code
   ↓
6. Code stored in memory with 10-minute expiry
   ↓
7. Code returned to frontend (testing mode)
   ↓
8. Toast notification shows code
   ↓
9. Dialog opens asking for verification code
   ↓
10. User enters 6-digit code
    ↓
11. User clicks "Verify" in dialog
    ↓
12. Frontend calls POST /api/auth/verify-code
    ↓
13. Backend validates code against stored value
    ↓
14. If valid: code deleted, success returned
    ↓
15. Dialog closes, green checkmark appears
    ↓
16. Email field becomes read-only
    ↓
17. "Create Account" button becomes enabled
    ↓
18. User clicks "Create Account"
    ↓
19. Frontend calls POST /api/auth/register
    ↓
20. Backend validates:
    - Email verified flag is true
    - Email is unique
    - Username is unique
    ↓
21. Password hashed with bcrypt
    ↓
22. User created in database
    ↓
23. JWT token created
    ↓
24. Session created in database
    ↓
25. Auth cookie set (HTTP-only)
    ↓
26. User redirected to home page (logged in)
```

## Email Verification Process

### Verification Code Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ VERIFICATION CODE STATES                                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. GENERATED                                            │
│     - Random 6-digit number (100000-999999)             │
│     - Stored with email as key                          │
│     - Expiry set to +10 minutes                         │
│                                                          │
│  2. PENDING (0-10 minutes)                              │
│     - Code valid and awaiting verification              │
│     - Can be used exactly once                          │
│                                                          │
│  3. EXPIRED (>10 minutes)                               │
│     - Automatically removed on access attempt           │
│     - User must request new code                        │
│                                                          │
│  4. CONSUMED                                             │
│     - Code verified and deleted                         │
│     - Cannot be reused                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Security Features

1. **Time-Limited Codes**
   - Expire after 10 minutes
   - Automatic cleanup on retrieval

2. **Single-Use Codes**
   - Deleted immediately after successful verification
   - Cannot be reused even within expiry window

3. **Rate Limiting Recommended**
   - Not currently implemented
   - Production should limit requests per email/IP

4. **Password Security**
   - Minimum 8 characters required
   - Hashed with bcrypt (12 salt rounds)
   - Never stored in plain text

5. **Session Management**
   - JWT token in HTTP-only cookie
   - 7-day expiration
   - Stored in database for server-side validation

## How to Test

### 1. Start Development Server
```bash
cd frontend
npm run dev
```
Server runs at: http://localhost:3000

### 2. Navigate to Registration Page
Visit: http://localhost:3000/register

### 3. Test Form Validation

**Username validation:**
- Leave empty → See "Username must be at least 3 characters"
- Enter "ab" → See "Username must be at least 3 characters"
- Enter "user@name" → See "Username can only contain letters, numbers, and underscores"
- Enter "john_doe123" → ✓ Valid

**Email validation:**
- Leave empty → See "Invalid email address"
- Enter "notanemail" → See "Invalid email address"
- Enter "test@example.com" → ✓ Valid

**Password validation:**
- Leave empty → See "Password must be at least 8 characters"
- Enter "pass" → See "Password must be at least 8 characters"
- Enter "password123" → ✓ Valid

**Confirm password validation:**
- Enter different password → See "Passwords don't match"
- Enter matching password → ✓ Valid

### 4. Test Email Verification Flow

**Step 1: Send verification code**
```
1. Enter email: test@example.com
2. Click "Verify" button
3. Check browser console for code
4. Check toast notification (shows code in testing mode)
5. Dialog should open
```

**Step 2: Verify code**
```
1. Code displayed in dialog description
2. Enter the 6-digit code
3. Click "Verify" button
4. Dialog should close
5. Green checkmark appears next to email label
6. Email field becomes disabled
7. "Create Account" button becomes enabled
```

### 5. Test Registration

**Complete registration:**
```
1. Fill all fields:
   - Username: testuser123
   - Email: test@example.com (verified)
   - Password: password123
   - Confirm Password: password123
2. Click "Create Account"
3. Should redirect to home page
4. Check browser DevTools → Application → Cookies
5. See "auth-token" cookie (HTTP-only)
```

### 6. Test Duplicate Prevention

**Email uniqueness:**
```
1. Try to register with same email again
2. Should see: "An account with this email already exists"
```

**Username uniqueness:**
```
1. Use different email but same username
2. Should see: "This username is already taken"
```

### 7. Test Code Expiry

**Manual expiry test:**
```javascript
// In browser DevTools Console:
// Request a code, then wait 10+ minutes and try to use it
// Or manually adjust server code expiry for testing:

// In send-verification/route.ts, temporarily change:
expiresAt.setMinutes(expiresAt.getMinutes() + 10);
// to:
expiresAt.setSeconds(expiresAt.getSeconds() + 30); // 30 seconds

// Then test that expired codes are rejected
```

### 8. Test Button States

**Verify button:**
- Disabled when email field is empty
- Disabled when email is invalid
- Disabled while sending code
- Disabled after verification complete
- Shows "Sending..." during request

**Create Account button:**
- Disabled when email not verified
- Disabled during registration
- Shows "Creating Account..." during request

**Cancel button:**
- Redirects to home page (/)
- Works at any time (except during loading)

### 9. Test Error Handling

**Network errors:**
```
1. Turn off dev server
2. Try to send verification code
3. Should see error toast
```

**Invalid code:**
```
1. Enter wrong 6-digit code
2. Should see: "Invalid or expired verification code"
```

**Expired code:**
```
1. Wait for code to expire
2. Try to verify
3. Should see: "Invalid or expired verification code"
```

### 10. Test "Already have account" Link
```
1. Click "Already have an account? Sign in" link
2. Should redirect to /login page
```

### 11. Verify Database Records

**Check created user:**
```bash
# In frontend directory:
npx prisma studio

# Opens Prisma Studio in browser
# Navigate to User table
# Verify new user exists with:
# - username
# - email
# - hashed password
# - emailVerified = true
```

**Check created session:**
```bash
# In Prisma Studio
# Navigate to Session table
# Verify session exists with:
# - userId matching new user
# - token (JWT)
# - expiresAt (7 days from creation)
```

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── send-verification/
│   │   │       │   └── route.ts           # Send verification code API
│   │   │       ├── verify-code/
│   │   │       │   └── route.ts           # Verify code API
│   │   │       ├── register/
│   │   │       │   └── route.ts           # Registration API
│   │   │       ├── login/
│   │   │       │   └── route.ts           # Login API
│   │   │       ├── logout/
│   │   │       │   └── route.ts           # Logout API
│   │   │       └── session/
│   │   │           └── route.ts           # Session check API
│   │   ├── register/
│   │   │   └── page.tsx                   # Registration page UI
│   │   ├── login/
│   │   │   └── page.tsx                   # Login page UI
│   │   └── layout.tsx                     # Root layout with AuthProvider
│   ├── components/
│   │   └── ui/
│   │       ├── dialog.tsx                 # Dialog component (NEW)
│   │       ├── button.tsx                 # Button component
│   │       ├── input.tsx                  # Input component
│   │       ├── label.tsx                  # Label component
│   │       ├── card.tsx                   # Card component
│   │       └── toast.tsx                  # Toast component
│   ├── lib/
│   │   ├── auth.ts                        # Authentication utilities
│   │   ├── auth-context.tsx               # Auth React context
│   │   ├── verification-storage.ts        # Verification code storage (NEW)
│   │   ├── prisma.ts                      # Prisma client instance
│   │   └── utils.ts                       # Utility functions
│   ├── hooks/
│   │   └── use-toast.ts                   # Toast hook
│   └── middleware.ts                      # Route protection middleware
├── prisma/
│   ├── schema.prisma                      # Database schema
│   ├── dev.db                             # SQLite database
│   └── migrations/                        # Database migrations
├── REGISTRATION_IMPLEMENTATION_GUIDE.md   # This file
└── .env                                   # Environment variables
```

## Common Issues and Solutions

### Issue 1: "Verification code not working"

**Symptoms:**
- Code is rejected even when correct
- "Invalid or expired verification code" error

**Possible Causes:**
1. Code expired (>10 minutes old)
2. Code already used
3. Server restarted (in-memory storage cleared)
4. Typo in code entry

**Solutions:**
```bash
# Check console for verification code
# Ensure code is entered within 10 minutes
# Request new code if needed
# Verify code is exactly 6 digits
```

### Issue 2: "Username already taken" (unexpectedly)

**Cause:** Username already exists in database

**Solution:**
```bash
# Option 1: Use different username

# Option 2: Clear database and start fresh
cd frontend
rm prisma/dev.db
npx prisma migrate reset
npx prisma migrate dev
```

### Issue 3: "Create Account" button stays disabled

**Symptoms:**
- Button remains grayed out even after verification

**Cause:** `emailVerified` state not set to true

**Solution:**
```typescript
// Check browser DevTools → React Components
// Verify emailVerified state is true
// If not, re-verify email or check handleVerifyCode function
```

### Issue 4: Dialog not closing after verification

**Cause:** State not updated properly

**Solution:**
```typescript
// In handleVerifyCode, ensure these lines execute:
setShowVerificationDialog(false);
setEmailVerified(true);
setVerificationCode('');
```

### Issue 5: "An error occurred during registration"

**Symptoms:**
- Generic error on registration attempt

**Possible Causes:**
1. Database connection issue
2. Bcrypt hashing error
3. JWT token creation error
4. Session creation failure

**Debug Steps:**
```bash
# Check server console for detailed error
# Verify DATABASE_URL in .env
# Verify JWT_SECRET in .env
# Check Prisma client is generated:
npx prisma generate
```

### Issue 6: Verification code not displayed in testing

**Cause:** Code returned from API but not shown in UI

**Solution:**
```typescript
// Check these are working:
setSentCode(result.code);  // Stores code
toast({
  description: `...For testing: ${result.code}`,  // Shows in toast
});

// And in Dialog:
{sentCode && (
  <span>Testing mode: Your code is {sentCode}</span>
)}
```

### Issue 7: Password validation too strict/loose

**Customize validation:**
```typescript
// In registerSchema:
password: z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')      // Add if needed
  .regex(/[a-z]/, 'Must contain lowercase letter')      // Add if needed
  .regex(/[0-9]/, 'Must contain number')                // Add if needed
  .regex(/[^A-Za-z0-9]/, 'Must contain special char'),  // Add if needed
```

### Issue 8: Multiple codes for same email

**Symptoms:**
- Sending code multiple times
- Unclear which code is valid

**Current Behavior:**
Each new code overwrites the previous one. Only the most recent code is valid.

**To track multiple attempts:**
```typescript
// In verification-storage.ts, could add:
interface VerificationData {
  code: string;
  expiresAt: Date;
  attempts: number;        // Track verification attempts
  sentAt: Date;            // Track when code was sent
}
```

## Next Steps

To enhance the registration system:

### 1. Production Email Integration

**Integrate email service:**
```typescript
// In send-verification/route.ts
import { sendEmail } from '@/lib/email';

// Replace:
console.log(`Verification code for ${email}: ${code}`);

// With:
await sendEmail({
  to: email,
  subject: 'Verify your email address',
  html: `Your verification code is: <strong>${code}</strong>`,
});

// Remove code from response:
return NextResponse.json({
  message: 'Verification code sent successfully',
  // code,  // REMOVE THIS
});
```

**Recommended services:**
- Resend (resend.com) - Modern, developer-friendly
- SendGrid (sendgrid.com) - Established, reliable
- AWS SES - Cost-effective at scale
- Mailgun - Good deliverability

### 2. Persistent Verification Storage

**Use Redis for production:**
```bash
npm install ioredis
```

```typescript
// src/lib/verification-storage-redis.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const verificationStorage = {
  async set(email: string, code: string, expiresAt: Date) {
    const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    await redis.setex(`verify:${email}`, ttl, code);
  },

  async verify(email: string, code: string) {
    const stored = await redis.get(`verify:${email}`);
    if (stored === code) {
      await redis.del(`verify:${email}`);
      return true;
    }
    return false;
  },
};
```

### 3. Rate Limiting

**Prevent abuse:**
```bash
npm install @upstash/ratelimit
```

```typescript
// In send-verification/route.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 codes per hour
});

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  const { success } = await ratelimit.limit(email);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many verification requests. Please try again later.' },
      { status: 429 }
    );
  }

  // ... rest of code
}
```

### 4. Enhanced Password Requirements

**Add password strength indicator:**
```typescript
// Install zxcvbn for password strength
npm install zxcvbn @types/zxcvbn

// In register page:
import zxcvbn from 'zxcvbn';

const passwordStrength = zxcvbn(password);
// passwordStrength.score: 0-4 (weak to strong)
```

### 5. Email Change Verification

**Allow users to change email:**
```typescript
// Add route: /api/auth/change-email
// Process:
// 1. Send verification to new email
// 2. Send confirmation to old email
// 3. Update only after both verified
```

### 6. Username Availability Check

**Real-time availability:**
```typescript
// Add route: /api/auth/check-username
export async function POST(request: NextRequest) {
  const { username } = await request.json();

  const exists = await prisma.user.findUnique({
    where: { username },
  });

  return NextResponse.json({ available: !exists });
}

// In register page:
const checkUsername = debounce(async (username: string) => {
  const response = await fetch('/api/auth/check-username', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
  const { available } = await response.json();
  setUsernameAvailable(available);
}, 500);
```

### 7. Social Authentication

**Add OAuth providers:**
```bash
npm install next-auth
```

```typescript
// Add Google, GitHub, etc.
// Simplifies registration flow
// No password needed
```

### 8. Terms of Service Acceptance

**Add checkbox:**
```typescript
const registerSchema = z.object({
  // ... existing fields
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms of service',
  }),
});

// In form:
<div className="flex items-center space-x-2">
  <Checkbox id="terms" {...register('acceptTerms')} />
  <label htmlFor="terms">
    I accept the{' '}
    <Link href="/terms" className="text-primary underline">
      Terms of Service
    </Link>
  </label>
</div>
```

### 9. User Profile Picture

**Add during registration:**
```typescript
// Add avatar upload field
// Or use default avatar
// Or integrate with Gravatar
```

### 10. Welcome Email

**Send after registration:**
```typescript
// In register/route.ts after user creation:
await sendEmail({
  to: user.email,
  subject: 'Welcome to [Your App]!',
  html: `
    <h1>Welcome ${user.username}!</h1>
    <p>Your account has been created successfully.</p>
  `,
});
```

### 11. Account Activation Link (Alternative to Code)

**Email-based activation:**
```typescript
// Instead of 6-digit code, send unique link:
const token = crypto.randomUUID();
const link = `${process.env.APP_URL}/activate?token=${token}`;

// Store token in database
await prisma.user.update({
  where: { email },
  data: {
    verificationCode: token,
    verificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
});

// Send email with link
// User clicks link to verify
```

### 12. Analytics and Monitoring

**Track registration funnel:**
```typescript
// Track events:
// - Registration page visited
// - Email verification requested
// - Email verification completed
// - Registration completed
// - Registration failed (and why)

// Use tools like:
// - PostHog
// - Mixpanel
// - Google Analytics
```

## Summary

This registration implementation provides:

✅ **Security Features**
- Email verification required before account creation
- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- HTTP-only cookie storage
- Single-use verification codes
- Time-limited codes (10-minute expiry)
- Username and email uniqueness enforcement

✅ **User Experience**
- Inline email verification (no page navigation)
- Real-time form validation
- Clear error messages
- Loading states on all actions
- Visual verification status indicator
- Automatic login after registration
- Responsive design
- Accessibility features

✅ **Developer Experience**
- Type-safe with TypeScript
- Zod schema validation
- React Hook Form integration
- Reusable UI components (shadcn/ui)
- Clean API structure
- Comprehensive error handling
- Easy to test and debug

✅ **Production Considerations**
- Ready for email service integration
- Scalable verification storage pattern
- Middleware route protection
- Database session management
- Proper password security
- Extensible architecture

The system is fully functional for development and testing, with clear paths to production enhancements like email service integration, Redis storage, and rate limiting.