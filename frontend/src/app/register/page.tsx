"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [sentCode, setSentCode] = useState<string>(""); // For testing purposes

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Watch email field to enable/disable verify button
  const emailValue = watch("email");

  const handleSendVerificationCode = async () => {
    const email = getValues("email");

    // Validate email before sending
    if (!email || !z.string().email().safeParse(email).success) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSendingCode(true);

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send verification code");
      }

      // Store the code for testing (in production, this wouldn't be returned)
      setSentCode(result.code);

      setShowVerificationDialog(true);

      toast({
        title: "Success",
        description: `Verification code sent to ${email}. For testing: ${result.code}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    const email = getValues("email");

    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Verification failed");
      }

      setEmailVerified(true);
      setShowVerificationDialog(false);
      setVerificationCode("");

      toast({
        title: "Success",
        description: "Email verified successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Verification failed",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!emailVerified) {
      toast({
        title: "Error",
        description: "Please verify your email address first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        throw new Error(result.error || "Registration failed");
      }

      // Refresh user state to update sidebar
      await refreshUser();

      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Enter your information to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  disabled={isLoading}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  {emailVerified && (
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={isLoading || emailVerified}
                    {...register("email")}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendVerificationCode}
                    disabled={
                      isLoading || isSendingCode || emailVerified || !emailValue
                    }
                  >
                    {isSendingCode ? "Sending..." : "Verify"}
                  </Button>
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password (min 8 characters)"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !emailVerified}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Dialog */}
      <Dialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
      >
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
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
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
                setVerificationCode("");
              }}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
