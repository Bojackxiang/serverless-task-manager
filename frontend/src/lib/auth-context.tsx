"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
    id: number;
    email: string;
    name: string;
}

interface RegisterData {
    email: string;
    name: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// src/lib/auth-context.tsx

// mock 用户数据
const mockUsers: RegisterData[] = [
    { email: "admin@example.com", name: "Admin", password: "admin123" },
];


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const handleAuthError = (err: unknown) => {
        if (err instanceof Error) {
            if (err.message.includes("NetworkError")) {
                setAuthError("Network error. Please check your internet connection.");
            } else if (err.message.includes("ServerError")) {
                setAuthError("Server error. Please try again later.");
            } else {
                setAuthError(err.message || "An unknown error occurred.");
            }
        } else {
            setAuthError("Something went wrong. Please try again.");
        }
    };

    // ➤ 初始化：检查 localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // ➤ 登录逻辑
    const login = async (email: string, password: string) => {
        setAuthError(null);
        setLoading(true);
        try {
            if (Math.random() < 0.1) {
                throw new Error("NetworkError: Connection timeout");
            }

            await new Promise((res) => setTimeout(res, 1000));

            if (Math.random() < 0.05) {
                throw new Error("ServerError: Internal server error");
            }

            const found = mockUsers.find((u) => u.email === email && u.password === password);
            if (!found) {
                throw new Error("AuthError: Invalid email or password");
            }

            const userInfo = { id: 1, email: found.email, name: found.name };
            setUser(userInfo);
            localStorage.setItem("user", JSON.stringify(userInfo));
            setLoading(false);
            return true;

        } catch (err) {
            handleAuthError(err);
            setLoading(false);
            return false;
        }
    };

    // ➤ 注册逻辑
    const register = async (userData: RegisterData): Promise<boolean> => {
        setAuthError(null);
        setLoading(true);

        try {
            // 模拟网络错误（10% 概率）
            if (Math.random() < 0.1) {
                throw new Error("NetworkError: Connection timeout");
            }

            await new Promise((res) => setTimeout(res, 1000));

            // 模拟服务器错误（5% 概率）
            if (Math.random() < 0.05) {
                throw new Error("ServerError: Internal server error");
            }

            // 账号已存在（验证错误）
            const exists = mockUsers.find((u) => u.email === userData.email);
            if (exists) {
                throw new Error("AuthError: Email already registered");
            }

            // 创建新用户
            mockUsers.push(userData);
            const newUser = { id: mockUsers.length, email: userData.email, name: userData.name };
            setUser(newUser);

            // 持久化
            localStorage.setItem("user", JSON.stringify(newUser));

            setLoading(false);
            return true;

        } catch (err) {
            handleAuthError(err);   // 核心：调用统一错误处理
            setLoading(false);
            return false;
        }
    };

    // ➤ 登出逻辑
    const logout = () => {
        console.log("[auth-context] Logout clicked");
        localStorage.removeItem("user");
        setUser(null);
       // setIsAuthenticated(false);
        window.location.replace("/auth/login");
    };

    const value: AuthContextType = {
        user,
        loading,
        error: authError,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ➤ 自定义 hook，方便其他组件使用
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};