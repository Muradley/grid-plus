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
import { cn } from '@/lib/utils';

interface EnumFilterProps {
    columnId: string;
    columnFilters: ColumnFiltersState;
    onFiltersChange?: (filters: ColumnFiltersState) => void;
    onClose: () => void;
    enumValues: string[];
}

export function EnumFilter({
    columnId,
    columnFilters,
    onFiltersChange,
    onClose,
    enumValues,
}: EnumFilterProps) {
    const currentFilter = getFilterCondition(columnFilters, columnId);

    const [operator, setOperator] = useState<FilterOperator>(
        currentFilter?.operator || 'equals'
    );
    const [selectedValues, setSelectedValues] = useState<string[]>(() => {
        if (currentFilter?.value) {
            return Array.isArray(currentFilter.value)
                ? currentFilter.value
                : [currentFilter.value.toString()];
        }
        return [];
    });

    const availableOperators = OPERATORS_BY_TYPE.enum;

    const clearFilter = () => {
        setSelectedValues([]);
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
        } else if (selectedValues.length > 0) {
            const filterValue = ['oneOf', 'notOneOf'].includes(newOperator)
                ? selectedValues
                : selectedValues[0];
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                newOperator,
                filterValue
            );
            onFiltersChange?.(newFilters);
        } else {
            const newFilters = removeFilterCondition(columnFilters, columnId);
            onFiltersChange?.(newFilters);
        }
    };

    const handleValueToggle = (enumValue: string, checked: boolean) => {
        let newSelectedValues: string[];

        if (isMultiSelect) {
            newSelectedValues = checked
                ? [...selectedValues, enumValue]
                : selectedValues.filter((v) => v !== enumValue);
        } else {
            newSelectedValues = checked ? [enumValue] : [];
        }

        setSelectedValues(newSelectedValues);

        if (operator === 'isEmpty' || operator === 'isNotEmpty') {
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                operator,
                null
            );
            onFiltersChange?.(newFilters);
        } else if (newSelectedValues.length > 0) {
            const filterValue = isMultiSelect
                ? newSelectedValues
                : newSelectedValues[0];
            const newFilters = updateFilterCondition(
                columnFilters,
                columnId,
                operator,
                filterValue
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
    const isMultiSelect = ['oneOf', 'notOneOf'].includes(operator);

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
                <div className="space-y-1 max-h-56 overflow-y-auto">
                    {enumValues.map((enumValue) => {
                        const isSelected = selectedValues.includes(enumValue);

                        const isDisabled =
                            !isMultiSelect &&
                            selectedValues.length > 0 &&
                            !isSelected;

                        return (
                            <div
                                key={enumValue}
                                className={cn(
                                    'flex items-center space-x-2',
                                    isDisabled
                                        ? 'cursor-default'
                                        : 'cursor-pointer'
                                )}
                                onClick={() => {
                                    if (!isDisabled) {
                                        handleValueToggle(
                                            enumValue,
                                            !isSelected
                                        );
                                    }
                                }}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onKeyDown={handleKeyDown}
                                    disabled={isDisabled}
                                    className={cn(
                                        'w-4 h-4 p-0 rounded-[3px] relative',
                                        isSelected
                                            ? 'bg-primary border-primary hover:bg-primary hover:border-primary'
                                            : 'hover:bg-background hover:border-input',

                                        isDisabled
                                            ? 'cursor-default'
                                            : 'cursor-pointer'
                                    )}
                                >
                                    {isSelected && (
                                        <span className="text-xs text-primary-foreground font-light">
                                            ✓
                                        </span>
                                    )}
                                </Button>
                                <span
                                    className={cn(
                                        isDisabled && 'text-muted-foreground'
                                    )}
                                >
                                    {enumValue}
                                </span>
                            </div>
                        );
                    })}
                </div>
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
