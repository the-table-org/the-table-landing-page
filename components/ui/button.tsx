import type * as React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap text-sm rounded-md font-medium tracking-wide transition-all duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_6px_-2px_rgba(16,24,40,0.1),0_2px_4px_-1px_rgba(16,24,40,0.06)] border border-white/[0.15] active:scale-[0.98] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_2px_rgba(16,24,40,0.05)] hover:ring-2 hover:ring-primary/50 hover:border-white",
        secondary:
          "bg-secondary text-primary-foreground dark:text-secondary-foreground hover:bg-secondary/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_6px_-2px_rgba(16,24,40,0.1),0_2px_4px_-1px_rgba(16,24,40,0.06)] border border-white/[0.15] active:scale-[0.98]  active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_2px_rgba(16,24,40,0.05)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_6px_-2px_rgba(16,24,40,0.1),0_2px_4px_-1px_rgba(16,24,40,0.06)] border border-white/[0.15] active:scale-[0.98]  active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_2px_rgba(16,24,40,0.05)]",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 active:scale-[0.98] ",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-[0.98] ",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_6px_-2px_rgba(16,24,40,0.1),0_2px_4px_-1px_rgba(16,24,40,0.06)] border border-white/[0.15] active:scale-[0.98]  active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_2px_rgba(16,24,40,0.05)]",
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_6px_-2px_rgba(16,24,40,0.1),0_2px_4px_-1px_rgba(16,24,40,0.06)] border border-white/[0.15] active:scale-[0.98]  active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_2px_rgba(16,24,40,0.05)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        xl: "h-12 px-8 has-[>svg]:px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
