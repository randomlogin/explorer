<script lang="ts">
    import { blockStore, totalPages } from '$lib/stores/blockStore';
    import Pagination from './Pagination.svelte';
    import TransactionDetails from '$lib/components/TransactionDetails.svelte';
    import TransactionLink from '$lib/components/TransactionLink.svelte';
    import '$lib/styles/BlockTxs.css';

    interface PaginationInfo {
        currentPage: number;
        totalPages: number;
        offset: number;
        limit: number;
    }

    export let transactions: Transaction[];
    export let pagination: PaginationInfo;
    export let onPageChange: (page: number) => Promise<void>;
    
    $: currentPage = $blockStore.pagination.currentPage;
    $: offset = $blockStore.pagination.offset;
</script>

<div class="transactions-container">
    {#each transactions as transaction, index}
        <div class="transaction-card">
            <h2 class="transaction-id">
                <span class="transaction-number">#{offset + index + 1}</span>
                <TransactionLink txid={transaction.txid} />
            </h2>
            <TransactionDetails {transaction} />
        </div>
    {/each}
</div>

{#if $totalPages > 1}
    <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        on:pageChange={async (e) => await onPageChange(e.detail)}
    />
{/if}
