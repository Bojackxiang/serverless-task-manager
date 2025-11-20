"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const [avatar, setAvatar] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        userName: "",
        displayName: "",
        email: "",
        bio: "",
    });
    const [savedMessage, setSavedMessage] = useState("");
    const router = useRouter();

    // 加载当前用户的资料
    useEffect(() => {
        if (!user) return;

        const uid = user.id;

        const storedAvatar = localStorage.getItem(`userAvatar_${uid}`);
        const storedUserName = localStorage.getItem(`userName_${uid}`);
        const storedDisplayName = localStorage.getItem(`displayName_${uid}`);
        const storedEmail = localStorage.getItem(`email_${uid}`);
        const storedBio = localStorage.getItem(`bio_${uid}`);

        setAvatar(storedAvatar || null);
        setFormData({
            userName: storedUserName || user.name || "",
            displayName: storedDisplayName || user.name || "",
            email: storedEmail || user.email || "",
            bio: storedBio || "",
        });
    }, [user]);

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setAvatar(base64String);
            localStorage.setItem(`userAvatar_${user.id}`, base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!user) return;
        const uid = user.id;

        if (avatar) localStorage.setItem(`userAvatar_${uid}`, avatar);
        localStorage.setItem(`userName_${uid}`, formData.userName);
        localStorage.setItem(`displayName_${uid}`, formData.displayName);
        localStorage.setItem(`email_${uid}`, formData.email);
        localStorage.setItem(`bio_${uid}`, formData.bio);

        setSavedMessage("Profile updated successfully!");
        setTimeout(() => setSavedMessage(""), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full animate-fade-in">
                <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-6 gap-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border shadow">
                        <Image
                            src={avatar || "/picture.png"}
                            alt="User Avatar"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <Label htmlFor="avatar-upload">
                            <Button asChild variant="outline">
                                <span>Upload Picture</span>
                            </Button>
                        </Label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* User Info Fields */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="userName">User Name</Label>
                        <Input
                            id="userName"
                            value={formData.userName}
                            onChange={(e) => handleChange("userName", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                            id="displayName"
                            value={formData.displayName}
                            onChange={(e) => handleChange("displayName", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </div>
                </div>

                <Button className="w-full mt-6" onClick={handleSave}>
                    Save Changes
                </Button>

                <div className="flex justify-center mb-4">
                    <Button
                        variant="ghost"
                        className="text-gray-600 hover:underline"
                        onClick={() => router.push("/")}
                    >
                        ← Back to Dashboard
                    </Button>
                </div>

                {savedMessage && (
                    <p className="text-green-600 text-center mt-3 animate-fade-in">
                        {savedMessage}
                    </p>
                )}
            </div>
        </div>
    );
}