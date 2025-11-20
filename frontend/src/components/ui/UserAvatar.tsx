"use client";

import Image from "next/image";
//import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
//import Link from "next/link";

export default function UserAvatar() {
    //const router = useRouter();
    const { user } = useAuth();
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (user && !avatar) { // 避免重复 set
            const savedAvatar = localStorage.getItem(`userAvatar_${user.id}`);
            setAvatar(savedAvatar || "/Picture.png");
        }
    }, [user, avatar]);

    // 若 user 还没加载完成，先不渲染
    if (!user) return null;

    return (
        <button
            onClick={() => (window.location.href = "/auth/profile")}
            className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 ring-blue-400 transition-all"
            aria-label="Go to Profile"
        >
            <Image
                src={avatar || "/Picture.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="object-cover"
            />
        </button>
    );
}