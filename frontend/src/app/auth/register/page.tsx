"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    // 实时验证
    const validateRealtime = {
        name:
            formData.name.length > 0 && formData.name.length < 2
                ? "The name should be at least two characters long."
                : null,

        email:
            formData.email.length > 0 && !/\S+@\S+\.\S+/.test(formData.email)
                ? "The email address format is invalid."
                : null,

        password:
            formData.password.length > 0 &&
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(formData.password)
                ? "Must contain uppercase, lowercase and numbers, at least 8 characters."
                : null,

        confirmPassword:
            formData.confirmPassword.length > 0 &&
            formData.confirmPassword !== formData.password
                ? "The passwords entered twice are inconsistent."
                : null,
    };

    // 最终提交验证
    const validateBeforeSubmit = (): boolean => {
        if (validateRealtime.name) return setError(validateRealtime.name), false;
        if (validateRealtime.email) return setError(validateRealtime.email), false;
        if (validateRealtime.password) return setError(validateRealtime.password), false;
        if (validateRealtime.confirmPassword) return setError(validateRealtime.confirmPassword), false;

        if (!formData.agreeToTerms) {
            setError("You must agree to the terms of service.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateBeforeSubmit()) return;

        setIsSubmitting(true);
        const result = await register(formData);
        setIsSubmitting(false);

        if (!result) {
            setError("This email address has already been registered.");
        } else {
            setSuccess("Registered successfully!");
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                agreeToTerms: false,
            });
            router.push("/auth/login");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="
                    bg-white p-8 rounded-2xl shadow-lg
                    w-full max-w-md sm:max-w-sm
                    transition-all duration-300 ease-in-out
                    animate-fade-in
                "
                aria-describedby={error ? "register-error" : undefined}
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Register</h1>
                    <p className="text-sm text-muted-foreground">
                        Create your account to get started.
                    </p>
                </div>

                {/* 全局错误 */}
                {error && (
                    <div id="register-error" className="text-red-600 mb-4 text-sm font-medium" role="alert">
                        {error}
                    </div>
                )}

                {/* 全局成功 */}
                {success && (
                    <p className="text-green-600 mb-4 text-sm font-medium" role="status">
                        {success}
                    </p>
                )}

                {/* Name */}
                <div className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        aria-invalid={!!validateRealtime.name}
                        aria-describedby={
                            validateRealtime.name ? "name-error" : undefined
                        }
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validateRealtime.name && (
                        <p id="name-error" className="text-sm text-red-500 mt-1" role="alert">
                            {validateRealtime.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        aria-invalid={!!validateRealtime.email}
                        aria-describedby={
                            validateRealtime.email ? "email-error" : undefined
                        }
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validateRealtime.email && (
                        <p id="email-error" className="text-sm text-red-500 mt-1" role="alert">
                            {validateRealtime.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        aria-invalid={!!validateRealtime.password}
                        aria-describedby={
                            validateRealtime.password ? "password-error" : undefined
                        }
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validateRealtime.password && (
                        <p id="password-error" className="text-sm text-red-500 mt-1" role="alert">
                            {validateRealtime.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        aria-invalid={!!validateRealtime.confirmPassword}
                        aria-describedby={
                            validateRealtime.confirmPassword
                                ? "confirm-error"
                                : undefined
                        }
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {validateRealtime.confirmPassword && (
                        <p id="confirm-error" className="text-sm text-red-500 mt-1" role="alert">
                            {validateRealtime.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Terms */}
                <div className="mb-4 flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        onChange={(e) => {
                            const input = e.target as HTMLInputElement;
                            setFormData({...formData, agreeToTerms: input.checked});
                        }}
                    />
                    <Label htmlFor="terms" className="text-sm">
                        I agree to the terms of service.
                    </Label>
                </div>

                {/* 提交按钮 */}
                <Button
                    type="submit"
                    className="
                        w-full mt-2
                        transition-transform duration-200
                        hover:scale-[1.01]
                        disabled:opacity-60
                    "
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="w-4 h-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            Registering...
                        </span>
                    ) : (
                        "Register"
                    )}
                </Button>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="text-blue-600 hover:underline transition-colors"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}