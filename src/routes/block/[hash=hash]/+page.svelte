<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores'; // Importing the page store to access URL params
    import { pushState } from '$app/navigation';
    import Block from '$lib/components/Block.svelte';
    import BlockTxs from '$lib/components/BlockTxs.svelte';

    let blockHeader = null;
    let blockTxs = [];   
    let errorHeader = null;
    let errorTxs = null;  

    let txsPerPage = 25;    // Number of transactions per page
    let tx_count = 0;       // Total transaction count

    const query = $page.url.searchParams; 
    let currentPage = parseInt(query.get('page')) || 1;
    let offset = (currentPage - 1) * txsPerPage;

    const hash = $page.params.hash;
    async function fetchData() {
        try {
            const headerResponse = await fetch(`/api/block/${hash}/header`);
            if (!headerResponse.ok) throw new Error(`Error fetching block header: ${headerResponse.statusText}`);
            blockHeader = await headerResponse.json();
            tx_count = blockHeader.tx_count;
        } catch (error) {
            errorHeader = error.message; // Capture any errors
        }

        try {
            const txsResponse = await fetch(`/api/block/${hash}/txs?offset=${offset}&limit=${txsPerPage}`);
            if (!txsResponse.ok) throw new Error(`Error fetching block transactions: ${txsResponse.statusText}`);
            blockTxs = await txsResponse.json(); 
        } catch (error) {
            errorTxs = error.message; 
        }
    }

    function handlePageChange(event) {
        const newPage = event.detail; 
        currentPage = newPage; // Update currentPage
        offset = (currentPage - 1) * txsPerPage;
        pushState(`?page=${currentPage}`);
        fetchData(); 
    }

    onMount(fetchData);
</script>

<section>
    {#if blockHeader}
        <Block {blockHeader} />
    {:else if errorHeader}
        <p>Error loading block header: {errorHeader}</p>
    {:else}
        <p>Loading Block Header...</p>
    {/if}
</section>

<section>
    {#if blockTxs.length > 0}
        <BlockTxs {blockTxs} {offset} currentPage={currentPage} {tx_count} {txsPerPage} onPageChange={handlePageChange} />
    {:else if errorTxs}
        <p>Error loading block transactions: {errorTxs}</p>
    {:else}
        <p>Loading Block Transactions...</p>
    {/if}
</section>


