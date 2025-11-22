import React from "react";
import type { ReactNode } from "react";

interface LoginLayoutProps {
    children: ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <main className="w-full max-w-md p-6 bg-white rounded shadow">{children}</main>
        </div>
    );
};

export default LoginLayout;