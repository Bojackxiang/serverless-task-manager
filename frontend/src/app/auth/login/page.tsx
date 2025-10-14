"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
//import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// 1. 表单验证规则（3.2）
const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "The password should be at least 6 characters long" }),
    remember: z.boolean().optional(),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [loginError, setLoginError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            remember: true,
        },
    });

    const router = useRouter();
    const onSubmit = async (data: LoginData) => {
        setLoginError(null); // 清除旧错误

        // 🔧 替换为 mockLogin 验证
        const { email, password } = data;
        await new Promise((res) => setTimeout(res, 1000)); // 模拟延迟

        if (email === "admin@example.com" && password === "admin123") {
            alert("Login Successfully！");
            router.push("/");
        } else {
            setLoginError("The email or password is incorrect");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold">
                        Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* 邮箱 */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* 密码 */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* 记住我 */}
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" {...register("remember")} />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>

                        {/* 错误提示 */}
                        {loginError && (
                            <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{loginError}</span>
                            </div>
                        )}

                        {/* 登录按钮 */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Being logging in..." : "Login"}
                        </Button>
                    </form>

                    {/* 底部链接 */}
                    <div className="flex justify-between items-center text-sm mt-4">
                        <Link href="#" className="text-blue-600 hover:underline">
                            Forget password？
                        </Link>
                        <Link href="/auth/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}