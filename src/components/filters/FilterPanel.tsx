import type { Column } from '@tanstack/react-table';
import type { ColumnFiltersState } from '@/types/FilterDataTypes';
import { StringFilter } from './StringFilter';
import { NumberFilter } from './NumberFilter';
import { DateFilter } from './DateFilter';
import { BooleanFilter } from './BooleanFilter';
import { EnumFilter } from './EnumFilter';

interface FilterPanelProps<TData> {
    column: Column<TData>;
    columnFilters: ColumnFiltersState;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
    onClose: () => void;
}

export function FilterPanel<TData>({
    column,
    columnFilters,
    onFiltersChange,
    onClose,
}: FilterPanelProps<TData>) {
    const columnId = column.id;
    const filterType = column.columnDef.meta?.filterType;
    const enumValues = column.columnDef.meta?.filterOptions || [];

    switch (filterType) {
        case 'string':
            return (
                <StringFilter
                    columnId={columnId}
                    columnFilters={columnFilters}
                    onFiltersChange={onFiltersChange}
                    onClose={onClose}
                />
            );

        case 'number':
            return (
                <NumberFilter
                    columnId={columnId}
                    columnFilters={columnFilters}
                    onFiltersChange={onFiltersChange}
                    onClose={onClose}
                />
            );

        case 'date':
            return (
                <DateFilter
                    columnId={columnId}
                    columnFilters={columnFilters}
                    onFiltersChange={onFiltersChange}
                    onClose={onClose}
                />
            );

        case 'boolean':
            return (
                <BooleanFilter
                    columnId={columnId}
                    columnFilters={columnFilters}
                    onFiltersChange={onFiltersChange}
                    onClose={onClose}
                />
            );

        case 'enum':
            return (
                <EnumFilter
                    columnId={columnId}
                    columnFilters={columnFilters}
                    onFiltersChange={onFiltersChange}
                    onClose={onClose}
                    enumValues={enumValues}
                />
            );

        default:
            // Fallback to string filter
            return (
                <StringFilter
                    columnId={columnId}
                    columnFilters={columnFilters}
                    onFiltersChange={onFiltersChange}
                    onClose={onClose}
                />
            );
    }
}
