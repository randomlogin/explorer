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
    <div class="content-section stats-section">
        <Stats />
    </div>
    
    <div class="content-section rollout-section">
        <Rollout currentHeight={currentBlockHeight} />
    </div>
    
    <div class="content-section actions-section">
        <RecentActions />
    </div>
    
    <div class="content-section auctions-section">
        <div class="auctions-header">
            <h1 class="section-title">Spaces in auction</h1>
            <div class="sort-selector">
                <SortSelector on:change={onSortChange} options={sortOptions} />
            </div>
        </div>
        <div class="auctions-grid">
            {#if $navigating}
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Loading spaces...</span>
                </div>
            {:else}
                {#each data.spaces.items as space (space.name)}
                    <SpaceCard {space} {currentBlockHeight} />
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .page-container {
        width: 100%;
        max-width: var(--max-content-width, 1280px);
        margin: 0 auto;
        padding: var(--space-2);
        display: flex;
        flex-direction: column;
        gap: var(--space-8);
    }

    .content-section {
        width: 100%;
    }

    .stats-section {
        margin-bottom: var(--space-4);
    }

    .rollout-section, .actions-section {
        background: var(--bg-elevated);
        border-radius: var(--border-radius-lg);
        padding: var(--space-2);
        box-shadow: var(--shadow-sm);
    }

    .auctions-section {
        position: relative;
        border-top: var(--border-width-1) solid var(--border-color);
        padding-top: var(--space-8);
    }

    .auctions-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-6);
        gap: var(--space-4);
    }

    .section-title {
        font-size: var(--font-size-3xl);
        font-weight: 600;
        color: var(--text-primary);
    }

    .sort-selector {
        width: 160px;
        flex-shrink: 0;
    }

    .auctions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-6);
        align-items: start;
    }

    .loading-state {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-8);
        color: var(--text-muted);
    }

    .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid var(--border-color);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 640px) {
        .page-container {
            padding: var(--space-3);
            gap: var(--space-6);
        }

        .auctions-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .sort-selector {
            width: 100%;
        }

        .auctions-grid {
            gap: var(--space-4);
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }

        .section-title {
            font-size: var(--font-size-2xl);
        }
    }
</style>
