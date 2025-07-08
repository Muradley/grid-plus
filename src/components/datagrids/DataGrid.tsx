import { RowVirtualizedTable } from './RowVirtualizedTable';
import type {
    GridOptions,
    TableDatasource,
} from '../../types/DataSourceTypes.ts';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { useInfiniteDataSource } from '@/hooks/useInfiniteDataSource.ts';
import type { ColumnFiltersState } from '@/types/FilterDataTypes.ts';

export type DataGridProps<TData> = {
    datasource: TableDatasource<TData>;
    columns: ColumnDef<TData>[];
    gridOptions?: GridOptions<TData>;
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
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
