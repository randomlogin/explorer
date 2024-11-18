<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { blockStore, totalPages } from '$lib/stores/blockStore';
    import BlockHeader from '$lib/components/Block/BlockHeader.svelte';
    import BlockTxs from '$lib/components/Block/BlockTxs.svelte';
    import { onDestroy } from 'svelte';

    // Get hash from URL params
    $: hash = $page.params.hash;
    $: currentPage = parseInt($page.url.searchParams.get('page') || '1');

    // Track previous values to prevent unnecessary reloads
    let previousHash: string | null = null;
    let previousPage: number | null = null;

    // Handle initial load and subsequent navigation
    $: if (browser && hash && (hash !== previousHash || currentPage !== previousPage)) {
        loadBlockData();
    }

    async function loadBlockData() {
        try {
            await blockStore.fetchBlockData(hash, currentPage);
            // Update previous values after successful fetch
            previousHash = hash;
            previousPage = currentPage;
        } catch (error) {
            console.error('Failed to load block data:', error);
        }
    }

    async function handlePageChange(newPage: number) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', newPage.toString());
        await goto(url.toString(), { keepFocus: true, replaceState: true });
    }

    // Clear block data when component is destroyed
    onDestroy(() => {
        blockStore.clearBlock();
    });
</script>

{#if $blockStore.error}
    <div class="error">
        Error loading block: {$blockStore.error}
    </div>
{:else if !$blockStore.header}
    <div class="loading">Loading block data...</div>
{:else}
    <section>
        <BlockHeader blockHeader={$blockStore.header} />
    </section>
    <section>
        <BlockTxs
            transactions={$blockStore.transactions}
            pagination={{
                currentPage: $blockStore.pagination.currentPage,
                totalPages: $totalPages,
                offset: $blockStore.pagination.offset,
                limit: $blockStore.pagination.limit
            }}
            onPageChange={handlePageChange}
        />
    </section>
{/if}
