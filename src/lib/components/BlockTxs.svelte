<script lang="ts">
    import dayjs from 'dayjs';
    import Pagination from './Pagination.svelte';
    import TransactionDetails from '$lib/components/TransactionDetails.svelte';
    import TransactionLink from '$lib/components/TransactionLink.svelte';
    import TransactionSpaces from '$lib/components/TransactionSpaces.svelte';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    dayjs.extend(LocalizedFormat);

    interface PaginationInfo {
        currentPage: number;
        totalPages: number;
        offset: number;
        limit: number;
    }

    export let transactions: Transaction[];
    export let pagination: PaginationInfo;
    export let onPageChange: (page: number) => Promise<void>;
    export let showTransactionTime: bool = false;
    
    let showOnlySpaceActions = false;
    
    $: filteredTransactions = showOnlySpaceActions 
        ? transactions.filter(tx => tx.outputs.some(output => output.space_action))
        : transactions;
</script>

<div class="filter-container mb-4">
    <label class="flex items-center space-x-2 text-sm">
        <input type="checkbox" bind:checked={showOnlySpaceActions} class="form-checkbox h-4 w-4 text-orange-600" />
        <span>Show only transactions with Space Actions</span>
    </label>
</div>

<div class="transactions-container">
    {#each filteredTransactions as transaction}
        <div class="transaction-card">
            <h2 class="transaction-id">
                <span class="transaction-number">Tx #{transaction.index}</span>
                <TransactionLink txid={transaction.txid} />
                {#if showTransactionTime}
                    <span class="transaction-time">
                        <a href={`/block/${transaction.block.height}`} class="block-link">
                                <span class="detail-value">Block {transaction.block.height}</span>
                        </a>

                        {dayjs.unix(transaction.block.time).format('MMM D, YYYY HH:mm ')}
                    </span>
                {/if}
            </h2>
            <TransactionDetails {transaction} />
        </div>
    {/each}
</div>

{#if pagination.totalPages > 1}
    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} on:pageChange={async (e) => await onPageChange(e.detail)} />
{/if}
<style>
@import '$lib/styles/variables.css';

.transactions-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding: var(--space-4);
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  transition: var(--transition-colors);
}

.transaction-card {
  background: var(--bg-secondary);
  border: var(--border-width-1) solid var(--border-color);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  color: var(--text-primary);
  position: relative;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
}

.transaction-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
}

.transaction-time {
    color: var(--text-muted);
    font-size: 0.9em;
    white-space: nowrap;
    float:right;
}
</style>
