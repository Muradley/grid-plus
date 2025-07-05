import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
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

interface NumberFilterProps {
    columnId: string;
    columnFilters: ColumnFiltersState;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
    onClose: () => void;
}

export function NumberFilter({
    columnId,
    columnFilters,
    onFiltersChange,
    onClose,
}: NumberFilterProps) {
    const currentFilter = getFilterCondition(columnFilters, columnId);

    const [operator, setOperator] = useState<FilterOperator>(
        currentFilter?.operator || 'equals'
    );
    const [value, setValue] = useState<string>(
        typeof currentFilter?.value === 'number'
            ? currentFilter.value.toString()
            : ''
    );
    const [value2, setValue2] = useState<string>(
        typeof currentFilter?.value2 === 'number'
            ? currentFilter.value2.toString()
            : ''
    );

    const availableOperators = OPERATORS_BY_TYPE.number;

    const clearFilter = () => {
        setValue('');
        setValue2('');
        setOperator('equals');

        const newFilters = removeFilterCondition(columnFilters, columnId);
        onFiltersChange?.(newFilters);
    };

    const debouncedFilterChange = useMemo(
        () =>
            _.debounce(
                (
                    newValue: string,
                    newValue2: string,
                    currentOperator: FilterOperator
                ) => {
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
                    } else if (currentOperator === 'between') {
                        if (newValue.trim() && newValue2.trim()) {
                            const numValue = parseFloat(newValue);
                            const numValue2 = parseFloat(newValue2);
                            if (!isNaN(numValue) && !isNaN(numValue2)) {
                                const newFilters = updateFilterCondition(
                                    columnFilters,
                                    columnId,
                                    currentOperator,
                                    numValue,
                                    numValue2
                                );
                                onFiltersChange?.(newFilters);
                            }
                        } else {
                            const newFilters = removeFilterCondition(
                                columnFilters,
                                columnId
                            );
                            onFiltersChange?.(newFilters);
                        }
                    } else if (newValue.trim()) {
                        const numValue = parseFloat(newValue);
                        if (!isNaN(numValue)) {
                            const newFilters = updateFilterCondition(
                                columnFilters,
                                columnId,
                                currentOperator,
                                numValue
                            );
                            onFiltersChange?.(newFilters);
                        }
                    } else {
                        const newFilters = removeFilterCondition(
                            columnFilters,
                            columnId
                        );
                        onFiltersChange?.(newFilters);
                    }
                },
                200
            ),
        [columnFilters, columnId, onFiltersChange]
    );

    useEffect(() => {
        return () => {
            debouncedFilterChange.cancel();
        };
    }, [debouncedFilterChange]);

    const handleOperatorChange = (newOperator: FilterOperator) => {
        setOperator(newOperator);

        if (newOperator === 'isEmpty' || newOperator === 'isNotEmpty') {
            debouncedFilterChange.cancel();
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                newOperator,
                null
            );
            onFiltersChange?.(newFilters);
        } else if (newOperator === 'between') {
            if (value.trim() && value2.trim()) {
                const numValue = parseFloat(value);
                const numValue2 = parseFloat(value2);
                if (!isNaN(numValue) && !isNaN(numValue2)) {
                    debouncedFilterChange.cancel();
                    const newFilters = updateFilterCondition(
                        columnFilters,
                        columnId,
                        newOperator,
                        numValue,
                        numValue2
                    );
                    onFiltersChange?.(newFilters);
                }
            } else {
                debouncedFilterChange.cancel();
                const newFilters = removeFilterCondition(
                    columnFilters,
                    columnId
                );
                onFiltersChange?.(newFilters);
            }
        } else if (value.trim()) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                debouncedFilterChange.cancel();
                const newFilters = updateFilterCondition(
                    columnFilters,
                    columnId,
                    newOperator,
                    numValue
                );
                onFiltersChange?.(newFilters);
            }
        } else {
            debouncedFilterChange.cancel();
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
        }
    };

    const handleValueChange = (newValue: string) => {
        setValue(newValue);

        if (newValue === '') {
            debouncedFilterChange.cancel();
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
            return;
        }

        debouncedFilterChange(newValue, value2, operator);
    };

    const handleValue2Change = (newValue2: string) => {
        setValue2(newValue2);

        if (newValue2 === '' && operator === 'between') {
            debouncedFilterChange.cancel();
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
            return;
        }

        debouncedFilterChange(value, newValue2, operator);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const showValueInput = !['isEmpty', 'isNotEmpty'].includes(operator);
    const showValue2Input = operator === 'between';

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
                    type="number"
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter number..."
                    className="w-full"
                    autoFocus
                />
            )}

            {showValue2Input && (
                <Input
                    type="number"
                    value={value2}
                    onChange={(e) => handleValue2Change(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter second number..."
                    className="w-full"
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
