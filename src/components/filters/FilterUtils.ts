import type {
    ColumnFiltersState,
    FilterCondition,
    FilterOperator,
    FilterValue,
} from '../../types/FilterDataTypes.ts';

export function addFilterCondition(
    currentFilters: ColumnFiltersState,
    newCondition: FilterCondition
): ColumnFiltersState {
    const withoutExisting = removeFilterCondition(
        currentFilters,
        newCondition.column
    );
    return [...withoutExisting, newCondition];
}

export function updateFilterCondition(
    currentFilters: ColumnFiltersState,
    column: string,
    operator: FilterOperator,
    value: FilterValue,
    value2?: FilterValue
): ColumnFiltersState {
    const newCondition: FilterCondition = {
        column,
        operator,
        value,
        value2,
    };
    return addFilterCondition(currentFilters, newCondition);
}

export function removeFilterCondition(
    currentFilters: ColumnFiltersState,
    column: string
): ColumnFiltersState {
    return currentFilters.filter((condition) => condition.column !== column);
}

export function getFilterCondition(
    currentFilters: ColumnFiltersState,
    column: string
): FilterCondition | undefined {
    return currentFilters.find((condition) => condition.column === column);
}

export function hasActiveFilter(
    currentFilters: ColumnFiltersState,
    column: string
): boolean {
    return getFilterCondition(currentFilters, column) !== undefined;
}

export function clearAllFilters(): ColumnFiltersState {
    return [];
}

export function getActiveFilterCount(
    currentFilters: ColumnFiltersState
): number {
    return currentFilters.length;
}

export function isValidFilterCondition(condition: FilterCondition): boolean {
    if (!condition.column || !condition.operator) {
        return false;
    }

    const operatorsWithoutValue = ['isEmpty', 'isNotEmpty'];
    if (!operatorsWithoutValue.includes(condition.operator)) {
        if (condition.value === null || condition.value === undefined) {
            return false;
        }
    }

    if (condition.operator === 'between') {
        if (condition.value2 === null || condition.value2 === undefined) {
            return false;
        }
    }

    return true;
}

export function getFilterDescription(condition: FilterCondition): string {
    const { column, operator, value, value2 } = condition;

    switch (operator) {
        case 'equals':
            return `${column} equals "${value}"`;
        case 'notEquals':
            return `${column} does not equal "${value}"`;
        case 'contains':
            return `${column} contains "${value}"`;
        case 'notContains':
            return `${column} does not contain "${value}"`;
        case 'startsWith':
            return `${column} starts with "${value}"`;
        case 'endsWith':
            return `${column} ends with "${value}"`;
        case 'greaterThan':
            return `${column} > ${value}`;
        case 'lessThan':
            return `${column} < ${value}`;
        case 'greaterThanOrEqual':
            return `${column} >= ${value}`;
        case 'lessThanOrEqual':
            return `${column} <= ${value}`;
        case 'between':
            return `${column} between ${value} and ${value2}`;
        case 'before':
            return `${column} before ${value}`;
        case 'after':
            return `${column} after ${value}`;
        case 'onOrBefore':
            return `${column} on or before ${value}`;
        case 'onOrAfter':
            return `${column} on or after ${value}`;
        case 'oneOf':
            return `${column} is one of: ${Array.isArray(value) ? value.join(', ') : value}`;
        case 'notOneOf':
            return `${column} is not one of: ${Array.isArray(value) ? value.join(', ') : value}`;
        case 'isEmpty':
            return `${column} is empty`;
        case 'isNotEmpty':
            return `${column} is not empty`;
        default:
            return `${column} ${operator} ${value}`;
    }
}
