import type { FilterDataType } from './FilterDataTypes.ts';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData, TValue> {
        filterType?: FilterDataType;
        filterOptions?: string[];
    }
}
