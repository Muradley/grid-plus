# Performance

GridPlus is optimized for large datasets through server-side data loading and row virtualization. To ensure smooth scrolling and efficient rendering, there are a few key considerations.

## Virtualization and Row Height

GridPlus uses row virtualization to render only the rows visible in the viewport, significantly improving performance for large datasets.

To make virtualization efficient, the grid needs to **estimate the pixel height** of each row in advance. This estimate is used to calculate the scroll position, determine how many rows should be rendered, and minimize DOM operations.

This is done using one of two properties in `gridOptions`:

* `rowHeight`: A fixed pixel height for all rows.
* `getRowHeight`: A function to return a custom height per row.

If neither is provided, the default row height is **40 pixels**.

### Example: Fixed Row Height

```tsx
<Datagrid
  columns={columns}
  datasource={yourDataSource}
  gridOptions={{ rowHeight: 36 }}
/>
```

### Example: Dynamic Row Height

```tsx
<Datagrid
  columns={columns}
  datasource={yourDataSource}
  gridOptions={{
    getRowHeight: (row) => {
      if (!row) return 40;
      return row.notes?.length > 300 ? 80 : 40;
    },
  }}
/>
```

The grid uses the return value of `rowHeight` or `getRowHeight` to estimate the total scrollable height and determine which rows to render.

## Column Widths and Virtualization

For virtualization to work properly, all columns must have fixed widths. GridPlus sets a default column size of `200px`.

If you'd like to customize the width of a specific column, provide the `size` property in the column definition:

```ts
const columns: ColumnDef<MyData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 150, // custom column width
  },
  // ...
];
```

Avoid using auto-resizing or flexible-width columns when virtualization is enabled, as it can lead to misaligned or incorrectly rendered content during scrolling.

## Avoiding Re-renders

To reduce unnecessary re-renders:

* Memoize column definitions with `useMemo`, especially if they contain render functions.
* Avoid redefining your data source or handlers on every render.

These steps help keep the rendering lifecycle tight and ensure optimal performance even with large tables.
