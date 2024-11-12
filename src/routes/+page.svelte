<script lang="ts">
    import SpaceCard from "$lib/components/SpaceCard.svelte";
    import SortSelector from "$lib/components/SortSelector.svelte";
    import RecentActions from "$lib/components/RecentActions.svelte";
    import Rollout from '$lib/components/Rollout.svelte';
    import Stats from '$lib/components/Stats.svelte';
    import { goto } from '$app/navigation';
    import { navigating } from '$app/stores';
    import '$lib/styles/mainpage.css';
    
    export let data;
    let currentBlockHeight = data.stats.latest_block_height;
    $: console.log('data', data)
    let sortOptions = [
        { name: "Ending soonest", key: "ending", direction: "asc" }, 
        { name: "Highest price", key: "price", direction: "desc" }, 
        { name: "Lowest price", key: "price", direction: "asc" }, 
    ];

    function onSortChange(sortBy: any) {
        const { key, direction } = sortBy.detail;
        let query = new URLSearchParams();
        query.set('sort', key);
        query.set('direction', direction);
        goto(`?${query.toString()}`);
    }
</script>

<div class="page-container">
    <Stats />
    
    <div class="content-section">
        <Rollout currentHeight={currentBlockHeight} />
    </div>
    
    <div class="content-section">
        <RecentActions />
    </div>
    
    <div class="content-section auctions-section">
        <div class="auctions-header">
            <h1 class="text-3xl font-semibold">Spaces in auction</h1>
            <div class="w-[160px]">
                <SortSelector on:change={onSortChange} options={sortOptions} />
            </div>
        </div>
        <div class="auctions-grid">
            {#if $navigating}
                <div class="loading">Loading...</div>
            {:else}
            {/if}
        </div>
    </div>
</div>

<style>
    .page-container {
        width: 100%;
        max-width: var(--max-content-width, 1280px);
        margin: 0 auto;
        padding: var(--space-4);
    }

    .content-section {
        margin-bottom: var(--space-8);
    }

    .content-section:last-child {
        margin-bottom: 0;
    }

    .auctions-section {
        border-top: var(--border-width-1) solid var(--border-color);
        padding-top: var(--space-8);
    }

    .auctions-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-6);
    }

    .auctions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
    }

    .loading {
        width: 100%;
        text-align: center;
        padding: var(--space-8);
        color: var(--text-muted);
    }

    @media (max-width: 640px) {
        .auctions-header {
            flex-direction: column;
            gap: var(--space-4);
            align-items: flex-start;
        }
    }
</style>
