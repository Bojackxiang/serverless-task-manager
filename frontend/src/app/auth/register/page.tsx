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

    const { register } = useAuth();
    const router = useRouter();

    const validate = (): boolean => {
        if (formData.name.length < 2) {
            setError("The name should be at least two characters long.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("The email address format is invalid.");
            return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(formData.password)) {
            setError("The password must contain at least 8 characters, including both upper and lower case as well as numbers.");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("The passwords entered twice are inconsistent.");
            return false;
        }
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

        if (!validate()) return;

        const result = await register(formData);
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
            alert("Register successfully. Now you are redirected to the login page...");
            router.push("/auth/login");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Register</h1>
                </div>

                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}

                <div className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                </div>

                <div className="mb-4 flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        onChange={(e) => {
                            const input = e.target as HTMLInputElement;
                            setFormData({...formData, agreeToTerms: input.checked});
                        }}
                    />
                    <Label htmlFor="terms" className="text-sm">
                        I have read and agreed to the terms of service.
                    </Label>
                </div>

                <Button type="submit" className="w-full">
                    Register
                </Button>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}