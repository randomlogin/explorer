<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores'; // Importing the page store to access URL params
    import BlockHeader from '$lib/components/BlockHeader.svelte';
    import BlockTxs from '$lib/components/BlockTxs.svelte';
    import { blockStore } from '$lib/stores/blockStore'; // Adjust the path as necessary




    $: blockHeader = $blockStore.blockHeader
    $: errorHeader = $blockStore.blockHeaderError
    $: blockTxs = $blockStore.blockTransactions
    $: errorTxs = $blockStore.blockTransactionsError
        

    onMount(() => {
        const pageFromUrl = parseInt($page.url.searchParams.get('page') || '1');
        const offset = (pageFromUrl - 1) * $blockStore.txsPerPage;
        blockStore.update(store => ({ ...store, page: pageFromUrl, offset }));
        blockStore.fetchBlockData($page.params.height, offset, $blockStore.txsPerPage);
    });
</script>

<section>
    {#if blockHeader}
        <BlockHeader {blockHeader} />
    {:else if errorHeader}
        <p>Error loading block header: {errorHeader}</p>
    {:else}
        <p>Loading Block Header...</p>
    {/if}
</section>

<section>
    {#if blockTxs.length > 0}
        <BlockTxs />
    {:else if errorTxs}
        <p>Error loading block transactions: {errorTxs}</p>
    {:else}
        <p>Loading Block Transactions...</p>
    {/if}
</section>

