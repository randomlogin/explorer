
import { writable } from 'svelte/store';
import { fetchBlockData } from '$routes/block/fetchBlockData';

export const blockStore = writable({
    blockHeader: null,
    blockTransactions: [],
    blockHeaderError: null,
    blockTransactionsError: null,
    fetchBlockData: fetchBlockData,
    offset: 0,
    page: 1,
});
