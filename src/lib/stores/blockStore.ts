// import { get, writable } from 'svelte/store';
// import { browser } from '$app/environment';
// import { goto, pushState } from '$app/navigation';
//
// const { subscribe, set, update } = writable({
//     // blockHeader: { tx_count: 0 },
//     blockHeader: null,
//     blockTransactions: [],
//     blockHeaderError: null,
//     blockTransactionsError: null,
//     offset: 0,
//     page: 1,
//     txCount: 0,
//     txsPerPage: browser ? (localStorage.transactionsPerPage ?? 25) : 25,
// });
//
// export const blockStore = {
//     subscribe,
//     set,
//     update,
//
//     async fetchBlockHeader(identifier: string | number) {
//         try {
//             const headerResponse = await fetch(`/api/block/${identifier}/header`);
//             if (!headerResponse.ok) throw new Error(`Error fetching block header: ${headerResponse.statusText}`);
//             const blockHeader = await headerResponse.json();
//
//             update(store => ({
//                 ...store,
//                 blockHeader,
//                 blockHeaderError: null,
//                 txCount: blockHeader.tx_count,
//                 page: 1,
//                 offset: 0,  // Reset offset when fetching a new block
//             }));
//
//             return blockHeader;
//         } catch (error) {
//             console.error('Error fetching block header:', error);
//             update(store => ({
//                 ...store,
//                 blockHeaderError: error.message
//             }));
//             return { error };
//         }
//     },
//
//     async fetchBlockTransactions(identifier: string | number, offset: number = 0, limit: number = 25) {
//         try {
//             const txsResponse = await fetch(`/api/block/${identifier}/txs?offset=${offset}&limit=${limit}`);
//             if (!txsResponse.ok) throw new Error(`Error fetching block transactions: ${txsResponse.statusText}`);
//             const blockTxs = await txsResponse.json();
//
//             update(store => ({
//                 ...store,
//                 blockTransactions: blockTxs,
//                 offset,
//                 blockTransactionsError: null
//             }));
//
//             return blockTxs;
//         } catch (error) {
//             console.error('Error fetching block transactions:', error);
//             update(store => ({
//                 ...store,
//                 blockTransactionsError: error.message
//             }));
//             return { error };
//         }
//     },
//
//     async fetchBlockData(identifier: string | number, offset: number = 0, limit: number = 25) {
//         const headerPromise = this.fetchBlockHeader(identifier);
//         const txsPromise = this.fetchBlockTransactions(identifier, offset, limit);
//
//         await Promise.all([headerPromise, txsPromise]);
//     },
//
//     handlePageChange: (event) => {
//         const store = get(blockStore);
//         const oldPage = store.page
//         const newPage = event.detail;
//         const offset = (newPage - 1) * store.txsPerPage;
//         
//         update(store => ({...store, page: newPage, offset: offset}));
//         
//         if (browser) {
//             const url = new URL(window.location.href);
//             url.searchParams.set('page', newPage.toString());
//             pushState('', `?page=${oldPage}`);
//             goto(url.toString());
//         }
//         
//         const identifier = store.blockHeader.height || store.blockHeader.hash;
//         blockStore.fetchBlockTransactions(identifier, offset, store.txsPerPage);
//     }
// };
//
//
import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
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
