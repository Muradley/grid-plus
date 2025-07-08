# GridPlus

**GridPlus** is a high-performance, virtualized data grid component for React. It is built on top of [TanStack Table](https://tanstack.com/table) and designed for large datasets, advanced filtering, multi-column sorting, and modern theming. GridPlus is optimized for responsiveness and performance-critical applications.

## When to Use GridPlus

GridPlus is ideal when working with large datasets, especially where performance is a concern. It uses virtualized row rendering and server-side data operations to minimize memory usage and DOM complexity, even with tens of thousands of rows. An internal LRU (Least Recently Used) cache keeps recently accessed rows in memory to minimize redundant server calls and maintain smooth scroll performance.

Instead of holding all your data in memory, GridPlus expects a data source interface that handles row fetching, filtering, and sorting externally — typically from a backend service. This makes it well-suited for:
- Enterprise dashboards
- Admin panels with paginated APIs
- Analytics tools with complex filtering logic

## Key Features

- Efficient virtualization for smooth performance on large datasets
- Multi-column sorting and advanced filtering
- Designed for server-side data fetching and processing
- Theming support via Tailwind
- Responsive layout that adapts to different screen sizes
- Built-in support for custom row heights and caching
- Fully typed with TypeScript

## Installation

```bash
npm install grid-plus @tanstack/react-table @tanstack/react-virtual
```

GridPlus includes precompiled styles. Tailwind CSS is not required in your application unless you want to extend or override styles. See the [Theming guide](./theming.md) to learn how to customize appearance.

## Quick Start

GridPlus uses **TanStack Table** under the hood. This means column definitions follow the TanStack Table API. For detailed configuration options, refer to [TanStack Table documentation](https://tanstack.com/table).

To render correctly, GridPlus must be placed inside a container with a fixed `height`, or with a `maxHeight` and `overflow: auto`. This enables proper virtualization and scroll behavior.

```tsx
import { ColumnDef } from '@tanstack/react-table';
import { DataGrid } from 'grid-plus';

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

<div style={{ height: 500 }}>
  <DataGrid columns={columns} datasource={datasource} />
</div>
```

To understand how to structure the data source, refer to the [Data Source](./data-source.md) section of this documentation.

## Documentation
Refer to the following sections for detailed documentation on each feature and configuration option in GridPlus.

- [Data Source](./data-source.md)
- [Filtering](./filtering.md)
- [Sorting](./sorting.md)
- [Theming](./theming.md)
- [Performance](./performance.md)
- [API Reference](./api-reference.md)

## Requirements

- React 18 or higher
- @tanstack/react-table v8+
- @tanstack/react-virtual v3+
- TypeScript (recommended but not required)

## Live Examples

Explore live, interactive examples in [Storybook](https://your-deployment-url.com). The following stories are available in the sidebar:
- Default configuration
- Empty data set
- Multi-column sorting
- Filtering with all filter types
- Dark mode and theming
- Large dataset performance test

## License

GridPlus is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).
