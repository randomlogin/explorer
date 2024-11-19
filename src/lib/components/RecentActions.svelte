<script lang="ts">
    import { onMount } from 'svelte';
    import dayjs from 'dayjs';
    import TransactionLink from '$lib/components/Transaction/TransactionLink.svelte';
    import { formatBTC } from '$lib/utils/formatters';
    import EmptyState from '$lib/components/layout/EmptyState.svelte';

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
    {:else if actions.length == 0}
        <EmptyState message="No recent actions found" />
    {:else}
        <div class="actions-container">
            <div class="actions-grid">
                {#each actions.slice(0,9) as action}
                    <div class="action-card">
                        <div class="action-header">
                            <div class="action-main">
                                <span class="action-badge {getActionColor(action.action)}">{action.action}</span>
                                <a href="/space/{action.name}" class="space-name">{action.name}</a>
                            </div>
                            {#if action.action === 'BID' && action.total_burned}
                                <div class="bid-value">
                                    {formatBTC(action.total_burned)}
                                </div>
                            {/if}
                        </div>

                        <div class="action-meta">
                            <div class="meta-item">
                                <span class="meta-label">Block</span>
                                <a href="/block/{action.height}" class="meta-value block-link">
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
        margin-bottom: var(--space-6);
    }

    .actions-container {
        width: 100%;
    }

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-6);
    }

    .action-card {
        display: flex;
        flex-direction: column;
        height: 160px;
        padding: var(--space-6);
        background: var(--bg-primary-light);
        border: var(--border-width-1) solid var(--color-primary);
        border-bottom-width: var(--border-width-8);
        border-radius: var(--border-radius-3xl);
        box-shadow: var(--shadow-sm);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .action-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }


        .action-header {
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
    }

    .action-main {
        display: flex;
        align-items: center;
        gap: var(--space-4); /* Increased from var(--space-3) */
    }

    .action-badge {
        font-size: var(--font-size-sm);
        font-weight: 500;
        padding: var(--space-1) var(--space-3); /* Increased horizontal padding */
        border-radius: var(--border-radius-lg);
        min-width: 80px; /* Added to ensure consistent width */
        text-align: center; /* Center the text */
    }

    .space-name {
        color: var(--text-primary);
        text-decoration: none;
        font-size: var(--font-size-lg);
        font-weight: 600;
        flex: 1; /* Allow it to take remaining space */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .space-name:hover {
        color: var(--color-primary);
    }

    .bid-value {
        font-weight: 600;
        font-size: var(--font-size-lg);
        color: var(--color-primary);
    }

    .revoke-reason {
        font-size: var(--font-size-sm);
        color: var(--color-error);
        margin-bottom: var(--space-4);
    }

    .action-meta {
        margin-top: auto;
        padding-top: var(--space-4);
        border-top: var(--border-width-1) solid var(--border-color);
        display: flex;
        justify-content: space-between;
        gap: var(--space-4);
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .meta-label {
        font-size: var(--font-size-xs);
        color: var(--text-muted);
    }

    .meta-value {
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--text-primary);
    }

    .block-link {
        color: var(--color-primary);
        text-decoration: none;
    }

    .block-link:hover {
        text-decoration: underline;
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
        padding: var(--space-4);
        background: rgb(254 226 226);
        border-radius: var(--border-radius-lg);
        color: rgb(185 28 28);
        text-align: center;
    }

    .error-icon {
        margin-right: var(--space-2);
    }

    @media (max-width: 640px) {
        .actions-grid {
            grid-template-columns: 1fr;
        }

        .action-card {
            padding: var(--space-4);
            height: 140px;
        }

        .action-meta {
            gap: var(--space-2);
        }
    }
</style>
