import type { TableDatasource } from '@/types/DataSourceTypes';
import type { SortingState } from '@tanstack/react-table';
import type { ColumnFiltersState } from '@/types/FilterDataTypes';

export function createMockDatasource<TData>(
    fullDataset: TData[]
): TableDatasource<TData> {
    return {
        rowCount: fullDataset.length,
        getRows: ({
            startRow,
            endRow,
            successCallback,
            failCallback,
            sortModel,
            columnFilters,
        }) => {
            try {
                let processedData = [...fullDataset];

                if (columnFilters && columnFilters.length > 0) {
                    processedData = applyFiltering(
                        processedData,
                        columnFilters
                    );
                }

                if (sortModel && sortModel.length > 0) {
                    processedData = applySorting(processedData, sortModel);
                }

                const requestedData = processedData.slice(startRow, endRow);

                const lastRow =
                    processedData.length === 0 ? -1 : processedData.length - 1;

                successCallback(requestedData, lastRow);
            } catch (error) {
                failCallback(error as Error);
            }
        },
    };
}

function applySorting<TData>(data: TData[], sortModel: SortingState): TData[] {
    return data.sort((a, b) => {
        for (const sort of sortModel) {
            const aValue = a[sort.id as keyof TData];
            const bValue = b[sort.id as keyof TData];

            let comparison = 0;

            if (aValue == null && bValue == null) {
                comparison = 0;
            } else if (aValue == null) {
                comparison = -1;
            } else if (bValue == null) {
                comparison = 1;
            } else if (
                typeof aValue === 'string' &&
                typeof bValue === 'string'
            ) {
                comparison = aValue.localeCompare(bValue);
            } else if (aValue instanceof Date && bValue instanceof Date) {
                comparison = aValue.getTime() - bValue.getTime();
            } else {
                comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }

            if (comparison !== 0) {
                return sort.desc ? -comparison : comparison;
            }
        }
        return 0;
    });
}

function applyFiltering<TData>(
    data: TData[],
    columnFilters: ColumnFiltersState
): TData[] {
    return data.filter((row) => {
        return columnFilters.every((filter) => {
            const columnValue = row[filter.column as keyof TData];

            if (columnValue == null) {
                return (
                    filter.operator === 'isEmpty' ||
                    (filter.operator === 'equals' && filter.value == null)
                );
            }

            switch (filter.operator) {
                case 'contains':
                    return String(columnValue)
                        .toLowerCase()
                        .includes(String(filter.value).toLowerCase());

                case 'equals':
                    if (typeof columnValue === 'boolean') {
                        return columnValue === filter.value;
                    }
                    return (
                        String(columnValue).toLowerCase() ===
                        String(filter.value).toLowerCase()
                    );

                case 'startsWith':
                    return String(columnValue)
                        .toLowerCase()
                        .startsWith(String(filter.value).toLowerCase());

                case 'endsWith':
                    return String(columnValue)
                        .toLowerCase()
                        .endsWith(String(filter.value).toLowerCase());

                case 'greaterThan':
                    if (
                        typeof columnValue === 'number' &&
                        typeof filter.value === 'number'
                    ) {
                        return columnValue > filter.value;
                    }
                    if (
                        columnValue instanceof Date &&
                        filter.value instanceof Date
                    ) {
                        return columnValue.getTime() > filter.value.getTime();
                    }
                    return String(columnValue) > String(filter.value);

                case 'lessThan':
                    if (
                        typeof columnValue === 'number' &&
                        typeof filter.value === 'number'
                    ) {
                        return columnValue < filter.value;
                    }
                    if (
                        columnValue instanceof Date &&
                        filter.value instanceof Date
                    ) {
                        return columnValue.getTime() < filter.value.getTime();
                    }
                    return String(columnValue) < String(filter.value);

                case 'between':
                    if (
                        typeof columnValue === 'number' &&
                        typeof filter.value === 'number' &&
                        typeof filter.value2 === 'number'
                    ) {
                        return (
                            columnValue >= filter.value &&
                            columnValue <= filter.value2
                        );
                    }
                    if (
                        columnValue instanceof Date &&
                        filter.value instanceof Date &&
                        filter.value2 instanceof Date
                    ) {
                        return (
                            columnValue.getTime() >= filter.value.getTime() &&
                            columnValue.getTime() <= filter.value2.getTime()
                        );
                    }
                    return false;

                case 'oneOf':
                    if (Array.isArray(filter.value)) {
                        return filter.value.includes(String(columnValue));
                    }
                    return false;

                case 'isEmpty':
                    return (
                        columnValue == null || String(columnValue).trim() === ''
                    );

                case 'isNotEmpty':
                    return (
                        columnValue != null && String(columnValue).trim() !== ''
                    );

                default:
                    return true;
            }
        });
    });
}
