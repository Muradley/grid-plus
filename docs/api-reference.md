# API Reference

This document contains all public types and utilities exposed by the GridPlus package.

---

## Components

### `DataGrid`

The main component to render a virtualized, filterable, and sortable table.

#### Props: `DataGridProps<TData>`

```ts
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
```

---

## Data Source

### `TableDatasource<TData>`

```ts
export type TableDatasource<TData> = {
  rowCount?: number;
  getRows(params: GetRowsParams<TData>): void;
};
```

### `GetRowsParams<TData>`

```ts
export type GetRowsParams<TData> = {
  startRow: number;
  endRow: number;
  successCallback(rowsThisBlock: TData[], lastRow?: number): void;
  failCallback(error?: Error): void;
  sortModel?: SortingState;
  columnFilters?: ColumnFiltersState;
};
```

---

## Grid Options

### `GridOptions<TData>`

```ts
export type GridOptions<TData> = {
  rowHeight?: number;
  getRowHeight?: (row: TData | null) => number;
};
```

---

## Filtering

### `ColumnFiltersState`

```ts
export type ColumnFiltersState = FilterCondition[];
```

### `FilterCondition`

```ts
export interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: FilterValue;
  value2?: FilterValue;
}
```

### `FilterValue`

```ts
export type FilterValue =
  | string
  | number
  | boolean
  | Date
  | string[]
  | null
  | undefined;
```

### `FilterOperator`

```ts
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'before'
  | 'after'
  | 'onOrBefore'
  | 'onOrAfter'
  | 'oneOf'
  | 'notOneOf';
```

### `FilterDataType`

```ts
export type FilterDataType = 'string' | 'number' | 'date' | 'boolean' | 'enum';
```

### `ColumnMeta`

```ts
export interface ColumnMeta {
  filterType?: FilterDataType;
  filterOptions?: string[];
}
```

### `OPERATORS_BY_TYPE`

```ts
export const OPERATORS_BY_TYPE: Record<FilterDataType, FilterOperator[]>;
```

### `OPERATOR_LABELS`

```ts
export const OPERATOR_LABELS: Record<FilterOperator, string>;
```

---

## Utilities

### `cn`

A utility function to concatenate class names conditionally.

```ts
export declare function cn(...inputs: ClassValue[]): string;
```
