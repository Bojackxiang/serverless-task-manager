"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!/\S+@\S+\.\S+/.test(email)) {
            setStatus("error");
            return;
        }

        // 从 localStorage 中读取注册用户列表
        const stored = localStorage.getItem("registeredUsers");
        let registeredEmails: string[] = [];

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    registeredEmails = parsed
                        .filter((u) => typeof u.email === "string")
                        .map((u) => u.email.toLowerCase());
                }
            } catch (err) {
                console.error("Error parsing registered users", err);
            }
        }

        // 检查是否匹配
        if (registeredEmails.includes(email.toLowerCase())) {
            setStatus("success");
        } else {
            setStatus("error");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md transition-all"
            >
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to receive a reset link.
                    </p>
                </div>

                {status === "success" && (
                    <div className="text-green-600 text-center mb-4" role="status">
                        ✅ A reset link has been sent to <strong>{email}</strong>.
                    </div>
                )}
                {status === "error" && (
                    <div className="text-red-600 text-center mb-4" role="alert">
                        ❌ Email not found. Please enter a registered email.
                    </div>
                )}

                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setStatus("idle");
                        }}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full transition-transform hover:scale-[1.01]"
                >
                    Send Reset Link
                </Button>

                <p className="text-sm text-center mt-4">
                    Back to{" "}
                    <button
                        type="button"
                        onClick={() => (window.location.href = "/auth/login")}
                        className="text-blue-600 hover:underline bg-transparent p-0 border-none cursor-pointer text-sm"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
}