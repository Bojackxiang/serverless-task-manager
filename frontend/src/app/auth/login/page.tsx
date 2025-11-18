"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();

    // 页面加载时预填已保存的邮箱
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    // Email 验证
    const validateEmail =
        email.length === 0
            ? "Email is required."
            : !/\S+@\S+\.\S+/.test(email)
                ? "Invalid email format."
                : null;

    // Password 验证
    const validatePassword =
        password.length === 0
            ? "Password is required."
            : password.length < 8
                ? "Password must be at least 8 characters long."
                : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // 提交时强制标记为 touched
        setEmailTouched(true);
        setPasswordTouched(true);

        if (validateEmail) return setError(validateEmail);
        if (validatePassword) return setError(validatePassword);

        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (!result) {
            setError("Incorrect email or password.");
        } else {
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
            window.location.href = "/";
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md sm:max-w-sm animate-fade-in"
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Login</h1>
                    <p className="text-sm text-muted-foreground">Welcome back! Please sign in.</p>
                </div>

                {error && (
                    <div className="text-red-600 mb-4 text-sm font-medium">{error}</div>
                )}

                {/* Email */}
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                    />
                    {emailTouched && validateEmail && (
                        <p className="text-sm text-red-500 mt-1">{validateEmail}</p>
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
                        onBlur={() => setPasswordTouched(true)}
                    />
                    {passwordTouched && validatePassword && (
                        <p className="text-sm text-red-500 mt-1">{validatePassword}</p>
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
                    className="w-full mt-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <p className="text-sm text-center mt-2">
                    <button
                        type="button"
                        onClick={() => (window.location.href = "/auth/forgot-password")}
                        className="text-blue-600 hover:underline"
                    >
                        Forgot password?
                    </button>
                </p>

                <p className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <button
                        type="button"
                        onClick={() => (window.location.href = "/auth/register")}
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </button>
                </p>
            </form>
        </div>
    );
}