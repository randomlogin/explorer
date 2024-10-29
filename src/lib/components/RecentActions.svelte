<script lang="ts">
    import { onMount } from 'svelte';
    import dayjs from 'dayjs';
    /* import type { RecentSpaceAction } from '$lib/types/recentSpaceActions'; */
    import TransactionLink from '$lib/components/TransactionLink.svelte';
    import AddressLink from '$lib/components/AddressLink.svelte';
    import { formatBTC } from '$lib/utils/formatters';

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
                                        <span class="bid-value">{formatBTC(action.value)}</span>
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
<style>
.recent-actions-container {
  padding: var(--space-4);
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
}

.recent-actions-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.action-card {
  background: var(--bg-secondary);
  border: var(--border-width-1) solid var(--border-color);
  border-radius: var(--border-radius-xl);
  padding: var(--space-4);
}

.space-action-name {
  font-weight: 500;
  color: inherit;
  text-decoration: none;
}

.space-action-name:hover {
  text-decoration: underline;
}

.action-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
}


.block-link {
  color: var(--text-muted);
  text-decoration: none;
}

.block-link:hover {
  color: var(--color-primary);
}


.error {
  color: var(--color-error);
}

.recent-actions-container {
  width: 100%;
  padding: var(--space-4);
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
}

@media (max-width: 768px) {
  .recent-actions-container {
    max-width: 100%;
  }
}


.action-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);  /* Increased gap between items */
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: var(--space-3);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;  /* Stack label above value */
  gap: var(--space-1);
}

.meta-label {
  color: var(--text-muted);
  font-size: var(--text-xs);
}

.meta-value {
  color: var(--text-primary);
}

.block-link {
  text-decoration: none;
  color: var(--text-muted);
}

.block-link:hover {
  color: var(--color-primary);
}

.space-action-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-0_5); /* Reduced from space-1 */
  padding: 0; /* Removed padding */
  margin-bottom: var(--space-2); /* Reduced from space-3 */
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm); /* Made text smaller */
  color: var(--text-muted); /* Made the "Spaces action:" text more subtle */
}

.space-action-name {
  font-weight: 500;
  text-decoration: none;
  font-size: var(--text-base); /* Kept name size prominent */
  color: var(--text-primary);
}

.space-action-name:hover {
  text-decoration: underline;
}

.bid-value {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-primary);
}

.action-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: var(--space-2); /* Reduced from space-3 */
  flex-wrap: wrap;
}
</style>
