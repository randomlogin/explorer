<script lang="ts">
    import { formatBTC } from '$lib/utils/formatters';
    import { fly } from 'svelte/transition';

    export let vmetaouts;

    export let maxDisplay = 5;
    export let showAll = false;

    $: displayCount = showAll ? vmetaouts.length : Math.min(maxDisplay, vmetaouts.length);

    function formatReason(reason: string): string {
        return reason
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function getActionColor(action: string | undefined): string {
        switch (action) {
            case 'REVOKE': return 'text-red-600';
            case 'BID': return 'text-green-600';
            case 'TRANSFER': return 'text-purple-600';
            case 'ROLLOUT': return 'text-yellow-600';
            case 'RESERVE': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    }
</script>

<div class="vmetaouts-section">
    <h2 class="section-title">Spaces Actions</h2>
    <div class="section-content">
        {#each vmetaouts.slice(0, displayCount) as vmetaout, index (vmetaout.name)}
            <div class="vmetaout-item" transition:fly={{ y: 20, duration: 300, delay: index * 50 }} >
                <div class="vmetaout-header">
                    <div class="name-action">
                        <a href="/space/{vmetaout.name}" class="space-name">
                            {vmetaout.name}
                        </a>
                        {#if vmetaout.action}
                            <span class="dot">•</span>
                            <span class="action {getActionColor(vmetaout.action)}">
                                {vmetaout.action}
                            </span>
                        {/if}
                    </div>
                    {#if vmetaout.action === 'BID'}
                        <div class="bid-value">
                            <span class="value-amount">{formatBTC(vmetaout.total_burned)}</span>
                        </div>
                    {/if}
                </div>
                {#if vmetaout.action === 'REVOKE' && vmetaout.reason}
                    <div class="revoke-reason">
                        Revoked due to: {formatReason(vmetaout.reason)}
                    </div>
                {/if}

                <div class="vmetaout-details">
                    {#if vmetaout.burn_increment}
                        <div class="detail-item">
                            <span class="detail-label">Burn Increment</span>
                            <span class="detail-value">{formatBTC(vmetaout.burn_increment)}</span>
                        </div>
                    {/if}
                    {#if vmetaout.total_burned}
                        <div class="detail-item">
                            <span class="detail-label">Total Burned</span>
                            <span class="detail-value">{formatBTC(vmetaout.total_burned)}</span>
                        </div>
                    {/if}
                    {#if vmetaout.claim_height}
                        <div class="detail-item">
                            <span class="detail-label">Claim Height</span>
                            <span class="detail-value">{vmetaout.claim_height}</span>
                        </div>
                    {/if}
                    {#if vmetaout.expire_height}
                        <div class="detail-item">
                            <span class="detail-label">Expire Height</span>
                            <span class="detail-value">{vmetaout.expire_height}</span>
                        </div>
                    {/if}
                </div>

                {#if vmetaout.script_error}
                    <div class="error-message">
                        <span class="error-label">Script Error:</span>
                        <span class="error-text">{vmetaout.script_error}</span>
                    </div>
                {/if}

                {#if index < displayCount - 1}
                    <div class="separator" />
                {/if}
                    </div>
        {/each}

        {#if vmetaouts.length > maxDisplay && !showAll}
            <button 
                class="show-more"
                on:click={() => showAll = true}
                >
                Show {vmetaouts.length - maxDisplay} more actions
            </button>
        {/if}
            </div>
    </div>

<style>
    .vmetaouts-section {
        margin-top: var(--space-6);
        width: 100%;
    }

    .section-title {
        font-size: var(--text-xl);
        font-weight: 700;
        margin-bottom: var(--space-4);
        padding-bottom: var(--space-2);
        border-bottom: var(--border-width-1) solid var(--border-color);
    }

    .section-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .vmetaout-item {
        background: var(--bg-surface);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .vmetaout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-4);
    }

    .name-action {
        display: flex;
        align-items: center;
        gap: var(--space-3);
    }

    .space-name {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--color-primary);
        text-decoration: none;
    }

    .space-name:hover {
        text-decoration: underline;
    }

    .action {
        font-weight: 500;
        font-size: var(--text-sm);
    }

    .revoke-reason {
        margin-bottom: var(--space-4);
        padding: var(--space-3);
        background-color: rgb(254 226 226);
        color: rgb(185 28 28);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
    }

    .bid-value {
        font-weight: 600;
        color: rgb(22 163 74);
    }

    .vmetaout-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--space-4);
    }

    .detail-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
    }

    .detail-label {
        color: var(--text-muted);
        font-size: var(--text-sm);
    }

    .detail-value {
        font-weight: 500;
    }

    .error-message {
        margin-top: var(--space-4);
        padding: var(--space-3);
        background-color: rgb(254 226 226);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
    }

    .error-label {
        font-weight: 500;
        color: rgb(185 28 28);
        margin-right: var(--space-2);
    }

    .error-text {
        color: rgb(185 28 28);
    }

    .separator {
        height: var(--border-width-1);
        background: var(--border-color);
        margin: var(--space-4) 0;
        opacity: 0.5;
    }

    .show-more {
        margin-top: var(--space-2);
        padding: var(--space-2) var(--space-4);
        background: var(--bg-surface);
        border: var(--border-width-1) solid var(--border-color);
        border-radius: var(--radius-full);
        color: var(--text-muted);
        font-size: var(--text-sm);
        cursor: pointer;
    }

    .show-more:hover {
        background: var(--bg-surface-hover);
        color: var(--text-base);
    }
</style>
