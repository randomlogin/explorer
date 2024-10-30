import { writable, derived, get } from 'svelte/store';
import type { Transaction } from '$lib/types/transaction';
// import type { Block } from '$lib/types/block';

type BlockState = {
    currentHeight: string | null;
    header: Block | null;
    transactions: Transaction[];
    txCount: number;
    error: string | null;
    pagination: {
        currentPage: number;
        limit: number;
        offset: number;
    };
    cache: Map<string, {
        header: Block;
        pages: Map<number, Transaction[]>;
    }>;
};

function createBlockStore() {
    const initialState: BlockState = {
        currentHeight: null,
        header: null,
        transactions: [],
        txCount: 0,
        error: null,
        pagination: {
            currentPage: 1,
            limit: 25,
            offset: 0
        },
        cache: new Map()
    };

    const { subscribe, set, update } = writable<BlockState>(initialState);

    return {
        subscribe,
        async fetchBlockData(height: string, page: number = 1, customFetch: typeof fetch = fetch) {
            update(state => ({ ...state, error: null }));
            
            const offset = (page - 1) * initialState.pagination.limit;
            const cacheKey = `${height}`;
            const pageKey = page;

            try {
                // Check cache first
                const cachedBlock = get(this).cache.get(cacheKey);
                let blockHeader = cachedBlock?.header;
                let transactions = cachedBlock?.pages.get(pageKey);

                // Fetch header if not cached
                if (!blockHeader) {
                    const headerResponse = await customFetch(`/api/block/${height}/header`);
                    if (!headerResponse.ok) throw new Error(`Error fetching block header: ${headerResponse.statusText}`);
                    blockHeader = await headerResponse.json();
                }

                // Fetch transactions if not cached
                if (!transactions) {
                    const txsResponse = await customFetch(`/api/block/${height}/txs?offset=${offset}&limit=${initialState.pagination.limit}`);
                    if (!txsResponse.ok) throw new Error(`Error fetching block transactions: ${txsResponse.statusText}`);
                    transactions = await txsResponse.json();
                }

                // Update cache and state
                update(state => {
                    const updatedCache = new Map(state.cache);
                    const blockCache = updatedCache.get(cacheKey) || { header: blockHeader, pages: new Map() };
                    blockCache.pages.set(pageKey, transactions);
                    updatedCache.set(cacheKey, blockCache);

                    return {
                        ...state,
                        currentHeight: height,
                        header: blockHeader,
                        transactions,
                        txCount: blockHeader.tx_count,
                        pagination: {
                            ...state.pagination,
                            currentPage: page,
                            offset
                        },
                        cache: updatedCache
                    };
                });
            } catch (error) {
                update(state => ({
                    ...state,
                    error: error.message
                }));
                throw error;
            }
        },

        clearBlock() {
            set(initialState);
        }
    };
}

export const blockStore = createBlockStore();
export const totalPages = derived(
    blockStore,
    $blockStore => Math.ceil($blockStore.txCount / $blockStore.pagination.limit)
);
