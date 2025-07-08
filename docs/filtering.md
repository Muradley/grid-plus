# Filtering

GridPlus supports multi-column server-side filtering through a structured array of filter conditions. Each column can have its own filter, and multiple filters may be active at once. You are responsible for interpreting these filters in your data source logic and returning the filtered results accordingly.

## Defining Filters in Column Definitions

To enable filtering for a column, use the `meta` property in your `ColumnDef`:

```ts
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      filterType: 'string',
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      filterType: 'string',
    },
  },
  {
    accessorKey: 'age',
    header: 'Age',
    meta: {
      filterType: 'number',
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      filterType: 'enum',
      filterOptions: ['Active', 'Inactive'],
    },
  },
];
```

### Filter Types

The following filter types are supported via the `filterType` key:

```ts
type FilterDataType = 'string' | 'number' | 'date' | 'boolean' | 'enum';
```

For `enum` filters, you must provide a `filterOptions` array, which defines the list of valid string values users can select. These values are passed to your data source when filtering is applied.

Each type supports a specific set of operators:

| Filter Type | Operators |
|-------------|-----------|
| `string`    | `equals`, `notEquals`, `contains`, `notContains`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty` |
| `number`    | `equals`, `notEquals`, `greaterThan`, `lessThan`, `greaterThanOrEqual`, `lessThanOrEqual`, `between`, `isEmpty`, `isNotEmpty` |
| `date`      | `equals`, `notEquals`, `before`, `after`, `onOrBefore`, `onOrAfter`, `between`, `isEmpty`, `isNotEmpty` |
| `boolean`   | `equals`, `notEquals` |
| `enum`      | `equals`, `notEquals`, `oneOf`, `notOneOf`, `isEmpty`, `isNotEmpty` |

```ts
type FilterOperator =
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

## FilterCondition Structure

Each active filter is represented by a `FilterCondition` object:

```ts
interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: FilterValue;
  value2?: FilterValue;
}

type FilterValue =
  | string
  | number
  | boolean
  | Date
  | string[]
  | null
  | undefined;
```

The full set of active filters is represented by a `ColumnFiltersState` object:

```ts
type ColumnFiltersState = FilterCondition[];
```

### Notes

- `value2` is **only used** when `operator` is `'between'`
- `value` is **not used** when `operator` is `'isEmpty'` or `'isNotEmpty'`

It is your responsibility to interpret the `ColumnFiltersState` object, passed to your `datasource.getRows()` method via the `columnFilters` parameter, and return the filtered result set.

## Providing Default Filters

To apply filters when the grid is first rendered, use the `defaultFilters` prop:

```tsx
<Datagrid
  columns={columns}
  defaultFilters={[
    {
      column: 'status',
      operator: 'equals',
      value: 'Active',
    },
  ]}
  datasource={yourDataSource}
/>
```
