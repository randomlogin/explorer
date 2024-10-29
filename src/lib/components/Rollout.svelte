<script lang="ts">
    import { onMount } from 'svelte';
    import { numberFormatter, calculateTimeRemaining, formatBTC } from '$lib/utils/formatters';
    
    export let currentHeight: number;
    /* export let rollouts: Rollout[] = []; */
    let rollouts = []
    let loading = false;
    let error: string | null = null;
    
    async function fetchRollouts() {
        try {
            const response = await fetch('/api/actions/rollout');
            if (!response.ok) throw new Error('Failed to fetch rollouts');
            rollouts = await response.json();
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to load rollouts';
        } finally {
            loading = false;
        }
        console.log(rollouts)
        console.log(calculateTimeRemaining(rollouts[0].releaseHeight, 1233))
    }

    onMount(() => {
        fetchRollouts();
    });
</script>

<div class="rollouts-wrapper">
    <h2 class="rollouts-title">Upcoming Rollouts</h2>
    
    <div class="rollouts-container">
        {#if loading}
            <div class="rollouts-list">
                {#each Array(4) as _}
                    <div class="rollout-card skeleton-card">
                        <div class="skeleton-text-medium"></div>
                        <div class="skeleton-text-short"></div>
                        <div class="skeleton-text-short"></div>
                    </div>
                {/each}
            </div>
        {:else if error}
            <div class="error">{error}</div>
        {:else}
            <div class="rollouts-list">
                {#each rollouts as rollout}
                    <div class="rollout-card">
                        <a href="/spaces/{rollout.name}" class="space-name">
                            {rollout.name}
                        </a>
                        <div class="bid-amount">
                          Bid  {formatBTC(rollout.bid)}
                        </div>
                        <div class="time-remaining">
                          In  {calculateTimeRemaining(rollout.releaseHeight, currentHeight)}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
<style>
    .rollouts-wrapper {
        width: 100%;
        padding: var(--space-4);
    }

    .rollouts-title {
        font-size: var(--text-2xl);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--space-4);
    }

    .rollouts-container {
        width: 100%;
        overflow-x: auto;
        padding-bottom: var(--space-2); /* Space for scrollbar */
    }

    .rollouts-list {
        display: flex;
        gap: var(--space-4);
        padding: var(--space-2);
        min-width: min-content; /* Prevent cards from shrinking */
    }

    .rollout-card {
        background: var(--bg-secondary);
        border: var(--border-width-1) solid var(--border-color);
        border-radius: var(--border-radius-lg);
        padding: var(--space-4);
        min-width: 240px;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .space-name {
        font-weight: 500;
        color: var(--text-primary);
        text-decoration: none;
        font-size: var(--text-lg);
    }

    .space-name:hover {
        text-decoration: underline;
    }

    .bid-amount {
        color: var(--text-muted);
        font-size: var(--text-sm);
    }

    .time-remaining {
        color: var(--text-muted);
        font-size: var(--text-sm);
    }

    /* Skeleton styles */
    .skeleton-card {
        opacity: 0.7;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-text-medium {
        height: 20px;
        width: 160px;
        background: var(--border-color);
        border-radius: var(--border-radius-sm);
    }

    .skeleton-text-short {
        height: 16px;
        width: 120px;
        background: var(--border-color);
        border-radius: var(--border-radius-sm);
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }

    /* Custom scrollbar */
    .rollouts-container::-webkit-scrollbar {
        height: 6px;
    }

    .rollouts-container::-webkit-scrollbar-track {
        background: var(--bg-secondary);
        border-radius: 3px;
    }

    .rollouts-container::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 3px;
    }

    .rollouts-container::-webkit-scrollbar-thumb:hover {
        background: var(--border-hover);
    }
</style>
