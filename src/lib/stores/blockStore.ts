import { writable, derived, get } from 'svelte/store';
import type { Block, Transaction } from '$lib/types';

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
        }
    };

    const { subscribe, set, update } = writable<BlockState>(initialState);

    return {
        subscribe,
        async fetchBlockData(height: string, page: number = 1, customFetch: typeof fetch = fetch) {
            // Reset error state
            update(state => ({ ...state, error: null }));

            const offset = (page - 1) * initialState.pagination.limit;

            try {
                // If we're loading a new block or don't have a header
                const needsHeader = height !== get(this).currentHeight;

                let blockHeader = get(this).header;
                if (needsHeader) {
                    const headerResponse = await customFetch(`/api/block/${height}/header`);
                    if (!headerResponse.ok) throw new Error(`Error fetching block header: ${headerResponse.statusText}`);
                    blockHeader = await headerResponse.json();
                }

                // Always fetch transactions for the current page
                const txsResponse = await customFetch(`/api/block/${height}/txs?offset=${offset}&limit=${initialState.pagination.limit}`);
                if (!txsResponse.ok) throw new Error(`Error fetching block transactions: ${txsResponse.statusText}`);
                const transactions = await txsResponse.json();

                update(state => ({
                    ...state,
                    currentHeight: height,
                    header: blockHeader,
                    transactions,
                    txCount: blockHeader.tx_count,
                    pagination: {
                        ...state.pagination,
                        currentPage: page,
                        offset
                    }
                }));
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
