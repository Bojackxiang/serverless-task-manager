"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // ✅ 新增状态
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    // 页面加载时预填已保存的邮箱
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const validateEmail =
        email.length > 0 && !/\S+@\S+\.\S+/.test(email)
            ? "Invalid email format."
            : null;

    const validatePassword =
        password.length > 0 && password.length < 8
            ? "Password must be at least 8 characters long."
            : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (validateEmail) {
            setError(validateEmail);
            return;
        }
        if (validatePassword) {
            setError(validatePassword);
            return;
        }

        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (!result) {
            setError("Incorrect email or password.");
        } else {
            // 登录成功后保存或移除邮箱
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
            router.push("/");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md sm:max-w-sm transition-all duration-300 ease-in-out animate-fade-in"
                aria-describedby={error ? "login-error" : undefined}
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Login</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back! Please sign in.
                    </p>
                </div>

                {error && (
                    <div id="login-error" role="alert" className="text-red-600 mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!validateEmail}
                        aria-describedby={validateEmail ? "email-error" : undefined}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validateEmail && (
                        <p id="email-error" className="text-sm text-red-500 mt-1" role="alert">
                            {validateEmail}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-invalid={!!validatePassword}
                        aria-describedby={validatePassword ? "password-error" : undefined}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validatePassword && (
                        <p id="password-error" className="text-sm text-red-500 mt-1" role="alert">
                            {validatePassword}
                        </p>
                    )}
                </div>

                {/* Remember me */}
                <div className="flex items-center mb-4">
                    <Checkbox
                        id="rememberMe"
                        defaultChecked={rememberMe}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setRememberMe(e.target.checked)
                        }
                    />
                    <Label htmlFor="rememberMe" className="ml-2 text-sm">
                        Remember me
                    </Label>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full mt-2 transition-transform duration-200 hover:scale-[1.01] disabled:opacity-60"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            Logging in...
                        </span>
                    ) : (
                        "Login"
                    )}
                </Button>

                <p className="text-sm text-center mt-2">
                    <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </p>

                <p className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <Link href="/auth/register" className="text-blue-600 hover:underline transition-colors">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}