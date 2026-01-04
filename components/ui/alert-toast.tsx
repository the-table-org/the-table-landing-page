"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, WifiOff } from "lucide-react";

type AlertVariant = "error" | "success" | "warning" | "info" | "default";

interface AlertToastProps {
  variant?: AlertVariant;
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  className?: string;
  onClick?: () => void;
  onDismiss?: () => void;
}

// Animation timing constants for consistent motion
const ANIMATION_TIMINGS = {
  INITIAL_DELAY: 80,
  EXPAND_DURATION: 0.55,
  COLLAPSE_DURATION: 0.45,
  COLLAPSE_DELAY: 0.18,
  TEXT_DURATION: 0.32,
  ICON_SCALE_DURATION: 0.28,
  DISMISS_DELAY: 1200,
} as const;

// Custom easing curves for polished motion
const EASING = {
  smooth: [0.25, 0.1, 0.25, 1], // Custom bezier for smooth, natural feel
  springy: [0.34, 1.56, 0.64, 1], // Subtle spring effect
  exit: [0.4, 0, 0.6, 1], // Smooth exit
} as const;

const variantStyles = cn(
  "bg-card dark:bg-card",
  "text-card-foreground",
  "border-border",
  "backdrop-blur-4xl",
  "backdrop-saturate-400",
  "shadow-xl shadow-black/10 dark:shadow-black/20",
);

const variantIconWrapperStyles: Record<AlertVariant, string> = {
  error:
    "bg-destructive !text-destructive-foreground !shadow-[0_0_24px_hsl(var(--destructive)/0.3)]",
  success:
    "bg-success !text-success-foreground !shadow-[0_0_24px_hsl(var(--success)/0.3)]",
  warning:
    "bg-warning !text-warning-foreground !shadow-[0_0_24px_hsl(var(--warning)/0.3)]",
  info: "bg-primary !text-primary-foreground !shadow-[0_0_24px_hsl(var(--primary)/0.3)]",
  default:
    "bg-muted !text-muted-foreground !shadow-[0_0_24px_hsl(var(--muted)/0.3)]",
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
  error: <WifiOff className="w-4.5 h-4.5" />,
  success: <CheckCircle2 className="w-4.5 h-4.5" />,
  warning: <AlertCircle className="w-4.5 h-4.5" />,
  info: <Info className="w-4.5 h-4.5" />,
  default: <Info className="w-4.5 h-4.5" />,
};

export function AlertToast({
  variant = "default",
  title,
  message,
  icon,
  duration = 3000,
  className,
  onClick,
  onDismiss,
}: AlertToastProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);

  const displayIcon = icon || defaultIcons[variant];

  // Auto-expand on mount with slight delay for smoother animation
  useEffect(() => {
    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
      setHasExpanded(true);
    }, ANIMATION_TIMINGS.INITIAL_DELAY);

    return () => clearTimeout(expandTimer);
  }, []);

  // Auto-collapse after duration, then dismiss
  useEffect(() => {
    if (isExpanded && duration > 0) {
      const collapseTimer = setTimeout(() => {
        setIsExpanded(false);
      }, duration);

      return () => clearTimeout(collapseTimer);
    }
  }, [isExpanded, duration]);

  // Dismiss after collapse animation completes (only after it has expanded at least once)
  useEffect(() => {
    if (!isExpanded && hasExpanded) {
      const dismissTimer = setTimeout(() => {
        onDismiss?.();
      }, ANIMATION_TIMINGS.DISMISS_DELAY);

      return () => clearTimeout(dismissTimer);
    }
  }, [isExpanded, hasExpanded, onDismiss]);

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className={cn(
        "fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none",
        className,
      )}
    >
      <motion.div
        onClick={handleClick}
        initial={{ y: -20, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -16, opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.42,
          ease: EASING.smooth,
        }}
        className="pointer-events-auto"
      >
        <motion.div
          initial={false}
          animate={{
            width: isExpanded ? "auto" : "56px",
          }}
          transition={{
            width: {
              duration: isExpanded
                ? ANIMATION_TIMINGS.EXPAND_DURATION
                : ANIMATION_TIMINGS.COLLAPSE_DURATION,
              ease: EASING.smooth,
              delay: isExpanded ? 0 : ANIMATION_TIMINGS.COLLAPSE_DELAY,
            },
          }}
          className={cn(
            "relative cursor-pointer overflow-hidden",
            "h-14 rounded-full border",
            "shadow-[0_8px_32px_hsl(var(--foreground)/0.08)] dark:shadow-[0_12px_48px_hsl(var(--background)/0.4)]",
            "hover:shadow-[0_12px_40px_hsl(var(--foreground)/0.12)] dark:hover:shadow-[0_16px_56px_hsl(var(--background)/0.5)]",
            "active:scale-[0.98]",
            "transition-[box-shadow,transform] duration-200 ease-out",
            "will-change-transform",
            variantStyles,
            isExpanded ? "px-5" : "px-0",
          )}
        >
          <div
            className={cn(
              "flex items-center h-full",
              isExpanded ? "gap-3.5" : "justify-center",
            )}
          >
            {/* Icon with gradient background and subtle animations */}
            <motion.div
              initial={false}
              animate={{
                scale: isExpanded ? 1 : 1.05,
                rotate: isExpanded ? 0 : 0,
              }}
              transition={{
                duration: ANIMATION_TIMINGS.ICON_SCALE_DURATION,
                ease: EASING.springy,
                delay: isExpanded ? 0 : ANIMATION_TIMINGS.COLLAPSE_DELAY,
              }}
              className={cn(
                "relative flex-shrink-0 flex items-center justify-center",
                "w-9 h-9 rounded-full",
                "text-white",
                variantIconWrapperStyles[variant],
              )}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isExpanded ? 1 : [1, 1.08, 1],
                }}
                transition={{
                  duration: 0.4,
                  ease: EASING.smooth,
                  times: [0, 0.5, 1],
                }}
              >
                {displayIcon}
              </motion.div>
            </motion.div>

            {/* Text Content with staggered animation */}
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 8,
                    width: 0,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    width: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    x: -8,
                    width: 0,
                  }}
                  transition={{
                    duration: ANIMATION_TIMINGS.TEXT_DURATION,
                    ease: EASING.smooth,
                    opacity: {
                      duration: ANIMATION_TIMINGS.TEXT_DURATION * 0.8,
                    },
                  }}
                  className="flex flex-col gap-0.5 overflow-hidden whitespace-nowrap justify-center pr-1"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{
                      duration: ANIMATION_TIMINGS.TEXT_DURATION,
                      ease: EASING.smooth,
                      delay: 0.08,
                    }}
                    className="font-semibold text-[13px] leading-[1.3] tracking-[-0.01em] text-card-foreground"
                  >
                    {title}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{
                      duration: ANIMATION_TIMINGS.TEXT_DURATION,
                      ease: EASING.smooth,
                      delay: 0.14,
                    }}
                    className="text-[11.5px] leading-[1.35] tracking-[-0.005em] text-muted-foreground"
                  >
                    {message}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
