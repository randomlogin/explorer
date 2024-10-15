<script lang="ts">
    import Pagination from '$lib/components/Pagination.svelte';
    import TransactionDetails from '$lib/components/TransactionDetails.svelte';
    export let blockTxs = []; 
    export let offset = 0; 
    export let tx_count = 0; 
    export let txsPerPage = 15; 
    export let currentPage = 1; 
    export let onPageChange; 
</script>

<div class="flex flex-col gap-10">
    {#each blockTxs as tx, tx_index}
        <TransactionDetails transaction={tx} />
    {/each}
</div>
<Pagination {currentPage} {tx_count} {txsPerPage} on:pageChange={onPageChange} />
