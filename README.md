# GridPlus

**GridPlus** is a high-performance, virtualized data grid component for React. It is built on top of [TanStack Table](https://tanstack.com/table) and designed for large datasets, advanced filtering, multi-column sorting, and modern theming. GridPlus is optimized for responsiveness and performance-critical applications.

## Key Features

- Server-side row fetching and caching
- Virtualized rendering for massive datasets
- Multi-column sorting and filtering
- Theming with Tailwind and ShadCN (Zinc by default)
- Fully typed API with TypeScript support
- Customizable row and column sizes

## Installation

```bash
npm install grid-plus @tanstack/react-table @tanstack/react-virtual
```

GridPlus includes precompiled styles. Tailwind CSS is not required unless you want to override default styles. See the [Theming Guide](./docs/theming.md) for customization options.

## When to Use GridPlus

GridPlus is ideal when:

- You need to render thousands (or millions) of rows without slowing down the UI
- Your data is stored remotely or paginated server-side
- You want multi-column filtering, sorting, and theming out-of-the-box
- You need a highly customizable but developer-friendly table

Example use cases:
- Admin dashboards
- Financial/analytics tools
- Complex internal data browsers

## Quick Start

```tsx
import { DataGrid } from 'grid-plus';
import type { ColumnDef } from '@tanstack/react-table';

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

const datasource = {
  getRows: async ({ startRow, endRow, successCallback }) => {
    const response = await fetch(`/api/people?start=${startRow}&end=${endRow}`);
    const data = await response.json();
    successCallback(data.rows, data.totalCount - 1);
  },
};

<div style={{ height: 500 }}>
  <DataGrid columns={columns} datasource={datasource} />
</div>
```

Note: GridPlus must be placed inside a container with a fixed `height` or `maxHeight` and `overflow: auto` to enable virtualization.

## Documentation

See the [full documentation](./docs/index.md) for usage, customization, and API reference.

## Live Examples

Explore interactive demos in [Storybook](https://muradley.github.io/grid-plus/):

- Default configuration
- Filtering with all filter types
- Multi-column sorting
- Dark mode and custom theming
- Large dataset performance test

## Requirements

- React 18+
- `@tanstack/react-table` v8+
- `@tanstack/react-virtual` v3+

## License

GridPlus is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).