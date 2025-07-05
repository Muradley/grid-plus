import { useState, useEffect, useMemo } from 'react';
import {
    getFilterCondition,
    updateFilterCondition,
    removeFilterCondition,
} from './FilterUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    OPERATOR_LABELS,
    OPERATORS_BY_TYPE,
    type ColumnFiltersState,
    type FilterOperator,
} from '@/types/FilterDataTypes';
import _ from 'lodash';

interface StringFilterProps {
    columnId: string;
    columnFilters: ColumnFiltersState;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
    onClose: () => void;
}

export function StringFilter({
    columnId,
    columnFilters,
    onFiltersChange,
    onClose,
}: StringFilterProps) {
    const currentFilter = getFilterCondition(columnFilters, columnId);

    const [operator, setOperator] = useState<FilterOperator>(
        currentFilter?.operator || 'contains'
    );

    const [value, setValue] = useState<string>(
        typeof currentFilter?.value === 'string' ? currentFilter.value : ''
    );

    const availableOperators = OPERATORS_BY_TYPE.string;

    const clearFilter = () => {
        setValue('');
        setOperator('contains');

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
        } else if (value.trim()) {
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                newOperator,
                value.trim()
            );
            onFiltersChange?.(newFilters);
        } else {
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
        }
    };

    const debouncedFilterChange = useMemo(
        () =>
            _.debounce((newValue: string, currentOperator: FilterOperator) => {
                if (
                    currentOperator === 'isEmpty' ||
                    currentOperator === 'isNotEmpty'
                ) {
                    const newFilters = updateFilterCondition(
                        columnFilters,
                        columnId,
                        currentOperator,
                        null
                    );
                    onFiltersChange?.(newFilters);
                } else if (newValue.trim()) {
                    const newFilters = updateFilterCondition(
                        columnFilters,
                        columnId,
                        currentOperator,
                        newValue.trim()
                    );
                    onFiltersChange?.(newFilters);
                } else {
                    const newFilters = removeFilterCondition(
                        columnFilters,
                        columnId
                    );
                    onFiltersChange?.(newFilters);
                }
            }, 200),
        [columnFilters, columnId, onFiltersChange]
    );

    const handleValueChange = (newValue: string) => {
        setValue(newValue);

        if (newValue === '') {
            debouncedFilterChange.cancel();
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
            return;
        }

        debouncedFilterChange(newValue, operator);
    };

    useEffect(() => {
        return () => {
            debouncedFilterChange.cancel();
        };
    }, [debouncedFilterChange]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const showValueInput = !['isEmpty', 'isNotEmpty'].includes(operator);

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

            {showValueInput && (
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter value..."
                    className="w-full"
                    autoFocus
                />
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
