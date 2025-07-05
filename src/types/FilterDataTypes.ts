export type FilterDataType = 'string' | 'number' | 'date' | 'boolean' | 'enum';

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

export type FilterValue =
    | string
    | number
    | boolean
    | Date
    | string[]
    | null
    | undefined;

export interface FilterCondition {
    column: string;
    operator: FilterOperator;
    value: FilterValue;
    value2?: FilterValue;
}

export type ColumnFiltersState = FilterCondition[];

export const OPERATORS_BY_TYPE: Record<FilterDataType, FilterOperator[]> = {
    string: [
        'equals',
        'notEquals',
        'contains',
        'notContains',
        'startsWith',
        'endsWith',
        'isEmpty',
        'isNotEmpty',
    ],
    number: [
        'equals',
        'notEquals',
        'greaterThan',
        'lessThan',
        'greaterThanOrEqual',
        'lessThanOrEqual',
        'between',
        'isEmpty',
        'isNotEmpty',
    ],
    date: [
        'equals',
        'notEquals',
        'before',
        'after',
        'onOrBefore',
        'onOrAfter',
        'between',
        'isEmpty',
        'isNotEmpty',
    ],
    boolean: ['equals', 'notEquals'],
    enum: ['equals', 'notEquals', 'oneOf', 'notOneOf', 'isEmpty', 'isNotEmpty'],
};

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
    equals: 'Equals',
    notEquals: 'Not equals',
    contains: 'Contains',
    notContains: 'Does not contain',
    startsWith: 'Starts with',
    endsWith: 'Ends with',
    greaterThan: 'Greater than',
    lessThan: 'Less than',
    greaterThanOrEqual: 'Greater than or equal',
    lessThanOrEqual: 'Less than or equal',
    between: 'Between',
    before: 'Before',
    after: 'After',
    onOrBefore: 'On or before',
    onOrAfter: 'On or after',
    oneOf: 'One of',
    notOneOf: 'Not one of',
    isEmpty: 'Is empty',
    isNotEmpty: 'Is not empty',
};

export interface ColumnMeta {
    filterType?: FilterDataType;
    filterOptions?: string[];
}
