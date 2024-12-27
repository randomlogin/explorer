<script lang="ts">
    import dayjs from 'dayjs';
    import Pagination from '$lib/components/Pagination.svelte';
    import TransactionDetails from '$lib/components/Transaction/TransactionDetails.svelte';
    import TransactionLink from '$lib/components/Transaction/TransactionLink.svelte';
    import BlockLink from '$lib/components/Block/BlockLink.svelte';
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
    export let showTransactionTime: boolean = false;
    
    let showOnlySpaceActions = false;
    
    $: filteredTransactions = showOnlySpaceActions 
        ? transactions.filter(tx => tx.vmetaouts.some(vmetaout => vmetaout)) 
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
            <div class="transaction-header">
                <div class="transaction-info">
                    Transaction 

                {#if transaction.index >= 0}
                    <span class="transaction-number">#{transaction.index}</span>
                {/if}
                    <TransactionLink txid={transaction.txid} />
                </div>
                {#if showTransactionTime}
                    <div class="transaction-time">
                        <BlockLink height={transaction.block.height} />
                        <span class="timestamp">
                            {dayjs.unix(transaction.block.time).format('MMM D, YYYY HH:mm')}
                        </span>
                    </div>
                {/if}
            </div>
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

    .transaction-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
        flex-wrap: wrap;
    }

    .transaction-info {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex-wrap: wrap;
    }

    .transaction-number {
        color: var(--text-muted);
        font-size: var(--font-size-sm);
        white-space: nowrap;
    }

    .transaction-time {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: var(--space-1);
        color: var(--text-muted);
        font-size: var(--font-size-sm);
    }

    .block-link {
        color: var(--color-primary);
        text-decoration: none;
    }

    .block-link:hover {
        text-decoration: underline;
    }

    .timestamp {
        white-space: nowrap;
    }

    @media (max-width: 640px) {
        .transaction-card {
            padding: var(--space-4);
        }

        .transaction-header {
            flex-direction: column;
            gap: var(--space-2);
        }

        .transaction-time {
            align-items: flex-start;
            margin-top: var(--space-2);
        }

        .transaction-info {
            gap: var(--space-2);
        }
    }
</style>
