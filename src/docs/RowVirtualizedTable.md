# RowVirtualizedTable

A high-performance virtualized table component built with React, TanStack Table, and shadcn/ui. Efficiently renders thousands of rows with smooth scrolling and professional styling.

## Installation

```bash
npm install grid-plus @tanstack/react-table @tanstack/react-virtual
```

## Quick Start

```tsx
import { RowVirtualizedTable, type ColumnDef } from 'grid-plus';

type Person = {
  id: number;
  name: string;
  email: string;
  age: number;
};

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email', size: 300 },
  { accessorKey: 'age', header: 'Age' },
];

const data: Person[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  // ... thousands more rows
];

function App() {
  return (
    <div className="h-96 w-full border rounded-lg">
      <RowVirtualizedTable 
        data={data} 
        columns={columns} 
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `TData[]` | Yes | - | Array of data objects to display |
| `columns` | `ColumnDef<TData>[]` | Yes | - | Column definitions using TanStack Table format |
| `gridOptions` | `GridOptions<TData>` | No | `{}` | Configuration options for the grid |


## GridOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rowHeight` | `number` | `53` | Fixed height for all rows in pixels |
| `getRowHeight` | `(row: TData \| null) => number` | - | Function to calculate dynamic row height per row |

## Column Configuration

The `columns` prop uses TanStack Table's `ColumnDef` format. Here are the most commonly used properties:

```tsx
const columns: ColumnDef<MyData>[] = [
  {
    accessorKey: 'name',           // Field name from your data
    header: 'Full Name',           // Column header text
    size: 200,                     // Column width in pixels (default: 150)
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
    size: 300,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {      // Custom cell rendering
      const status = getValue() as string;
      return (
        <span className={`px-2 py-1 rounded ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
        }`}>
          {status}
        </span>
      );
    },
  },
];
```

## Container Sizing (Required)

The table requires a parent container with defined dimensions, similar to ag-grid:

```tsx
// Parent defines size
<div className="h-96 w-full">
  <RowVirtualizedTable data={data} columns={columns} />
</div>
```

## Performance

### Virtualization

- **Efficient rendering**: Only visible rows are rendered in the DOM
- **Smooth scrolling**: Handles 10,000+ rows without performance issues
- **Memory optimization**: Constant memory usage regardless of data size

### Best Practices

1. **Fixed column widths**: Specify `size` for columns to prevent layout shifts
2. **Consistent row heights**: Use fixed `rowHeight` when possible for best performance
3. **Memoize data**: Use `useMemo` for data and columns to prevent unnecessary re-renders

```tsx
const memoizedData = useMemo(() => largeDataset, [largeDataset]);
const memoizedColumns = useMemo(() => columnDefinitions, []);

<RowVirtualizedTable data={memoizedData} columns={memoizedColumns} />
```

## Advanced Examples

### Custom Row Heights

```tsx
<RowVirtualizedTable
  data={messages}
  columns={messageColumns}
  gridOptions={{
    getRowHeight: (row) => {
      if (!row) return 53; // Loading row
      return row.message.length > 100 ? 80 : 53; // Tall rows for long messages
    }
  }}
/>
```

### Full Viewport Table

```tsx
function FullScreenTable() {
  return (
    <div className="h-screen w-full p-4">
      <div className="h-full border rounded-lg">
        <RowVirtualizedTable
          data={data}
          columns={columns}
        />
      </div>
    </div>
  );
}
```

## TypeScript

The component is fully typed with TypeScript generics:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe column definitions
const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },     // 'name' exists on User
  { accessorKey: 'invalid', header: 'Oops' }, // TypeScript error
];

// Type-safe props
const props: RowVirtualizedTableProps<User> = {
  data: users,    // Must be User[]
  columns,        // Must be ColumnDef<User>[]
};
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- React 18+
- @tanstack/react-table 8+
- @tanstack/react-virtual 3+
- Tailwind CSS (for styling)

## License

MIT