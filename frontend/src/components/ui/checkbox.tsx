"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

type CheckboxProps = React.HTMLAttributes<HTMLDivElement>;

const checkboxStyles = cva(
    "h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500"
);

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                type="checkbox"
                className={cn(checkboxStyles(), className)}
                ref={ref}
                {...props}
            />
        );
    }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };