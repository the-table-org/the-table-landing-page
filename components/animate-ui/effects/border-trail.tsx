'use client';

import type React from 'react';

import { cn } from '@/lib/utils';
import { type Transition, motion } from 'framer-motion';

type BorderTrailProps = Readonly<{
    className?: string;
    size?: number;
    transition?: Transition;
    delay?: number;
    onAnimationComplete?: () => void;
    style?: React.CSSProperties;
    colors?: string[]; // Allow custom colors
}>;

export function BorderTrail({
    className,
    size = 60,
    transition,
    delay,
    onAnimationComplete,
    style,
    colors = ['#EC4899', '#8B5CF6', '#3B82F6'], // Default colors: Pink, Purple, Blue
}: BorderTrailProps) {
    const BASE_TRANSITION: Transition = {
        repeat: Number.POSITIVE_INFINITY,
        duration: 5,
        ease: 'linear',
    };

    const gradientColors = colors.join(', ');

    return (
        <div className='pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]'>
            <motion.div
                className={cn('absolute aspect-square', className)} // Removed bg-zinc-500
                style={{
                    width: size,
                    // height: size, // aspect-square handles this
                    offsetPath: `rect(0 auto auto 0 round ${size}px)`, // Kept original path logic
                    backgroundImage: `linear-gradient(to right, ${gradientColors})`, // Added gradient
                    ...style, // Allow overriding via style prop
                }}
                animate={{
                    offsetDistance: ['0%', '100%'],
                }}
                transition={{
                    ...(transition ?? BASE_TRANSITION),
                    delay: delay ?? 0,
                }}
                onAnimationComplete={onAnimationComplete}
            />
        </div>
    );
}
