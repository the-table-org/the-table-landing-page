import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { Switch } from '@/components/ui/switch';

export default function SortableColumn({ col, visible, onToggle }: { col: { key: string; name?: string }; visible: boolean; onToggle: (key: string) => void }) {
    const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id: col.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className='group flex items-center justify-between px-3 py-2 hover:bg-muted'
        >
            <div className='flex items-center gap-2 flex-1'>
                <div
                    {...attributes}
                    {...listeners}
                    className='cursor-grab'
                >
                    <GripVertical className='w-4 h-4 text-muted-foreground' />
                </div>
                <span className='truncate text-sm'>{col.name || col.key}</span>
            </div>
            <Switch
                checked={visible}
                onCheckedChange={() => onToggle(col.key)}
            />
        </div>
    );
}
