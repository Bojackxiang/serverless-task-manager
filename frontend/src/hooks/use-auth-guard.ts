"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export const useAuthGuard = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    // 未登录 → 重定向
    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [user, loading, router]);

    // 在未确定之前不渲染页面内容
    const shouldBlock = loading || (!loading && !user);

    return { user, loading, shouldBlock };
};