import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid } from '../index';
import type { ColumnDef } from '@tanstack/react-table';
import { createMockDatasource } from './mockDatasource';
import { createMockData, type Person } from './mockData';
import { useEffect } from 'react';

const columns: ColumnDef<Person>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        meta: { filterType: 'string' },
    },
    {
        accessorKey: 'age',
        header: 'Age',
        size: 120,
        enableSorting: true,
        meta: { filterType: 'number' },
    },
    {
        accessorKey: 'salary',
        header: 'Salary',
        size: 160,
        enableSorting: true,
        meta: { filterType: 'number' },
        cell: ({ getValue }) => `$${getValue<number>().toLocaleString()}`,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        size: 140,
        enableSorting: true,
        meta: {
            filterType: 'enum',
            filterOptions: ['active', 'inactive', 'pending'],
        },
    },
    {
        accessorKey: 'department',
        header: 'Department',
        size: 160,
        enableSorting: true,
        meta: {
            filterType: 'enum',
            filterOptions: [
                'Engineering',
                'Sales',
                'Marketing',
                'HR',
                'Finance',
            ],
        },
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
        size: 160,
        enableSorting: true,
        meta: { filterType: 'date' },
        cell: ({ getValue }) => getValue<Date>().toLocaleDateString(),
    },
    {
        accessorKey: 'isManager',
        header: 'Manager',
        size: 140,
        enableSorting: true,
        meta: { filterType: 'boolean' },
        cell: ({ getValue }) => (getValue<boolean>() ? 'Yes' : 'No'),
    },
];

const meta: Meta<typeof DataGrid<Person>> = {
    title: 'DataGrid',
    component: DataGrid,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div className="h-screen w-full p-4">
                <div className="h-full border">
                    <Story />
                </div>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default - Basic example
export const Default: Story = {
    args: {
        datasource: createMockDatasource(createMockData(500)),
        columns,
    },
    parameters: {
        docs: {
            description: {
                story: 'Basic DataGrid with 500 rows. Try sorting columns by clicking headers and filtering with the filter icons.',
            },
        },
    },
};

// 2. Empty - Shows empty state
export const Empty: Story = {
    args: {
        datasource: createMockDatasource([]),
        columns,
    },
    parameters: {
        docs: {
            description: {
                story: 'DataGrid with no data to demonstrate empty state handling.',
            },
        },
    },
};

// 3. Multi Column Sort
export const MultiColumnSort: Story = {
    args: {
        datasource: createMockDatasource(createMockData(1000)),
        columns,
        defaultSort: [
            { id: 'department', desc: false },
            { id: 'salary', desc: true },
            { id: 'name', desc: false },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'DataGrid with multi-column sorting: Department (ASC) → Salary (DESC) → Name (ASC). Try Shift+clicking headers to add more sorts.',
            },
        },
    },
};

// 4. All Filter Types
export const AllFilterTypes: Story = {
    args: {
        datasource: createMockDatasource(createMockData(2000)),
        columns,
        defaultFilters: [
            { column: 'name', operator: 'contains', value: '1' },
            { column: 'age', operator: 'between', value: 25, value2: 40 },
            {
                column: 'status',
                operator: 'oneOf',
                value: ['active', 'pending'],
            },
            { column: 'salary', operator: 'greaterThan', value: 60000 },
            { column: 'isManager', operator: 'equals', value: true },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates all filter types: string contains, number between, enum oneOf, number greater than, and boolean equals. Click filter icons to modify or add filters.',
            },
        },
    },
};

// 5. Large Dataset
export const LargeDataset: Story = {
    args: {
        datasource: createMockDatasource(createMockData(25000)),
        columns,
        cacheBlockSize: 100,
        maxBlocksInCache: 15,
    },
    parameters: {
        docs: {
            description: {
                story: 'Large dataset with 25,000 rows to demonstrate virtualization performance. Notice smooth scrolling and intelligent caching.',
            },
        },
    },
};

// 6. Slate Theme - Shows shadcn's Slate theme
export const SlateTheme: Story = {
    args: {
        datasource: createMockDatasource(createMockData(500)),
        columns,
    },
    decorators: [
        (Story) => {
            // Inject CSS custom properties without changing layout
            useEffect(() => {
                const style = document.createElement('style');
                style.id = 'slate-theme-override';
                style.textContent = `
                    .sb-show-main {
                        --background: oklch(0.129 0.042 264.695);
                        --foreground: oklch(0.984 0.003 247.858);
                        --card: oklch(0.208 0.042 265.755);
                        --card-foreground: oklch(0.984 0.003 247.858);
                        --popover: oklch(0.208 0.042 265.755);
                        --popover-foreground: oklch(0.984 0.003 247.858);
                        --primary: oklch(0.929 0.013 255.508);
                        --primary-foreground: oklch(0.208 0.042 265.755);
                        --secondary: oklch(0.279 0.041 260.031);
                        --secondary-foreground: oklch(0.984 0.003 247.858);
                        --muted: oklch(0.279 0.041 260.031);
                        --muted-foreground: oklch(0.704 0.04 256.788);
                        --accent: oklch(0.279 0.041 260.031);
                        --accent-foreground: oklch(0.984 0.003 247.858);
                        --destructive: oklch(0.704 0.191 22.216);
                        --border: oklch(1 0 0 / 10%);
                        --input: oklch(1 0 0 / 15%);
                        --ring: oklch(0.551 0.027 264.364);
                        --chart-1: oklch(0.488 0.243 264.376);
                        --chart-2: oklch(0.696 0.17 162.48);
                        --chart-3: oklch(0.769 0.188 70.08);
                        --chart-4: oklch(0.627 0.265 303.9);
                        --chart-5: oklch(0.645 0.246 16.439);
                        --sidebar: oklch(0.208 0.042 265.755);
                        --sidebar-foreground: oklch(0.984 0.003 247.858);
                        --sidebar-primary: oklch(0.488 0.243 264.376);
                        --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
                        --sidebar-accent: oklch(0.279 0.041 260.031);
                        --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
                        --sidebar-border: oklch(1 0 0 / 10%);
                        --sidebar-ring: oklch(0.551 0.027 264.364);
                    }`;
                document.head.appendChild(style);

                return () => {
                    const existingStyle = document.getElementById(
                        'slate-theme-override'
                    );
                    if (existingStyle) {
                        existingStyle.remove();
                    }
                };
            }, []);

            return <Story />;
        },
    ],
    parameters: {
        docs: {
            description: {
                story: "DataGrid with shadcn's Slate theme applied. Features cooler gray tones compared to the default theme.",
            },
        },
    },
};
