import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

const pillVariants = cva(
    [
        'inline-flex items-center justify-center whitespace-nowrap shrink-0',
        'rounded-md',
        'font-medium',
        'select-none cursor-pointer',
        'relative isolate',
        'transition-all duration-200 ease-out',
    ].join(' '),
    {
        variants: {
            variant: {
                ghost: 'bg-transparent border-0',
                gradient: 'backdrop-blur-xl border',
                solid: 'border shadow-sm',
                outlined: 'bg-transparent backdrop-blur-sm border',
                bordered: 'bg-transparent border',
            },
            color: {
                primary: '',
                secondary: '',
                destructive: '',
                warning: '',
                success: '',
                info: '',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-3 py-1 text-sm',
                lg: 'px-4 py-1.5 text-base',
            },
        },
        compoundVariants: [
            // Ghost variants
            {
                variant: 'ghost',
                color: 'primary',
                className: ['text-primary', 'hover:bg-primary/10', 'hover:shadow-sm hover:shadow-primary/20', 'active:scale-95'].join(' '),
            },
            {
                variant: 'ghost',
                color: 'secondary',
                className: ['text-secondary-foreground', 'hover:bg-secondary/10', 'hover:shadow-sm hover:shadow-secondary/20', 'active:scale-95'].join(' '),
            },
            {
                variant: 'ghost',
                color: 'destructive',
                className: ['text-destructive', 'hover:bg-destructive/10', 'hover:shadow-sm hover:shadow-destructive/20', 'active:scale-95'].join(' '),
            },
            {
                variant: 'ghost',
                color: 'warning',
                className: ['text-warning', 'hover:bg-warning/10', 'hover:shadow-sm hover:shadow-warning/20', 'active:scale-95'].join(' '),
            },
            {
                variant: 'ghost',
                color: 'success',
                className: ['text-success', 'hover:bg-success/10', 'hover:shadow-sm hover:shadow-success/20', 'active:scale-95'].join(' '),
            },
            {
                variant: 'ghost',
                color: 'info',
                className: ['text-info', 'hover:bg-info/10', 'hover:shadow-sm hover:shadow-info/20', 'active:scale-95'].join(' '),
            },

            // Gradient variants
            {
                variant: 'gradient',
                color: 'primary',
                className: [
                    'bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5',
                    'text-primary',
                    'hover:from-primary/30 hover:via-primary/20 hover:to-primary/10',
                    'border-primary/30',
                    'shadow-sm shadow-primary/5',
                    'hover:shadow-md hover:shadow-primary/20',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'gradient',
                color: 'secondary',
                className: [
                    'bg-gradient-to-br from-secondary/30 via-secondary/20 to-secondary/10',
                    'text-secondary-foreground',
                    'hover:from-secondary/40 hover:via-secondary/30 hover:to-secondary/20',
                    'border-secondary/30',
                    'shadow-sm shadow-secondary/5',
                    'hover:shadow-md hover:shadow-secondary/20',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'gradient',
                color: 'destructive',
                className: [
                    'bg-gradient-to-br from-destructive/20 via-destructive/10 to-destructive/5',
                    'text-destructive',
                    'hover:from-destructive/30 hover:via-destructive/20 hover:to-destructive/10',
                    'border-destructive/30',
                    'shadow-sm shadow-destructive/5',
                    'hover:shadow-md hover:shadow-destructive/20',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'gradient',
                color: 'warning',
                className: [
                    'bg-gradient-to-br from-warning/20 via-warning/10 to-warning/5',
                    'text-warning',
                    'hover:from-warning/30 hover:via-warning/20 hover:to-warning/10',
                    'border-warning/30',
                    'shadow-sm shadow-warning/5',
                    'hover:shadow-md hover:shadow-warning/20',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'gradient',
                color: 'success',
                className: [
                    'bg-gradient-to-br from-success/20 via-success/10 to-success/5',
                    'text-success',
                    'hover:from-success/30 hover:via-success/20 hover:to-success/10',
                    'border-success/30',
                    'shadow-sm shadow-success/5',
                    'hover:shadow-md hover:shadow-success/20',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'gradient',
                color: 'info',
                className: [
                    'bg-gradient-to-br from-info/20 via-info/10 to-info/5',
                    'text-info',
                    'hover:from-info/30 hover:via-info/20 hover:to-info/10',
                    'border-info/30',
                    'shadow-sm shadow-info/10',
                    'hover:shadow-md hover:shadow-info/20',
                    'active:scale-95',
                ].join(' '),
            },

            // Solid variants
            {
                variant: 'solid',
                color: 'primary',
                className: [
                    'bg-primary text-primary-foreground',
                    'border-primary/30',
                    'shadow-md shadow-primary/20',
                    'hover:bg-primary/90',
                    'hover:shadow-lg hover:shadow-primary/25',
                    'hover:border-primary/40',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'solid',
                color: 'secondary',
                className: [
                    'bg-secondary text-secondary-foreground',
                    'border-secondary/30',
                    'shadow-md shadow-secondary/20',
                    'hover:bg-secondary/90',
                    'hover:shadow-lg hover:shadow-secondary/25',
                    'hover:border-secondary/40',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'solid',
                color: 'destructive',
                className: [
                    'bg-destructive text-destructive-foreground',
                    'border-destructive/30',
                    'shadow-md shadow-destructive/20',
                    'hover:bg-destructive/90',
                    'hover:shadow-lg hover:shadow-destructive/25',
                    'hover:border-destructive/40',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'solid',
                color: 'warning',
                className: [
                    'bg-warning text-warning-foreground',
                    'border-warning/30',
                    'shadow-md shadow-warning/20',
                    'hover:bg-warning/90',
                    'hover:shadow-lg hover:shadow-warning/25',
                    'hover:border-warning/40',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'solid',
                color: 'success',
                className: [
                    'bg-success text-success-foreground',
                    'border-success/30',
                    'shadow-md shadow-success/20',
                    'hover:bg-success/90',
                    'hover:shadow-lg hover:shadow-success/25',
                    'hover:border-success/40',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'solid',
                color: 'info',
                className: [
                    'bg-info text-info-foreground',
                    'border-info/30',
                    'shadow-md shadow-info/20',
                    'hover:bg-info/90',
                    'hover:shadow-lg hover:shadow-info/25',
                    'hover:border-info/40',
                    'active:scale-95',
                ].join(' '),
            },

            // Outlined variants
            {
                variant: 'outlined',
                color: 'primary',
                className: ['border-primary/70', 'text-primary', 'hover:bg-primary/10', 'active:scale-95'].join(' '),
            },
            {
                variant: 'outlined',
                color: 'secondary',
                className: [
                    'border-secondary/70',
                    'text-secondary-foreground',
                    'shadow-sm shadow-secondary/20',
                    'hover:bg-secondary/15',
                    'hover:border-secondary/90',
                    'hover:shadow-md hover:shadow-secondary/25',
                    'backdrop-blur-md',
                    'active:scale-95',
                ].join(' '),
            },
            {
                variant: 'outlined',
                color: 'destructive',
                className: ['border-destructive/70', 'text-destructive', 'hover:bg-destructive/10', 'active:scale-95'].join(' '),
            },
            {
                variant: 'outlined',
                color: 'warning',
                className: ['border-warning/70', 'text-warning', 'hover:bg-warning/10', 'active:scale-95'].join(' '),
            },
            {
                variant: 'outlined',
                color: 'success',
                className: ['border-success/70', 'text-success', 'hover:bg-success/10', 'active:scale-95'].join(' '),
            },
            {
                variant: 'outlined',
                color: 'info',
                className: ['border-info/70', 'text-info', 'hover:bg-info/10', 'active:scale-95'].join(' '),
            },

            // Bordered variants
            {
                variant: 'bordered',
                color: 'primary',
                className: ['border-border', 'text-primary'].join(' '),
            },
            {
                variant: 'bordered',
                color: 'secondary',
                className: ['border-border', 'text-secondary-foreground'].join(' '),
            },
            {
                variant: 'bordered',
                color: 'destructive',
                className: ['border-border', 'text-destructive'].join(' '),
            },
            {
                variant: 'bordered',
                color: 'warning',
                className: ['border-border', 'text-warning'].join(' '),
            },
            {
                variant: 'bordered',
                color: 'success',
                className: ['border-border', 'text-success'].join(' '),
            },
            {
                variant: 'bordered',
                color: 'info',
                className: ['border-border', 'text-info'].join(' '),
            },
        ],
        defaultVariants: {
            variant: 'solid',
            color: 'primary',
            size: 'sm',
        },
    }
);

export interface PillProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof pillVariants> {
    asChild?: boolean;
    icon?: React.ReactNode;
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
    ({ className, variant = 'gradient', color = 'primary', size = 'sm', icon, children, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'span';
        return (
            <Comp
                ref={ref}
                className={cn(pillVariants({ variant, color, size }), className)}
                role='status'
                tabIndex={asChild ? -1 : 0}
                {...props}
            >
                {icon && <span className='mr-1.5 flex items-center text-current'>{icon}</span>}
                {children}
            </Comp>
        );
    }
);
Pill.displayName = 'Pill';

export { Pill, pillVariants };
