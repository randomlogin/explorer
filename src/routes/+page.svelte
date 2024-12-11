<script lang="ts">
    import SpaceCard from "$lib/components/Spaces/SpaceCard.svelte";
    import RecentActions from "$lib/components/RecentActions.svelte";
    import Rollout from '$lib/components/Rollout.svelte';
    import EmptyState from '$lib/components/layout/EmptyState.svelte';
    import Stats from '$lib/components/Stats.svelte';
    import { navigating } from '$app/stores';
    import '$lib/styles/mainpage.css';
    
    export let data;
    let currentBlockHeight = data.stats.latest_block_height;
</script>

<div class="page-container">
    <div class="content-section stats-section">
        <Stats />
    </div>
    
    
    <div class="content-section auctions-section">
        <div class="auctions-header">
            <a href="/auctions/current" class="section-title-link">
                <h1 class="section-title"> Spaces in auction </h1>
            </a>
        </div>
        <div class="auctions-grid">
            {#if $navigating}
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>Loading spaces...</span>
                </div>
            {:else if data.spaces.items.length === 0}
                <EmptyState message="No auctions found" />
            {:else}
                {#each data.spaces.items.slice(0,9) as space (space.name)}
                    <div class="card-wrapper">
                        <SpaceCard {space} {currentBlockHeight} active=true/>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <div class="content-section actions-section">
            <a href="/actions" class="section-title-link">
                <h1 class="section-title"> Recent Spaces Actions </h1>
            </a>
            <RecentActions title={false} />
    </div>

    <div class="content-section rollout-section">
        <Rollout currentHeight={currentBlockHeight} itemsPerPage={10} />
    </div>
</div>

<style>
    .page-container {
        width: 100%;
        max-width: var(--max-content-width, 1280px);
        margin: 0 auto;
        padding: var(--space-4);
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
        padding: var(--space-4);
        box-shadow: var(--shadow-sm);
    }

    .auctions-section {
        position: relative;
        border-top: var(--border-width-1) solid var(--border-color);
        padding-top: var(--space-8);
        padding: var(--space-4);
    }

    .auctions-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-8);
        gap: var(--space-4);
    }

    .section-title-link {
        text-decoration: underline;
        color: var(--text-primary);
        transition: color 0.2s ease;
    }

    .section-title-link:hover {
        color: var(--color-primary);
    }

    .section-title {
        font-size: var(--text-2xl);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--space-4);
    }

    .auctions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-6);
        align-items: start;
    }

    .card-wrapper {
        min-height: 220px;
        width: 100%;
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
            margin-bottom: var(--space-6);
        }

        .auctions-grid {
            gap: var(--space-4);
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        .section-title {
            font-size: var(--font-size-2xl);
        }

    }

</style>
