import { useState } from 'react';
import {
    getFilterCondition,
    updateFilterCondition,
    removeFilterCondition,
} from './FilterUtils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    OPERATOR_LABELS,
    OPERATORS_BY_TYPE,
    type ColumnFiltersState,
    type FilterOperator,
} from '@/types/FilterDataTypes';

interface BooleanFilterProps {
    columnId: string;
    columnFilters: ColumnFiltersState;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
    onClose: () => void;
}

export function BooleanFilter({
    columnId,
    columnFilters,
    onFiltersChange,
    onClose,
}: BooleanFilterProps) {
    const currentFilter = getFilterCondition(columnFilters, columnId);

    const [operator, setOperator] = useState<FilterOperator>(
        currentFilter?.operator || 'equals'
    );
    const [value, setValue] = useState<string>(
        typeof currentFilter?.value === 'boolean'
            ? currentFilter.value.toString()
            : 'all'
    );

    const availableOperators = OPERATORS_BY_TYPE.boolean;

    const clearFilter = () => {
        setValue('all');
        setOperator('equals');

        const newFilters = removeFilterCondition(columnFilters, columnId);
        onFiltersChange?.(newFilters);
    };

    const handleOperatorChange = (newOperator: FilterOperator) => {
        setOperator(newOperator);

        if (newOperator === 'isEmpty' || newOperator === 'isNotEmpty') {
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                newOperator,
                null
            );
            onFiltersChange?.(newFilters);
        } else if (value !== 'all') {
            const boolValue = value === 'true';
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                newOperator,
                boolValue
            );
            onFiltersChange?.(newFilters);
        } else {
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
        }
    };

    const handleValueChange = (newValue: string) => {
        setValue(newValue);

        if (operator === 'isEmpty' || operator === 'isNotEmpty') {
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                operator,
                null
            );
            onFiltersChange?.(newFilters);
        } else if (newValue !== 'all') {
            const boolValue = newValue === 'true';
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                operator,
                boolValue
            );
            onFiltersChange?.(newFilters);
        } else {
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const showValueSelect = !['isEmpty', 'isNotEmpty'].includes(operator);

    return (
        <div className="p-3 w-64 space-y-2">
            <Select value={operator} onValueChange={handleOperatorChange}>
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {availableOperators.map((op) => (
                        <SelectItem key={op} value={op}>
                            {OPERATOR_LABELS[op]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {showValueSelect && (
                <Select value={value} onValueChange={handleValueChange}>
                    <SelectTrigger className="w-full" onKeyDown={handleKeyDown}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {currentFilter && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilter}
                    className="w-full text-muted-foreground hover:text-foreground"
                >
                    Clear
                </Button>
            )}
        </div>
    );
}
