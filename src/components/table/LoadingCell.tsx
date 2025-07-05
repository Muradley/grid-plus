import type { Column } from '@tanstack/react-table';

interface LoadingCellProps<TData = unknown> {
    header: Column<TData, unknown>;
    isLast: boolean;
}

export function LoadingCell<TData = unknown>({
    header,
    isLast,
}: LoadingCellProps<TData>) {
    return (
        <div
            className="text-foreground p-2 text-left whitespace-nowrap flex items-center"
            style={{
                width: isLast ? 'auto' : `${header.getSize()}px`,
                minWidth: `${header.getSize()}px`,
                flexGrow: isLast ? 1 : 0,
            }}
        >
            Loading...
        </div>
    );
}
