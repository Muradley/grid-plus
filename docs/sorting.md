# Sorting

GridPlus supports multi-column server-side sorting using the same `SortingState` format defined by TanStack Table. Sorting is fully managed by the grid, and your responsibility is to interpret the sort model passed into your data source and return the sorted results.

## How Sorting Works

Each column header supports click-based toggling:

* First click: Sorts the column in ascending order.
* Second click: Sorts in descending order.
* Third click: Removes sorting from the column.

Users can also multi-sort by holding the Shift key while clicking additional column headers. This allows for secondary and tertiary sorts to be applied and respected in order.

## Interpreting the Sort Model

The `sortModel` is provided to your data source's `getRows()` method:

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

### SortingState Structure

```ts
import type { SortingState } from '@tanstack/react-table';

const example: SortingState = [
  {
    id: 'lastName',
    desc: false, // ascending
  },
  {
    id: 'age',
    desc: true, // descending
  },
];
```

* Each item in the array represents one column sort.
* The array is ordered, so sort priority is preserved (first is primary, second is secondary, etc.).
* `desc: true` means descending order.

In your `getRows` implementation, you should sort the underlying data using the order and direction specified by `sortModel` before returning it.

## Enabling Sorting on Columns

To make a column sortable, simply ensure that the `accessorKey` is defined. All columns are sortable by default unless you explicitly disable it.

If you need to customize sort behavior (e.g. disable sorting for certain columns), use TanStack Table's column `enableSorting` field:

```ts
{
  accessorKey: 'email',
  header: 'Email',
  enableSorting: false, // disables sorting for this column
}
```

## Default Sorting

To apply an initial sort when the grid loads, pass a `defaultSort` prop:

```tsx
<Datagrid
  columns={columns}
  defaultSort={[
    { id: 'name', desc: false }, // ascending sort on 'name'
    { id: 'age', desc: true },  // then descending sort on 'age'
  ]}
  datasource={yourDataSource}
/>
```

## Summary

* Sorting is handled entirely by the grid.
* You receive the sort model in your data source's `getRows()` method.
* Use this model to apply the desired sort logic in your backend or in-memory dataset.
* GridPlus supports shift-click multi-column sorting and passes the ordered list of sort conditions accordingly.
