import type { Row } from '@tanstack/react-table';
import type { VirtualItem } from '@tanstack/react-virtual';
import { DataCell } from './DataCell';

interface DataRowProps<TData = unknown> {
    virtualItem: VirtualItem;
    tableRow: Row<TData>;
}

export function DataRow<TData = unknown>({
    virtualItem,
    tableRow,
}: DataRowProps<TData>) {
    const cells = tableRow.getVisibleCells();

    return (
        <div
            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors flex absolute min-w-full"
            style={{
                transform: `translateY(${virtualItem.start}px)`,
                height: `${virtualItem.size}px`,
            }}
        >
            {cells.map((cell, index) => {
                const isLast = index === cells.length - 1;
                return <DataCell key={cell.id} cell={cell} isLast={isLast} />;
            })}
        </div>
    );
}
