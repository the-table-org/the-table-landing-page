'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
    type ColumnDef,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        headerClassName?: string;
        cellClassName?: string;
        canHide?: boolean;
        canReorder?: boolean;
        onClick?: (row: TData) => void;
        editable?: boolean;
        inputType?: 'text' | 'textarea';
        onSave?: (rowId: string, newValue: string) => void;
    }
}

export interface DataGridProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    rowKeyAction: (row: TData) => string | number;
    visibleColumns: VisibilityState;
    manualSorting?: boolean;
    sorting?: SortingState;
    onSortingChange?: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
    isRowExpandable?: (row: TData) => boolean;
    renderExpandedRow?: (row: TData) => React.ReactNode;
    controlledExpandedRows?: Set<string | number>;
    onToggleExpand?: (id: string | number) => void;
    pagination?: {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        renderPagination?: (props: { currentPage: number; totalPages: number; onPrevious: () => void; onNext: () => void }) => React.ReactNode;
    };
    loading?: boolean;
    error?: boolean;
}

const TableCellMemo = React.memo(({ cell, className, onClick }: { cell: any; className?: string; onClick?: (e: React.MouseEvent) => void }) => (
    <TableCell
        className={cn('px-2 py-2 text-sm text-foreground whitespace-normal break-words', className)}
        onClick={onClick}
    >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
));

TableCellMemo.displayName = 'TableCellMemo';

const TableRowMemo = React.memo(
    ({
        row,
        rowKeyAction,
        isRowExpandable,
        isExpanded,
        toggleExpand,
        renderExpandedRow,
        columns,
    }: {
        row: any;
        rowKeyAction: (row: any) => string | number;
        isRowExpandable?: (row: any) => boolean;
        isExpanded: boolean;
        toggleExpand: (id: string | number) => void;
        renderExpandedRow?: (row: any) => React.ReactNode;
        columns: ColumnDef<any, any>[];
    }) => {
        const original = row.original;
        const id = rowKeyAction(original);
        const expandable = isRowExpandable?.(original);

        const handleRowClick = React.useCallback(() => {
            if (expandable) toggleExpand(id);
        }, [expandable, toggleExpand, id]);

        return (
            <>
                <TableRow
                    className={cn('divide-border hover:bg-transparent text-sm', expandable ? 'bg-muted cursor-pointer hover:bg-accent' : 'divide-x')}
                    onClick={handleRowClick}
                >
                    {row.getVisibleCells().map((cell: any) => (
                        <TableCellMemo
                            key={cell.id}
                            cell={cell}
                            className={cell.column.columnDef.meta?.cellClassName}
                            onClick={
                                cell.column.columnDef.meta?.onClick
                                    ? (e) => {
                                          e.stopPropagation();
                                          if (expandable) toggleExpand(id);
                                          cell.column.columnDef.meta.onClick(row.original);
                                      }
                                    : undefined
                            }
                        />
                    ))}
                </TableRow>

                {expandable && isExpanded && renderExpandedRow && (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className='p-0'
                        >
                            <div className='p-4 bg-muted'>{renderExpandedRow(original)}</div>
                        </TableCell>
                    </TableRow>
                )}
            </>
        );
    }
);

TableRowMemo.displayName = 'TableRowMemo';

const SortingIcon = React.memo(({ columnId, sorting }: { columnId: string; sorting?: SortingState }) => {
    const sortingColumn = sorting?.find((sort) => sort.id === columnId);
    const isDescending = sortingColumn?.desc;
    const isAscending = sortingColumn?.desc === false;

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-chevrons-up-down'
        >
            <path
                d='m7 9 5-5 5 5'
                strokeWidth={isAscending ? '2' : '1.5'}
                className={isAscending ? 'text-primary stroke-primary' : 'text-muted-foreground stroke-muted-foreground'}
            />
            <path
                d='m7 15 5 5 5-5'
                strokeWidth={isDescending ? '2' : '1.5'}
                className={isDescending ? 'text-primary stroke-primary' : 'text-muted-foreground stroke-muted-foreground'}
            />
        </svg>
    );
});

SortingIcon.displayName = 'SortingIcon';

export function DataGrid<TData>({
    data,
    columns,
    rowKeyAction,
    visibleColumns,
    manualSorting = false,
    sorting,
    onSortingChange,
    isRowExpandable,
    renderExpandedRow,
    controlledExpandedRows,
    onToggleExpand,
    pagination,
    loading = false,
    error = false,
}: DataGridProps<TData>) {
    const [localExpanded, setLocalExpanded] = React.useState<Set<string | number>>(new Set());

    const tableConfig = React.useMemo(
        () => ({
            data,
            columns,
            state: {
                sorting,
                columnVisibility: visibleColumns,
            },
            onSortingChange: (updater: any) => {
                if (onSortingChange) {
                    const nextState = typeof updater === 'function' ? updater(sorting ?? []) : updater;
                    onSortingChange(nextState);
                }
            },
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            manualSorting,
            manualPagination: !!pagination,
        }),
        [data, columns, sorting, visibleColumns, onSortingChange, manualSorting, pagination]
    );

    const table = useReactTable(tableConfig);

    // Memoize paginated data
    const currentPageData = React.useMemo(() => {
        if (!pagination) return table.getRowModel().rows;
        const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
        return table.getRowModel().rows.slice(start, start + pagination.itemsPerPage);
    }, [pagination, table]);

    const isExpanded = React.useCallback(
        (id: string | number): boolean => controlledExpandedRows?.has(id) ?? localExpanded.has(id),
        [controlledExpandedRows, localExpanded]
    );

    const toggleExpand = React.useCallback(
        (id: string | number) => {
            if (controlledExpandedRows && onToggleExpand) {
                onToggleExpand(id);
            } else {
                setLocalExpanded((prev) => {
                    const updated = new Set(prev);
                    updated.has(id) ? updated.delete(id) : updated.add(id);
                    return updated;
                });
            }
        },
        [controlledExpandedRows, onToggleExpand]
    );

    const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.itemsPerPage) : 1;

    const paginationControls = React.useMemo(() => {
        if (!pagination) return null;

        return pagination.renderPagination ? (
            pagination.renderPagination({
                currentPage: pagination.currentPage,
                totalPages,
                onPrevious: () => pagination.onPageChange(Math.max(1, pagination.currentPage - 1)),
                onNext: () => pagination.onPageChange(Math.min(totalPages, pagination.currentPage + 1)),
            })
        ) : (
            <DataTablePagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={pagination.onPageChange}
            />
        );
    }, [pagination, totalPages]);

    if (loading) {
        return (
            <div className='w-full flex justify-center items-center py-8 h-[calc(45vh)]'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-t-2 border-primary'></div>
            </div>
        );
    }

    if (error) {
        return <div className='w-full flex justify-center items-center py-8 h-[calc(45vh)] text-destructive'>Error</div>;
    }

    if (!loading && !error && data.length === 0) {
        return <div className='w-full flex justify-center items-center py-8 text-center text-muted-foreground h-[calc(45vh)]'>No data to display.</div>;
    }

    return (
        <div className='w-full'>
            <div className='min-w-full inline-block align-middle'>
                <div className='[&>div]:max-h-[80vh]'>
                    <Table className='[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-y [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b'>
                        <TableHeader className='bg-muted sticky top-0 z-10 backdrop-blur-[2px]'>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className='border-t border-border divide-x divide-border hover:bg-transparent'
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                'border-border whitespace-normal break-words !hover:bg-transparent dark:hover:bg-transparent',
                                                header.column.columnDef.meta?.headerClassName
                                            )}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={cn(
                                                        'w-full py-2.5 text-left flex items-center gap-x-1.5',
                                                        header.column.getCanSort() && 'cursor-pointer select-none'
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        <SortingIcon
                                                            columnId={String(header.column.id)}
                                                            sorting={sorting}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className='divide-y divide-border'>
                            {currentPageData.map((row) => {
                                const id = rowKeyAction(row.original);
                                return (
                                    <TableRowMemo
                                        key={id}
                                        row={row}
                                        rowKeyAction={rowKeyAction}
                                        isRowExpandable={isRowExpandable}
                                        isExpanded={isExpanded(id)}
                                        toggleExpand={toggleExpand}
                                        renderExpandedRow={renderExpandedRow}
                                        columns={columns}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
