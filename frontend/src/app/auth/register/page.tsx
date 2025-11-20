"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

interface RegisterFormData {
    id: number;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

// 获取所有字段验证错误
const getValidationErrors = (data: RegisterFormData) => ({
    name:
        data.name.length === 0
            ? "Name is required."
            : data.name.length < 2
                ? "The name should be at least two characters long."
                : null,

    email:
        data.email.length === 0
            ? "Email is required."
            : !/\S+@\S+\.\S+/.test(data.email)
                ? "The email address format is invalid."
                : null,

    password:
        data.password.length === 0
            ? "Password is required."
            : !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(data.password)
                ? "Must contain uppercase, lowercase and numbers, at least 8 characters."
                : null,

    confirmPassword:
        data.confirmPassword.length === 0
            ? "Please confirm your password."
            : data.confirmPassword !== data.password
                ? "The passwords entered twice are inconsistent."
                : null,
});

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterFormData>({
        id: 0,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();

    const validationErrors = getValidationErrors(formData);

    // 提交验证
    const validateBeforeSubmit = () => {
        const errors = getValidationErrors(formData);
        if (errors.name) return setError(errors.name), false;
        if (errors.email) return setError(errors.email), false;
        if (errors.password) return setError(errors.password), false;
        if (errors.confirmPassword) return setError(errors.confirmPassword), false;

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

        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        if (!validateBeforeSubmit()) return;

        setIsSubmitting(true);
        const result = await register(formData);
        setIsSubmitting(false);

        if (!result) {
            setError("This email address has already been registered.");
        } else {
            setSuccess("Registered successfully!");
            window.location.href = "/auth/login";
        }
    };

    const showError = (field: keyof typeof validationErrors) =>
        touched[field] && validationErrors[field];

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-all duration-300"
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">Register</h1>
                    <p className="text-sm text-muted-foreground">
                        Create your account to get started.
                    </p>
                </div>

                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}

                {/* Name */}
                <div className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({...formData, name: e.target.value})
                        }
                        onBlur={() => setTouched({...touched, name: true})}
                        className={showError("name") ? "border-red-500" : ""}
                    />
                    {showError("name") && (
                        <p className="text-sm text-red-500">{validationErrors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({...formData, email: e.target.value})
                        }
                        onBlur={() => setTouched({...touched, email: true})}
                        className={showError("email") ? "border-red-500" : ""}
                    />
                    {showError("email") && (
                        <p className="text-sm text-red-500">{validationErrors.email}</p>
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
                            setFormData({...formData, password: e.target.value})
                        }
                        onBlur={() => setTouched({...touched, password: true})}
                        className={showError("password") ? "border-red-500" : ""}
                    />
                    {showError("password") && (
                        <p className="text-sm text-red-500">{validationErrors.password}</p>
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
                            setFormData({...formData, confirmPassword: e.target.value})
                        }
                        onBlur={() =>
                            setTouched({...touched, confirmPassword: true})
                        }
                        className={
                            showError("confirmPassword") ? "border-red-500" : ""
                        }
                    />
                    {showError("confirmPassword") && (
                        <p className="text-sm text-red-500">
                            {validationErrors.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Terms */}
                <div className="mb-4 flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                agreeToTerms: (e.target as HTMLInputElement).checked,
                            })
                        }
                    />
                    <Label htmlFor="terms">I agree to the terms of service.</Label>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="mt-3 w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </Button>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
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