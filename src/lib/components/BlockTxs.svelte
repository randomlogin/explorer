<script lang="ts">
    import Pagination from '$lib/components/Pagination.svelte';
    import TransactionDetails from '$lib/components/TransactionDetails.svelte';
    import TransactionLink from '$lib/components/TransactionLink.svelte';
    import './BlockTxs.css';

    export let blockTxs = []; 
    export let offset = 0; 
    export let tx_count = 0; 
    export let txsPerPage = 15; 
    export let currentPage = 1; 
    export let onPageChange; 
</script>

<div class="transactions-container">
    {#each blockTxs as tx, tx_index}
    <div class="transaction-card">
        <h2 class="transaction-id">
            <span class="transaction-id-link">
                Transaction #{tx_index+offset} <TransactionLink txid={tx.txid} />
            </span>
        </h2>
        <TransactionDetails transaction={tx} />
    </div>
    {/each}
</div>
<Pagination {currentPage} {tx_count} {txsPerPage} on:pageChange={onPageChange} />
