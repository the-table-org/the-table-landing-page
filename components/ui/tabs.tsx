'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { type HTMLMotionProps, type Transition, motion } from 'motion/react';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { MotionHighlight, MotionHighlightItem } from '@/components/animate-ui/effects/motion-highlight';

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;

function Tabs({ className, ...props }: TabsProps) {
    return (
        <TabsPrimitive.Root
            data-slot='tabs'
            className={cn('flex flex-col gap-2', className)}
            {...props}
        />
    );
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
    activeClassName?: string;
    transition?: Transition;
};

function TabsList({
    ref,
    children,
    className,
    activeClassName,
    transition = {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    },
    ...props
}: TabsListProps) {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

    const [activeValue, setActiveValue] = React.useState<string | undefined>(undefined);

    // Simplified active value detection
    const updateActiveValue = React.useCallback(() => {
        if (!localRef.current) return;

        const activeTab = localRef.current.querySelector<HTMLElement>('[data-state="active"]');
        const newValue = activeTab?.getAttribute('data-value') ?? undefined;

        setActiveValue((prev) => (prev === newValue ? prev : newValue));
    }, []);

    // Initial sync and children changes
    React.useLayoutEffect(() => {
        updateActiveValue();
    }, [updateActiveValue, children]);

    // Watch for state changes with MutationObserver
    React.useEffect(() => {
        if (!localRef.current) return;

        const observer = new MutationObserver(() => {
            updateActiveValue();
        });

        observer.observe(localRef.current, {
            attributes: true,
            attributeFilter: ['data-state'],
            subtree: true,
        });

        return () => observer.disconnect();
    }, [updateActiveValue]);

    return (
        <MotionHighlight
            controlledItems
            className={cn('rounded-lg bg-background shadow-sm shadow-black/15 border border-border/50', activeClassName)}
            value={activeValue}
            transition={transition}
            mode='parent'
        >
            <TabsPrimitive.List
                ref={localRef}
                data-slot='tabs-list'
                className={cn('bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-xl p-[4px] shadow-inner', className)}
                {...props}
            >
                {children}
            </TabsPrimitive.List>
        </MotionHighlight>
    );
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;

function TabsTrigger({ className, value, disabled, ...props }: TabsTriggerProps) {
    const trigger = (
        <TabsPrimitive.Trigger
            data-slot='tabs-trigger'
            className={cn(
                'inline-flex cursor-pointer items-center size-full justify-center whitespace-nowrap rounded-lg px-2 py-1 text-sm font-medium ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground z-[1] relative',
                className
            )}
            value={value}
            disabled={disabled}
            {...props}
        />
    );

    if (disabled) {
        return trigger;
    }

    return (
        <MotionHighlightItem
            value={value}
            className='size-full'
        >
            {trigger}
        </MotionHighlightItem>
    );
}

type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content> &
    HTMLMotionProps<'div'> & {
        transition?: Transition;
    };

function TabsContent({ className, children, ...props }: TabsContentProps) {
    return (
        <TabsPrimitive.Content
            data-slot='tabs-content'
            className={cn('flex-1 outline-none', className)}
            {...props}
        >
            {children}
        </TabsPrimitive.Content>
    );
}

type TabsContentsProps = HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    className?: string;
    transition?: Transition;
};

function TabsContents({
    children,
    className,
    transition = {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
    },
    ...props
}: TabsContentsProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = React.useState<number | 'auto'>('auto');

    // Update height when content changes
    React.useLayoutEffect(() => {
        if (!containerRef.current) return;

        const updateHeight = () => {
            if (!containerRef.current) return;
            const newHeight = containerRef.current.scrollHeight;
            setHeight((prev) => (prev === newHeight ? prev : newHeight));
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [children]);

    return (
        <motion.div
            data-slot='tabs-contents'
            style={{
                overflow: 'hidden',
            }}
            animate={{ height }}
            transition={transition}
            className={className}
            {...props}
        >
            <div ref={containerRef}>{children}</div>
        </motion.div>
    );
}

export {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    TabsContents,
    type TabsProps,
    type TabsListProps,
    type TabsTriggerProps,
    type TabsContentProps,
    type TabsContentsProps,
};
