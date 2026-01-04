"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group h-12 flex items-center gap-3.5 px-5 rounded-full border bg-card dark:bg-card text-card-foreground border-border backdrop-blur-4xl backdrop-saturate-400 shadow-[0_8px_32px_hsl(var(--foreground)/0.08)] dark:shadow-[0_12px_48px_hsl(var(--background)/0.4)] hover:shadow-[0_12px_40px_hsl(var(--foreground)/0.12)] dark:hover:shadow-[0_16px_56px_hsl(var(--background)/0.5)] transition-shadow duration-200",
          title:
            "font-semibold text-[13px] leading-[1.3] tracking-[-0.01em] text-card-foreground",
          description:
            "text-[11.5px] leading-[1.35] tracking-[-0.005em] text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity",
          cancelButton:
            "bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity",
          error:
            "bg-destructive text-destructive-foreground border-destructive/40",
          success: "bg-success text-success-foreground border-success/40",
          warning: "bg-warning text-warning-foreground border-warning/40",
          info: "bg-primary text-primary-foreground border-primary/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
