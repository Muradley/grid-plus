import type { ReactNode } from 'react';

interface TableHeaderRowProps {
    children: ReactNode;
}

export function TableHeaderRow({ children }: TableHeaderRowProps) {
    return <div className="border-b flex w-max min-w-full">{children}</div>;
}
