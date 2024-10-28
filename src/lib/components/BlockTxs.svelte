<script lang="ts">
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
    
    let showOnlySpaceActions = false;
    
    $: filteredTransactions = showOnlySpaceActions 
        ? transactions.filter(tx => tx.outputs.some(output => output.space_action))
        : transactions;
</script>

<div class="filter-container mb-4">
    <label class="flex items-center space-x-2 text-sm">
        <input 
            type="checkbox" 
            bind:checked={showOnlySpaceActions} 
            class="form-checkbox h-4 w-4 text-orange-600" 
        />
        <span>Show only transactions with Space Actions</span>
    </label>
</div>

<div class="transactions-container">
    {#each filteredTransactions as transaction}
        <div class="transaction-card">
            <h2 class="transaction-id">
                <span class="transaction-number">#{transaction.index}</span>
                <TransactionLink txid={transaction.txid} />
            </h2>
            <TransactionDetails {transaction} />
        </div>
    {/each}
</div>

{#if pagination.totalPages > 1}
    <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        on:pageChange={async (e) => await onPageChange(e.detail)}
    />
{/if}
