import type { Table } from '@tanstack/react-table';
import type { VirtualItem } from '@tanstack/react-virtual';
import { LoadingCell } from './LoadingCell';

interface LoadingRowProps<TData = unknown> {
    virtualItem: VirtualItem;
    table: Table<TData>;
}

export function LoadingRow<TData = unknown>({
    virtualItem,
    table,
}: LoadingRowProps<TData>) {
    const headers = table.getHeaderGroups()[0].headers;

    return (
        <div
            className="border-b flex absolute min-w-full"
            style={{
                transform: `translateY(${virtualItem.start}px)`,
                height: `${virtualItem.size}px`,
            }}
        >
            {headers.map((header, index) => {
                const isLast = index === headers.length - 1;
                return (
                    <LoadingCell
                        key={header.id}
                        header={header.column}
                        isLast={isLast}
                    />
                );
            })}
        </div>
    );
}
