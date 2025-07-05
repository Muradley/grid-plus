import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { type ColumnFiltersState } from '@/types/FilterDataTypes';
import type { ReactNode } from 'react';
import type { Column, Table } from '@tanstack/react-table';
import { FilterButton } from '../filters/FilterButton';

interface TableHeadProps<TData = unknown> {
    children: ReactNode;
    column: Column<TData, unknown>;
    isLast?: boolean;
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
    onSort: (column: Column<TData, unknown>, e: React.MouseEvent) => void;
    table?: Table<TData>;
}

export function TableHead<TData = unknown>({
    children,
    column,
    isLast = false,
    columnFilters = [],
    onColumnFiltersChange,
    onSort,
    table,
}: TableHeadProps<TData>) {
    const handleClick = (e: React.MouseEvent) => {
        if (column.getCanSort()) {
            onSort(column, e);
        }
    };

    return (
        <div
            className={cn(
                'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                'flex items-center justify-between',
                column.getCanSort()
                    ? 'cursor-pointer hover:bg-muted/50 transition-colors'
                    : ''
            )}
            style={{
                width: isLast ? 'auto' : `${column.getSize()}px`,
                minWidth: `${column.getSize()}px`,
                flexGrow: isLast ? 1 : 0,
            }}
            onClick={handleClick}
            title={
                column.getCanSort()
                    ? 'Click to sort, Shift+click for multi-sort'
                    : undefined
            }
        >
            <span>{children}</span>

            <div className="flex items-center gap-1">
                {column.getCanSort() && (
                    <>
                        {column.getIsSorted() &&
                            table &&
                            table.getState().sorting.length > 1 && (
                                <span className="text-xs bg-primary text-primary-foreground rounded px-1">
                                    {table
                                        .getState()
                                        .sorting.findIndex(
                                            (s) => s.id === column.id
                                        ) + 1}
                                </span>
                            )}

                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDown className="h-4 w-4 text-primary" />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                        ) : (
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                        )}
                    </>
                )}

                <FilterButton
                    column={column}
                    columnFilters={columnFilters}
                    onFiltersChange={onColumnFiltersChange}
                />
            </div>
        </div>
    );
}
