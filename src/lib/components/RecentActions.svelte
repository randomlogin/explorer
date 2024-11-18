<script lang="ts">
    import { onMount } from 'svelte';
    import dayjs from 'dayjs';
    import TransactionLink from '$lib/components/Transaction/TransactionLink.svelte';
    import { formatBTC } from '$lib/utils/formatters';

    interface RecentAction {
        action: 'RESERVE' | 'BID' | 'TRANSFER' | 'ROLLOUT' | 'REVOKE';
        name: string;
        txid: string;
        height: number;
        time: number;
        total_burned?: string;
        reason?: string;
    }

    let actions: RecentAction[] = [];
    let loading = true;
    let error: string | null = null;

    function getActionColor(action: string): string {
        switch (action) {
            case 'RESERVE': return 'text-blue-500';
            case 'BID': return 'text-green-500';
            case 'TRANSFER': return 'text-purple-500';
            case 'ROLLOUT': return 'text-yellow-500';
            case 'REVOKE': return 'text-red-500';
            default: return 'text-gray-500';
        }
    }

    async function fetchRecentActions() {
        try {
            const response = await fetch('/api/auctions/recent');
            if (!response.ok) throw new Error('Failed to fetch recent actions');
            actions = await response.json();
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

<section class="recent-actions">
    <h2 class="section-title">Recent Spaces Actions</h2>

    {#if loading}
        <div class="actions-container">
            <div class="actions-grid">
                {#each Array(4) as _}
                    <div class="action-card skeleton-card">
                        <div class="skeleton-text-medium" />
                        <div class="action-meta">
                            <div class="meta-item">
                                <div class="skeleton-text-short" />
                            </div>
                            <div class="meta-item">
                                <div class="skeleton-text-short" />
                            </div>
                            <div class="meta-item">
                                <div class="skeleton-text-short" />
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else if error}
        <div class="error-card">
            <span class="error-icon">⚠️</span>
            <span class="error-text">{error}</span>
        </div>
    {:else}
        <div class="actions-container">
            <div class="actions-grid">
                {#each actions as action}
                    <div class="action-card">
                        <div class="action-header">
                            <div class="action-main">
                                <span class={getActionColor(action.action)}>{action.action}</span>
                                <a href="/space/{action.name}" class="space-name">{action.name}</a>
                            </div>
                            {#if action.action === 'BID' && action.total_burned}
                                <div class="bid-value">
                                    {formatBTC(action.total_burned)}
                                </div>
                            {/if}
                        </div>
                        {#if action.reason}
                            <div class="revoke-reason">
                                Reason: {action.reason}
                            </div>
                        {/if}

                        <div class="action-meta">
                            <div class="meta-item">
                                <span class="meta-label">Block</span>
                                <a href="/block/{action.height}" class="meta-value">
                                    #{action.height}
                                </a>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Tx</span>
                                <TransactionLink txid={action.txid} truncate={true} maxLength={6} />
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Time</span>
                                <span class="meta-value">
                                    {dayjs.unix(action.time).format('DD MMM HH:mm')}
                                </span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</section>

<style>
    .recent-actions {
        width: 100%;
        padding: var(--space-2);
    }

    .section-title {
        font-size: var(--text-2xl);
        font-weight: 600;
        margin-bottom: var(--space-4);
    }

    .actions-container {
        display: flex;
        justify-content: start;
        width: 100%;
    }

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 280px);
        gap: var(--space-4);
        max-width: 100%;
    }

    .action-card {
        background: var(--bg-surface);
        border: var(--border-width-1) solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--space-2);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .action-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-3);
    }

    .action-main {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-weight: 500;
    }

    .space-name {
        color: var(--color-primary);
        text-decoration: none;
        font-size: var(--text-base);
    }

    .space-name:hover {
        text-decoration: underline;
    }

    .bid-value {
        font-weight: 500;
        color: var(--text-primary);
    }

    .revoke-reason {
        font-size: var(--text-sm);
        color: var(--color-error);
        margin-bottom: var(--space-3);
    }

    .action-meta {
        display: flex;
        gap: var(--space-4);
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .meta-label {
        font-size: var(--text-xs);
        color: var(--text-muted);
    }

    .meta-value {
        font-size: var(--text-sm);
        color: var(--text-primary);
        text-decoration: none;
    }

    .meta-value:hover {
        color: var(--color-primary);
    }

    /* Skeleton styles */
    .skeleton-card {
        opacity: 0.7;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-text-medium {
        height: 24px;
        width: 60%;
        background: var(--border-color);
        border-radius: var(--radius-sm);
        margin-bottom: var(--space-4);
    }

    .skeleton-text-short {
        height: 16px;
        width: 80px;
        background: var(--border-color);
        border-radius: var(--radius-sm);
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.4; }
    }

    .error-card {
        padding: var(--space-2);
        background: rgb(254 226 226);
        border-radius: var(--radius-lg);
        color: rgb(185 28 28);
        text-align: center;
    }

    .error-icon {
        margin-right: var(--space-2);
    }

    @media (max-width: 640px) {
        .actions-grid {
            grid-template-columns: 1fr;
            width: 100%;
        }
        
        .action-card {
            width: 100%;
        }

        .action-meta {
            gap: var(--space-2);
        }
    }
</style>
