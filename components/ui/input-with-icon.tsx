"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, leftIcon, rightIcon, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        {leftIcon && (
          <div className="absolute left-3 flex h-full items-center text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <Input
          className={cn(leftIcon && "pl-10", rightIcon && "pr-10", className)}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex h-full items-center text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);
InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
