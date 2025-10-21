<script lang="ts">
    import { formatBTC, displayUnicodeSpace } from '$lib/utils/formatters';
    import { parseAddress } from '$lib/utils/address-parsers';
    import { Buffer } from 'buffer';
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

    function getTransferAddress(scriptPubKey: string): string | null {
        try {
            const buffer = Buffer.from(scriptPubKey, 'hex');
            return parseAddress(buffer);
        } catch (error) {
            console.warn('Failed to parse transfer address:', error);
            return null;
        }
    }
</script>

<div class="vmetaouts-section">
    <h4 class="section-title">Spaces Events</h4>
    <div class="section-content">
        {#each vmetaouts.slice(0, displayCount) as vmetaout, index (vmetaout.name)}
            <div class="vmetaout-item" transition:fly={{ y: 20, duration: 300, delay: index * 50 }} >
                <div class="vmetaout-header">
                    <div class="name-action">
                        <a href="/space/{vmetaout.name}" class="space-name">
                            {displayUnicodeSpace(vmetaout.name)}
                        </a>
                        {#if vmetaout.action}
                            <span class="dot">•</span>
                            <span class="action-type {getActionColor(vmetaout.action)}">
                                {vmetaout.action}
                            </span>
                        {/if}
                        {#if vmetaout.action === 'BID'}
                            <span class="dot">•</span>
                            <span class="bid-value">{formatBTC(vmetaout.total_burned)}</span>
                        {/if}
                    </div>
                </div>
                {#if vmetaout.action === 'REVOKE' && vmetaout.reason}
                    <div class="revoke-reason">
                        Revoked due to: {formatReason(vmetaout.reason)}
                    </div>
                {/if}

                <div class="vmetaout-details">
                    {#if vmetaout.action === 'TRANSFER' && vmetaout.scriptPubKey}
                        {@const address = getTransferAddress(vmetaout.scriptPubKey)}
                        {#if address}
                            <div class="detail-item address-item">
                                <span class="detail-label">Transferred to</span>
                                <span class="detail-value">{address}</span>
                            </div>
                        {/if}
                    {/if}
                    {#if vmetaout.burn_increment && vmetaout.action !== 'REVOKE'}
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
    @import '$lib/styles/common.css';

    .vmetaouts-section {
        width: 100%;
        background: var(--bg-secondary);
        border: var(--border-width-1) solid var(--border-color);
        border-radius: var(--border-radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
    }

    .section-title {
        font-size: var(--font-size-xl);
        padding: var(--space-4) var(--space-6);
        margin: 0;
        border-bottom: var(--border-width-1) solid var(--border-color);
        background: var(--bg-secondary);
    }

    .section-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-4) var(--space-6);
    }

    .vmetaout-item {
        background: var(--bg-primary);
        border-radius: var(--border-radius-lg);
        padding: var(--space-4);
        border: var(--border-width-1) solid var(--border-color);
        transition: var(--transition-all);
    }

    .vmetaout-item:hover {
        transform: translateY(-2px);
        border-color: var(--border-hover);
        box-shadow: var(--shadow-md);
    }

    .vmetaout-header {
        margin-bottom: var(--space-2);
    }

    .name-action {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-size: var(--font-size-xl);
    }

    .space-name {
        font-weight: 700;
        text-decoration: none;
    }

    .space-name:hover {
        text-decoration: underline;
    }


    .dot {
        color: var(--font-size-muted);
    }

    .revoke-reason {
        margin-bottom: var(--space-4);
        padding: var(--space-3);
        background-color: rgb(254 226 226);
        color: rgb(185 28 28);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
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
        min-width: 0;
    }

    .address-item {
        grid-column: 1 / -1;
    }

    .detail-label {
        color: var(--font-size-muted);
        font-size: var(--font-size-lg);
    }

    .detail-value {
        font-size: var(--font-size-lg);
        font-weight: 500;
        word-break: break-all;
        overflow-wrap: break-word;
    }

    .error-message {
        margin-top: var(--space-4);
        padding: var(--space-3);
        background-color: rgb(254 226 226);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
    }

    .error-label {
        font-weight: 500;
        color: rgb(185 28 28);
        margin-right: var(--space-2);
    }

    .error-text {
        color: rgb(185 28 28);
    }

    .show-more {
        margin-top: var(--space-2);
        padding: var(--space-2) var(--space-4);
        background: var(--bg-surface);
        border: var(--border-width-1) solid var(--border-color);
        border-radius: var(--radius-full);
        color: var(--font-size-muted);
        font-size: var(--font-size-sm);
        cursor: pointer;
    }

    .show-more:hover {
        background: var(--bg-surface-hover);
        color: var(--font-size-base);
    }
</style>
