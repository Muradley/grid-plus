import { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type Column,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import type { GridOptions } from '@/types/DataSourceTypes';
import type { ColumnFiltersState } from '@/types/FilterDataTypes';
import {
    DataRow,
    LoadingRow,
    TableHead,
    TableHeader,
    TableHeaderRow,
} from '@/components/table';
import { Database } from 'lucide-react';

export type RowVirtualizedTableProps<TData> = {
    data: (TData | null)[];
    totalRows?: number;
    columns: ColumnDef<TData>[];
    gridOptions?: GridOptions<TData>;
    onVisibleRangeChange?: (startIndex: number, endIndex: number) => void;
    sortModel?: SortingState;
    onSortModelChange?: (sort: SortingState) => void;
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
};

const DEFAULT_ROW_HEIGHT = 40;

export function RowVirtualizedTable<TData>({
    data,
    totalRows,
    columns,
    gridOptions = {},
    onVisibleRangeChange,
    sortModel,
    onSortModelChange,
    columnFilters,
    onColumnFiltersChange,
}: RowVirtualizedTableProps<TData>) {
    const parentRef = useRef<HTMLDivElement>(null);

    const table = useReactTable({
        data: data as TData[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        defaultColumn: {
            size: 200,
        },
        enableSorting: true,
        manualSorting: true,
        enableMultiSort: true,
        state: {
            sorting: sortModel || [],
        },
        onSortingChange: (updater) => {
            const newSort =
                typeof updater === 'function'
                    ? updater(sortModel || [])
                    : updater;
            onSortModelChange?.(newSort);
        },
    });

    const rowVirtualizer = useVirtualizer({
        count: totalRows || data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (index) => {
            const row = data[index];
            if (gridOptions.getRowHeight) {
                return gridOptions.getRowHeight(row);
            }
            return gridOptions.rowHeight ?? DEFAULT_ROW_HEIGHT;
        },
        overscan: 5,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    const lastRangeRef = useRef<{ start: number; end: number } | null>(null);

    useEffect(() => {
        if (onVisibleRangeChange && virtualItems.length > 0) {
            const startIndex = virtualItems[0].index;
            const endIndex = virtualItems[virtualItems.length - 1].index;

            const last = lastRangeRef.current;
            if (!last || last.start !== startIndex || last.end !== endIndex) {
                lastRangeRef.current = { start: startIndex, end: endIndex };
                onVisibleRangeChange(startIndex, endIndex);
            }
        }
    }, [virtualItems, onVisibleRangeChange]);

    const handleSort = useCallback(
        (column: Column<TData, unknown>, event: React.MouseEvent) => {
            if (!column.getCanSort()) return;

            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                return;
            }

            const isMultiSort = event.shiftKey;
            column.toggleSorting(undefined, isMultiSort);
        },
        []
    );

    const isEmpty = totalRows === 0;

    return (
        <div ref={parentRef} className="h-full w-full overflow-auto text-sm">
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableHeaderRow key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => (
                            <TableHead
                                key={header.id}
                                column={header.column}
                                isLast={
                                    index === headerGroup.headers.length - 1
                                }
                                columnFilters={columnFilters}
                                onColumnFiltersChange={onColumnFiltersChange}
                                onSort={handleSort}
                                table={table}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </TableHead>
                        ))}
                    </TableHeaderRow>
                ))}
            </TableHeader>

            {isEmpty ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                            <Database className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">
                            No data found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            There are no items to display in this table.
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className="relative"
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                    }}
                >
                    {virtualItems.map((virtualItem) => {
                        const rowData = data[virtualItem.index];

                        if (!rowData) {
                            return (
                                <LoadingRow
                                    key={`loading-${virtualItem.index}`}
                                    virtualItem={virtualItem}
                                    table={table}
                                />
                            );
                        }

                        const tableRow = table
                            .getRowModel()
                            .rows.find((r) => r.original === rowData);

                        if (!tableRow) return null;

                        return (
                            <DataRow
                                key={tableRow.id}
                                virtualItem={virtualItem}
                                tableRow={tableRow}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
