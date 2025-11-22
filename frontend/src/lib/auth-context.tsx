"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
//import {router} from "next/client";

export interface User {
    id: number;
    email: string;
    name: string;
}

interface RegisterData {
    id: number;
    name: string;
    email: string;
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
// const mockUsers: RegisterData[] = [
//     { email: "admin@example.com", name: "Admin", password: "admin123" },
// ];


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [users, setUsers] = useState<RegisterData[]>([]);

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

    // 初始化：检查 localStorage
    useEffect(() => {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            const defaultAdmin = [{
                id: 1,
                name: "Admin",
                email: "admin@example.com",
                password: "admin123"
            }];
            localStorage.setItem("users", JSON.stringify(defaultAdmin));
            setUsers(defaultAdmin);
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            const avatarKey = `userAvatar_${parsed.id}`;
            if (!localStorage.getItem(avatarKey)) {
                localStorage.setItem(avatarKey, "/Picture.png");
            }
        }

        setLoading(false);
    }, []);

    // 登录逻辑
    const login = async (email: string, password: string) => {
        setAuthError(null);
        setLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 1000));

            const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]") as RegisterData[];

            const found = storedUsers.find((u) => u.email === email && u.password === password);
            if (!found) {
                throw new Error("AuthError: Invalid email or password");
            }

            const storedDisplayName = localStorage.getItem(`displayName_${found.id}`) || found.name;
            const loggedInUser = {
                id: found.id,
                email: found.email,
                name: storedDisplayName,
            };

            setUser(loggedInUser);
            localStorage.setItem("user", JSON.stringify(loggedInUser));

            localStorage.setItem(`displayName_${found.id}`, storedDisplayName);
            localStorage.setItem(`email_${found.id}`, found.email);
            if (!localStorage.getItem(`userAvatar_${found.id}`)) {
                localStorage.setItem(`userAvatar_${found.id}`, "/Picture.png");
            }

            setLoading(false);
            return true;

        } catch (err) {
            handleAuthError(err);
            setLoading(false);
            return false;
        }
    };

    // 注册逻辑
    const register = async (userData: RegisterData): Promise<boolean> => {
        setAuthError(null);
        setLoading(true);

        try {
            await new Promise((res) => setTimeout(res, 1000));

            // 读取已有用户
            const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]") as RegisterData[];

            const exists = storedUsers.find((u) => u.email === userData.email);
            if (exists) {
                throw new Error("AuthError: Email already registered");
            }

            // 用邮箱生成稳定 ID
            const hashEmail = (email: string): number => {
                let hash = 0;
                for (let i = 0; i < email.length; i++) {
                    hash = (hash << 5) - hash + email.charCodeAt(i);
                    hash |= 0;
                }
                return Math.abs(hash);
            };

            const newUser = {
                id: hashEmail(userData.email),
                email: userData.email,
                password: userData.password,
                name: userData.name,
            };

            // 存入本地用户列表
            storedUsers.push(newUser);
            localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));

            // 单独存 displayName 和 avatar
            localStorage.setItem(`displayName_${newUser.id}`, newUser.name);
            localStorage.setItem(`userAvatar_${newUser.id}`, "/Picture.png");

            // 登录状态写入
            setUser({ id: newUser.id, email: newUser.email, name: newUser.name });
            localStorage.setItem("user", JSON.stringify({ id: newUser.id, email: newUser.email, name: newUser.name }));

            setLoading(false);
            return true;

        } catch (err) {
            handleAuthError(err);
            setLoading(false);
            return false;
        }
    };

    // 登出逻辑
    const logout = () => {
        console.log("[auth-context] Logout clicked");
        localStorage.removeItem("user");
        setUser(null);
       // setIsAuthenticated(false);
        window.location.href = "/auth/login";
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

// 自定义 hook，方便其他组件使用
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};