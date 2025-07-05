import { useCallback, useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash';
import type { TableDatasource } from '../types/DataSourceTypes.ts';
import type { SortingState } from '@tanstack/react-table';
import type { ColumnFiltersState } from '@/types/FilterDataTypes.ts';

type CacheBlock<TData> = {
    blockNumber: number;
    startRow: number;
    endRow: number;
    data: TData[];
    lastAccessed: number;
};

type UseInfiniteDataSourceParams<TData> = {
    datasource: TableDatasource<TData>;
    cacheBlockSize?: number;
    maxBlocksInCache?: number;
    cacheOverflowSize?: number;
    defaultSort?: SortingState;
    defaultFilters?: ColumnFiltersState;
};

const DEFAULT_CACHE_BLOCK_SIZE = 100;
const DEFAULT_MAX_BLOCKS_IN_CACHE = 10;
const DEFAULT_CACHE_OVERFLOW_SIZE = 1;

export function useInfiniteDataSource<TData>({
    datasource,
    cacheBlockSize = DEFAULT_CACHE_BLOCK_SIZE,
    maxBlocksInCache = DEFAULT_MAX_BLOCKS_IN_CACHE,
    cacheOverflowSize = DEFAULT_CACHE_OVERFLOW_SIZE,
    defaultSort = [],
    defaultFilters = [],
}: UseInfiniteDataSourceParams<TData>) {
    const [sortModel, setSortModel] = useState<SortingState>(defaultSort);
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>(defaultFilters);
    const [cache, setCache] = useState<Map<number, CacheBlock<TData>>>(
        new Map()
    );
    const [loadingBlocks, setLoadingBlocks] = useState<Set<number>>(new Set());
    const [totalRows, setTotalRows] = useState<number | undefined>(
        datasource.rowCount
    );

    const sortChanged = usePreviousSort(sortModel);
    const filtersChanged = usePreviousFilters(columnFilters);
    const hasDefaultSort = defaultSort.length > 0;
    const hasSorting = sortModel.length > 0;

    const getBlockNumber = useCallback(
        (rowIndex: number) => {
            return Math.floor(rowIndex / cacheBlockSize);
        },
        [cacheBlockSize]
    );

    const evictOldBlocks = useCallback(
        (currentCache: Map<number, CacheBlock<TData>>) => {
            if (currentCache.size <= maxBlocksInCache) return currentCache;

            const sortedBlocks = Array.from(currentCache.values()).sort(
                (a, b) => a.lastAccessed - b.lastAccessed
            );

            const newCache = new Map(currentCache);
            const blocksToRemove = sortedBlocks.slice(
                0,
                currentCache.size - maxBlocksInCache
            );

            blocksToRemove.forEach((block) => {
                newCache.delete(block.blockNumber);
            });

            return newCache;
        },
        [maxBlocksInCache]
    );

    const loadBlock = useCallback(
        (blockNumber: number) => {
            if (loadingBlocks.has(blockNumber)) return;

            setLoadingBlocks((prev) => new Set(prev).add(blockNumber));

            const startRow = blockNumber * cacheBlockSize;
            const endRow = startRow + cacheBlockSize;

            datasource.getRows({
                startRow,
                endRow,
                successCallback: (rowsThisBlock: TData[], lastRow?: number) => {
                    const newBlock: CacheBlock<TData> = {
                        blockNumber,
                        startRow,
                        endRow: endRow - 1,
                        data: rowsThisBlock,
                        lastAccessed: Date.now(),
                    };

                    setCache((currentCache) => {
                        const updatedCache = new Map(currentCache);
                        updatedCache.set(blockNumber, newBlock);
                        return evictOldBlocks(updatedCache);
                    });

                    setLoadingBlocks((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(blockNumber);
                        return newSet;
                    });

                    if (lastRow !== undefined) {
                        setTotalRows(lastRow + 1);
                    }
                },
                failCallback: () => {
                    setLoadingBlocks((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(blockNumber);
                        return newSet;
                    });
                },
                sortModel,
                columnFilters,
            });
        },
        [
            datasource,
            cacheBlockSize,
            loadingBlocks,
            evictOldBlocks,
            sortModel,
            columnFilters,
        ]
    );

    const preloadBlocks = useCallback(
        (startIndex: number, endIndex: number) => {
            const startBlock = getBlockNumber(startIndex);
            const endBlock = getBlockNumber(endIndex);

            const blocksToLoad = [];
            for (
                let blockNum = Math.max(0, startBlock - cacheOverflowSize);
                blockNum <= endBlock + cacheOverflowSize;
                blockNum++
            ) {
                if (!cache.has(blockNum) && !loadingBlocks.has(blockNum)) {
                    blocksToLoad.push(blockNum);
                }
            }

            blocksToLoad.forEach((blockNumber) => {
                loadBlock(blockNumber);
            });
        },
        [cache, getBlockNumber, loadingBlocks, loadBlock, cacheOverflowSize]
    );

    const virtualData = useMemo(() => {
        const arrayLength =
            totalRows ??
            Math.max(
                ...Array.from(cache.values()).map((block) => block.endRow + 1),
                0
            );

        const data: (TData | null)[] = new Array(arrayLength).fill(null);

        cache.forEach((block) => {
            block.data.forEach((row, i) => {
                const rowIndex = block.startRow + i;
                if (rowIndex < data.length) {
                    data[rowIndex] = row;
                }
            });
        });

        return data;
    }, [cache, totalRows]);

    useEffect(() => {
        if (cache.size === 0 && !loadingBlocks.has(0)) {
            loadBlock(0);
        }
    }, [cache.size, loadingBlocks, loadBlock]);

    useEffect(() => {
        if (sortChanged && (hasSorting || hasDefaultSort)) {
            setCache(new Map());
        }
    }, [sortChanged, hasSorting, hasDefaultSort]);

    useEffect(() => {
        if (filtersChanged) {
            setCache(new Map());
            setTotalRows(undefined);
        }
    }, [filtersChanged]);

    return {
        virtualData,
        totalRows,
        preloadBlocks,
        sortModel,
        setSortModel,
        columnFilters,
        setColumnFilters,
    };
}

function usePreviousSort(sortModel: SortingState) {
    const [previousSort, setPreviousSort] = useState<SortingState>([]);
    const sortChanged = !isEqual(sortModel, previousSort);

    useEffect(() => {
        if (sortChanged) {
            setPreviousSort(sortModel);
        }
    }, [sortModel, sortChanged]);

    return sortChanged;
}

function usePreviousFilters(columnFilters: ColumnFiltersState) {
    const [previousFilters, setPreviousFilters] = useState<ColumnFiltersState>(
        []
    );
    const filtersChanged = !isEqual(columnFilters, previousFilters);

    useEffect(() => {
        if (filtersChanged) {
            setPreviousFilters(columnFilters);
        }
    }, [columnFilters, filtersChanged]);

    return filtersChanged;
}
