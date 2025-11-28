'use client';

import React from 'react';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function DataTablePagination({ currentPage, totalPages, onPageChange }: DataTablePaginationProps) {
    const getPageNumbers = React.useCallback(() => {
        const delta = 2;
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];

        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(1);
        for (let i = left; i <= right; i++) {
            range.push(i);
        }
        if (totalPages > 1) range.push(totalPages);

        let last: number | null = null;
        for (const i of range) {
            if (typeof i === 'number') {
                if (last !== null) {
                    if (i - last === 2) {
                        rangeWithDots.push(last + 1);
                    } else if (i - last > 2) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                last = i;
            }
        }

        return rangeWithDots;
    }, [currentPage, totalPages]);

    const pageNumbers = getPageNumbers();

    return (
        <Pagination className='flex items-center justify-end gap-2'>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                                {/* Optional: add jump-on-ellipsis click behavior
                                <PaginationEllipsis
                                    onClick={() => onPageChange(Math.min(currentPage + 5, totalPages))}
                                    className="cursor-pointer"
                                /> */}
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page as number);
                                }}
                                isActive={page === currentPage}
                                aria-current={page === currentPage ? 'page' : undefined}
                                className={page === currentPage ? 'font-semibold' : 'hover:underline'}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
