<script lang="ts">
    import { onMount } from 'svelte';
    import dayjs from 'dayjs';
    /* import type { RecentSpaceAction } from '$lib/types/recentSpaceActions'; */
    import TransactionLink from '$lib/components/TransactionLink.svelte';
    import AddressLink from '$lib/components/AddressLink.svelte';
    import { formatBTC } from '$lib/utils/formatters';
    import '$lib/styles/RecentActions.css';

    let actions: RecentSpaceAction[] = [];
    let loading = true;
    let error: string | null = null;

    function formatValue(value: number): string {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)}M sats`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(2)}K sats`;
        }
        return `${value} sats`;
    }

    async function fetchRecentActions() {
        try {
            const response = await fetch('/api/actions/recent');
            if (!response.ok) throw new Error('Failed to fetch recent actions');
            const data = await response.json();
            actions = data.actions;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to load recent actions';
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        fetchRecentActions();
    });
</script>

<div class="recent-actions-wrapper">
    <div class="recent-actions-container">
        <h2 class="recent-actions-title">Recent Space Actions</h2>

        <div class="actions-container">
            {#if loading}
                <div class="actions-list">
                    {#each Array(5) as _}
                        <div class="action-card skeleton-card">
                            <div class="space-action-details">
                                <div class="action-header">
                                    <div class="skeleton-text-short"></div>
                                </div>
                                <div class="skeleton-text-medium"></div>
                            </div>
                            <div class="action-meta">
                                <div class="meta-item">
                                    <div class="skeleton-text-tiny"></div>
                                    <div class="skeleton-text-short"></div>
                                </div>
                                <div class="meta-item">
                                    <div class="skeleton-text-tiny"></div>
                                    <div class="skeleton-text-short"></div>
                                </div>
                                <div class="meta-item">
                                    <div class="skeleton-text-tiny"></div>
                                    <div class="skeleton-text-short"></div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else if error}
                <div class="error">{error}</div>
            {:else}
                <div class="actions-list">
                    <div class="actions-list">
                        {#each actions as action}
                            <div class="action-card">
                                <div class="space-action-details">
                                    <span>{action.type} <a href="/spaces/{action.name}" class="space-action-name"> {action.name} </a> </span>
                                    {#if action.value}
                                        <span>{formatBTC(action.value)}</span>
                                    {/if}
                                </div>
                                <div class="action-meta">
                                    <div class="action-meta">
                                        <div class="meta-item">
                                            <span class="meta-label">Block</span>
                                            <a href="/block/{action.block.height}" class="meta-value block-link">
                                                #{action.block.height}
                                            </a>
                                        </div>
                                        <div class="meta-item">
                                            <span class="meta-label">Tx</span>
                                            <TransactionLink txid={action.transaction.txid} outputIndex={action.transaction.output_index} truncate={true} maxLength={8} />
                                        </div>
                                        <div class="meta-item">
                                            <span class="meta-label">Time</span>
                                            <span class="meta-value">
                                                {dayjs.unix(action.block.time).format('HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

