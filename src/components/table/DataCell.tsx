import { flexRender, type Cell } from '@tanstack/react-table';

interface DataCellProps<TData = unknown> {
    cell: Cell<TData, unknown>;
    isLast: boolean;
}

export function DataCell<TData = unknown>({
    cell,
    isLast,
}: DataCellProps<TData>) {
    return (
        <div
            className="text-foreground p-2 text-left whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] flex items-center"
            style={{
                width: isLast ? 'auto' : `${cell.column.getSize()}px`,
                minWidth: `${cell.column.getSize()}px`,
                flexGrow: isLast ? 1 : 0,
            }}
        >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
    );
}
