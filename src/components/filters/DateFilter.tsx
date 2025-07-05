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

interface DateFilterProps {
    columnId: string;
    columnFilters: ColumnFiltersState;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
    onClose: () => void;
}

export function DateFilter({
    columnId,
    columnFilters,
    onFiltersChange,
    onClose,
}: DateFilterProps) {
    const currentFilter = getFilterCondition(columnFilters, columnId);

    const [operator, setOperator] = useState<FilterOperator>(
        currentFilter?.operator || 'equals'
    );

    const formatDateForInput = (dateValue: unknown): string => {
        if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0];
        }
        if (typeof dateValue === 'string') {
            const date = new Date(dateValue);
            return !isNaN(date.getTime())
                ? date.toISOString().split('T')[0]
                : '';
        }
        return '';
    };

    const [value, setValue] = useState<string>(() =>
        formatDateForInput(currentFilter?.value)
    );
    const [value2, setValue2] = useState<string>(() =>
        formatDateForInput(currentFilter?.value2)
    );

    const availableOperators = OPERATORS_BY_TYPE.date;

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
                        if (newValue && newValue2) {
                            const dateValue = new Date(newValue);
                            const dateValue2 = new Date(newValue2);
                            if (
                                !isNaN(dateValue.getTime()) &&
                                !isNaN(dateValue2.getTime())
                            ) {
                                const newFilters = updateFilterCondition(
                                    columnFilters,
                                    columnId,
                                    currentOperator,
                                    dateValue,
                                    dateValue2
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
                    } else if (newValue) {
                        const dateValue = new Date(newValue);
                        if (!isNaN(dateValue.getTime())) {
                            const newFilters = updateFilterCondition(
                                columnFilters,
                                columnId,
                                currentOperator,
                                dateValue
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
            if (value && value2) {
                const dateValue = new Date(value);
                const dateValue2 = new Date(value2);
                if (
                    !isNaN(dateValue.getTime()) &&
                    !isNaN(dateValue2.getTime())
                ) {
                    debouncedFilterChange.cancel();
                    const newFilters = updateFilterCondition(
                        columnFilters,
                        columnId,
                        newOperator,
                        dateValue,
                        dateValue2
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
        } else if (value) {
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime())) {
                debouncedFilterChange.cancel();
                const newFilters = updateFilterCondition(
                    columnFilters,
                    columnId,
                    newOperator,
                    dateValue
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
                    type="date"
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                    autoFocus
                />
            )}

            {showValue2Input && (
                <Input
                    type="date"
                    value={value2}
                    onChange={(e) => handleValue2Change(e.target.value)}
                    onKeyDown={handleKeyDown}
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
