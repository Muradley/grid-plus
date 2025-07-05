import type { SortingState } from '@tanstack/react-table';
import type { ColumnFiltersState } from './FilterDataTypes';

export type GetRowsParams<TData> = {
    startRow: number;
    endRow: number;
    successCallback(rowsThisBlock: TData[], lastRow?: number): void;
    failCallback(error?: Error): void;
    sortModel?: SortingState;
    columnFilters?: ColumnFiltersState;
};

export type TableDatasource<TData> = {
    rowCount?: number;
    getRows(params: GetRowsParams<TData>): void;
};

export type GridOptions<TData> = {
    rowHeight?: number;
    getRowHeight?: (row: TData | null) => number;
};
