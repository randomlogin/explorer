<script lang="ts">
    import { onMount } from 'svelte';
    import { calculateTimeRemaining, formatBTC } from '$lib/utils/formatters';
    
    export let currentHeight: number;

    interface Rollout {
        name: string;
        winning_bid: string;
        block_height: number;
        expire_height: number | null;
        claim_height: number | null;
    }

    let rollouts: Rollout[] = [];
    let loading = true;
    let error: string | null = null;
    
    async function fetchRollouts() {
        try {
            const response = await fetch('/api/actions/rollout');
            if (!response.ok) throw new Error('Failed to fetch rollouts');
            const data = await response.json();
            rollouts = data.items.map((item: any) => ({
                name: item.name,
                winning_bid: item.winning_bid,
                block_height: item.block_height,
                expire_height: item.expire_height,
                claim_height: item.claim_height
            }));
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to load rollouts';
        } finally {
            loading = false;
        }
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
            <div class="error-card">
                <span class="error-icon">⚠️</span>
                <span class="error-text">{error}</span>
            </div>
        {:else if rollouts.length === 0}
            <div class="empty-card">
                <span class="empty-icon">🎯</span>
                <span class="empty-text">No upcoming rollouts</span>
            </div>
        {:else}
            <div class="rollouts-list">
                {#each rollouts as rollout}
                    {@const releaseHeight = rollout.block_height}
                    <div class="rollout-card">
                        <a href="/space/{rollout.name}" class="space-name">
                            {rollout.name}
                        </a>
                        <div class="bid-amount">
                            Bid: {formatBTC(rollout.winning_bid)} 
                        </div>
                        <div class="time-remaining" title="Based on estimated block time">
                            Available in: {calculateTimeRemaining(releaseHeight+144, currentHeight)}
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
        padding-bottom: var(--space-2);
        scrollbar-width: thin;
        scrollbar-color: var(--border-color) var(--bg-secondary);
    }

    .rollouts-list {
        display: flex;
        gap: var(--space-4);
        padding: var(--space-2);
        min-width: min-content;
    }

    .rollout-card {
        background: var(--bg-surface);
        border: var(--border-width-1) solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        min-width: 240px;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .rollout-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .space-name {
        font-weight: 500;
        color: var(--color-primary);
        text-decoration: none;
        font-size: var(--text-lg);
    }

    .space-name:hover {
        text-decoration: underline;
    }

    .bid-amount {
        color: var(--text-base);
        font-size: var(--text-sm);
        font-weight: 500;
    }

    .time-remaining {
        color: var(--text-muted);
        font-size: var(--text-sm);
        cursor: help;
    }

    /* Empty state */
    .empty-card,
    .error-card {
        width: 100%;
        padding: var(--space-8);
        text-align: center;
        background: var(--bg-surface);
        border-radius: var(--radius-lg);
        color: var(--text-muted);
    }

    .empty-icon,
    .error-icon {
        display: block;
        font-size: var(--text-3xl);
        margin-bottom: var(--space-2);
    }

    .empty-text,
    .error-text {
        font-size: var(--text-lg);
    }

    .error-card {
        background: rgb(254 226 226);
        color: rgb(185 28 28);
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
        border-radius: var(--radius-sm);
    }

    .skeleton-text-short {
        height: 16px;
        width: 120px;
        background: var(--border-color);
        border-radius: var(--radius-sm);
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.4; }
    }

    /* Custom scrollbar */
    .rollouts-container::-webkit-scrollbar {
        height: 6px;
    }

    .rollouts-container::-webkit-scrollbar-track {
        background: var(--bg-surface);
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
