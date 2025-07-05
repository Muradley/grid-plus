import type { ReactNode } from 'react';

interface TableHeaderProps {
    children: ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-background w-max min-w-full">
            {children}
        </div>
    );
}
