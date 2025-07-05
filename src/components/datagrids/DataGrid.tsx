import {
    RowVirtualizedTable,
    type RowVirtualizedTableProps,
} from './RowVirtualizedTable';
import type { TableDatasource } from '../../types/DataSourceTypes.ts';
import type { SortingState } from '@tanstack/react-table';
import { useInfiniteDataSource } from '@/hooks/useInfiniteDataSource.ts';
import type { ColumnFiltersState } from '@/types/FilterDataTypes.ts';

export type DataGridProps<TData> = Omit<
    RowVirtualizedTableProps<TData>,
    | 'data'
    | 'totalRows'
    | 'onVisibleRangeChange'
    | 'sortModel'
    | 'onSortModelChange'
> & {
    datasource: TableDatasource<TData>;
    cacheBlockSize?: number;
    maxBlocksInCache?: number;
    cacheOverflowSize?: number;
    defaultSort?: SortingState;
    defaultFilters?: ColumnFiltersState;
};

export function DataGrid<TData>({
    datasource,
    columns,
    gridOptions,
    cacheBlockSize,
    maxBlocksInCache,
    cacheOverflowSize,
    defaultSort,
    defaultFilters,
}: DataGridProps<TData>) {
    const {
        virtualData,
        totalRows,
        preloadBlocks,
        sortModel,
        setSortModel,
        columnFilters,
        setColumnFilters,
    } = useInfiniteDataSource({
        datasource,
        cacheBlockSize,
        maxBlocksInCache,
        cacheOverflowSize,
        defaultSort,
        defaultFilters,
    });

    return (
        <RowVirtualizedTable
            data={virtualData}
            totalRows={totalRows}
            onVisibleRangeChange={preloadBlocks}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            columns={columns}
            gridOptions={gridOptions}
        />
    );
}
