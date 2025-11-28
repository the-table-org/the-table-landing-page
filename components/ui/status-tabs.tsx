'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

export interface StatusTabOption {
    label: string;
    value: string;
    count: number;
    color: 'primary' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning' | string;
}

const statusTabsVariants = cva('flex w-full divide-x border-y', {
    variants: {
        variant: {
            default: 'border-y',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const statusTabItemVariants = cva('flex-1 px-2.5 py-2.5 inline-flex flex-col justify-center items-center text-xs transition-all duration-150', {
    variants: {
        variant: {
            default: 'border-y',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

interface StatusTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>, VariantProps<typeof statusTabsVariants> {
    options: StatusTabOption[];
    activeValue: string;
    onChange: (value: string) => void;
}

const StatusTabs = React.forwardRef<HTMLDivElement, StatusTabsProps>(({ options, activeValue, onChange, className, variant = 'default', ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(statusTabsVariants({ variant, className }))}
            role='tablist'
            aria-label='Status Tabs'
            {...props}
        >
            {options.map((option) => {
                const isActive = option.value === activeValue;

                // Get the appropriate color classes based on the theme
                const getColorClasses = (color: string) => {
                    // Handle theme colors
                    if (['primary', 'secondary', 'accent', 'destructive', 'success', 'warning'].includes(color)) {
                        return {
                            text: `text-${color}`,
                            border: `border-${color}`,
                        };
                    }
                    // Handle custom colors
                    return {
                        text: color,
                        border: color.replace('text-', 'border-'),
                    };
                };

                const { text: textColorClass, border: borderColorClass } = getColorClasses(option.color);

                return (
                    <button
                        key={option.value}
                        role='tab'
                        aria-selected={isActive}
                        aria-controls={`panel-${option.value}`}
                        id={`tab-${option.value}`}
                        onClick={() => onChange(option.value)}
                        className={cn(statusTabItemVariants({ variant }), textColorClass, 'relative', isActive ? 'font-semibold' : 'font-normal')}
                    >
                        <span className='capitalize truncate'>{option.label}</span>
                        <span className={cn('rounded-full text-xs mt-1', isActive ? 'text-foreground font-medium' : 'text-muted-foreground font-normal')}>
                            {option.count}
                        </span>
                        {isActive && <div className={cn('absolute bottom-0 left-0 right-0 h-0.5', borderColorClass)} />}
                    </button>
                );
            })}
        </div>
    );
});

StatusTabs.displayName = 'StatusTabs';

export { StatusTabs, statusTabsVariants, statusTabItemVariants };
