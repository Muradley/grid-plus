# Data Source

GridPlus is designed for large datasets and server-side operations. Instead of managing all rows on the client, it relies on a **data source** to load rows on demand. This design pattern minimizes memory usage and enables virtualization by only rendering what's visible in the viewport.

## What You Provide

To use GridPlus, you provide a `datasource` prop to the `DataGrid` component. This object must implement the `TableDatasource<T>` interface:

```ts
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
```

GridPlus will automatically call `getRows` whenever a new range of rows becomes visible. You are responsible for:

* Fetching rows from your backend or local source
* Respecting the `startRow` and `endRow` range
* Applying any requested sorting and filtering (if needed)
* Returning the rows via `successCallback`
* Calling `failCallback` on error

### Example: Basic Server Data Fetch

```ts
const datasource: TableDatasource<Person> = {
  getRows: async ({ startRow, endRow, successCallback, failCallback, sortModel, columnFilters }) => {
    try {
      const response = await fetch(`/api/people?start=${startRow}&end=${endRow}`);
      const data = await response.json();

      successCallback(data.rows, data.totalCount - 1); // totalCount - 1 to get the last row index
    } catch (err) {
      failCallback(err);
    }
  },
};
```

You pass this `datasource` into your `DataGrid` component:

```tsx
<DataGrid columns={columns} datasource={datasource} />
```

## Sorting and Filtering

GridPlus passes sorting and filter state to the `getRows` function via `sortModel` and `columnFilters`.

You are responsible for interpreting and applying those when fetching your data.

* `sortModel` is an array of sort instructions like:

  ```ts
  [{ id: 'name', desc: false }]
  ```
* `columnFilters` is an array of filters like:

  ```ts
  [{ id: 'age', value: '>30' }]
  ```

For details on the shape of these values and how they are created, see the [Filtering](./filtering.md) and [Sorting](./sorting.md) sections.

## Row Count

If the total number of rows is known in advance, you can set the optional `rowCount` field on the datasource. This will improve accuracy in scrollbars and reduce the number of calls to your backend.

```ts
const datasource: TableDatasource<Person> = {
  rowCount: 1200,
  getRows: ...
};
```

If omitted, GridPlus will infer the total row count from the highest `lastRow` returned.

## Caching

When you pass a `datasource` to `DataGrid`, it internally sets up a cache and virtual row loading. Rows are loaded in blocks and stored in an LRU (Least Recently Used) cache to avoid refetching data.

You can configure:

* `cacheBlockSize` — how many rows per block (default: 100)
* `maxBlocksInCache` — how many blocks to store in memory (default: 10)
* `cacheOverflowSize` — number of extra blocks to preload before and after the visible range (default: 1)

These are optional props on the `DataGrid` component:

```tsx
<DataGrid
  columns={columns}
  datasource={datasource}
  cacheBlockSize={100}
  maxBlocksInCache={10}
  cacheOverflowSize={1}
/>
```

## Summary

To use GridPlus with your own data:

1. Implement the `TableDatasource<T>` interface
2. Handle pagination, sorting, and filtering in `getRows`
3. Pass the datasource to `DataGrid`

GridPlus handles everything else, including virtualization, caching, scroll preloading, and performance optimization.

See the [API Reference](./api-reference.md) for full details on all related props.
