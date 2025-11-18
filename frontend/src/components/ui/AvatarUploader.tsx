"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AvatarUploader() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                <Image
                    src={previewUrl || "/placeholder-avatar.png"}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                />
            </div>

            <div>
                <Label htmlFor="avatar-upload">
                    <Button variant="outline" asChild>
                        <span>Upload Avatar</span>
                    </Button>
                </Label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>

            {previewUrl && (
                <p className="text-sm text-muted-foreground">Preview only. Not saved.</p>
            )}
        </div>
    );
}