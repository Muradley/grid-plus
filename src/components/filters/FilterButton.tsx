import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import type { Column } from '@tanstack/react-table';
import type { ColumnFiltersState } from '@/types/FilterDataTypes';
import { hasActiveFilter } from '@/components/filters/FilterUtils';
import { FilterPanel } from './FilterPanel';
import { cn } from '@/lib/utils';

interface FilterButtonProps<TData> {
    column: Column<TData>;
    columnFilters: ColumnFiltersState;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
}

export function FilterButton<TData>({
    column,
    columnFilters,
    onFiltersChange,
}: FilterButtonProps<TData>) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const columnId = column.id;
    const isFiltered = hasActiveFilter(columnFilters, columnId);
    const filterType = column.columnDef.meta?.filterType;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;

            if (
                panelRef.current?.contains(target) ||
                buttonRef.current?.contains(target)
            ) {
                return;
            }

            handleClose();
        };
        const handleKeyDownEvent = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDownEvent);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleKeyDownEvent);
            };
        }
    }, [isOpen]);

    if (!filterType) {
        return null;
    }

    const buttonRect = buttonRef.current?.getBoundingClientRect();

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className={cn(
                    'p-1 rounded transition-colors',
                    'hover:bg-muted/50',
                    isFiltered && 'text-primary bg-primary/10',
                    !isFiltered && 'text-muted-foreground hover:text-foreground'
                )}
                title={isFiltered ? 'Filter applied' : 'Click to filter'}
                type="button"
            >
                <Filter
                    className={`h-4 w-4 ${isFiltered ? 'fill-current' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    ref={panelRef}
                    className="fixed bg-background border border-border rounded-md shadow-lg z-50"
                    style={{
                        top: buttonRect ? buttonRect.bottom + 4 : 0,
                        left: buttonRect
                            ? Math.max(
                                  8,
                                  Math.min(
                                      buttonRect.left,
                                      window.innerWidth - 264 - 8
                                  )
                              )
                            : 0,
                        minWidth: '256px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                >
                    <FilterPanel
                        column={column}
                        columnFilters={columnFilters}
                        onFiltersChange={onFiltersChange}
                        onClose={handleClose}
                    />
                </div>
            )}
        </div>
    );
}
