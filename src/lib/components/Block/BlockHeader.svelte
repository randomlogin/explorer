<script lang="ts">
    import dayjs from 'dayjs';
    import CopyButton from '$lib/components/CopyButton.svelte';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    dayjs.extend(LocalizedFormat);
    export let blockHeader;
</script>

<div class="container">
    <div class="header">
        <h1 class="title">Block</h1>
        <span class="hash">{blockHeader.hash}</span>
        <CopyButton value={blockHeader.hash} />
    </div>

    <!-- Primary Info -->
    <div class="primary-info">
        <div class="primary-item">
            {#if blockHeader.height == -2}
                <span class="primary-value">Orphan</span>
            {:else if blockHeader.height == -1}
                <span class="primary-value">Mempool</span>
            {:else}
                <span class="primary-value">{blockHeader.height}</span>
            {/if}
            <span class="primary-label">Height</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{blockHeader.confirmations >= 0 ? blockHeader.confirmations : 'N/A'}</span>
            <span class="primary-label">Confirmations</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{dayjs.unix(blockHeader.time).format('MMM D, HH:mm')}</span>
            <span class="primary-label">Time</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{blockHeader.tx_count}</span>
            <span class="primary-label">Transactions</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{blockHeader.vmetaout_count}</span>
            <span class="primary-label">Spaces Events</span>
        </div>
    </div>

    <!-- Secondary Info -->
    <div class="details">
        <div class="detail-item">
            <span class="detail-value">{blockHeader.difficulty}</span>
            <span class="detail-label">Difficulty</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{blockHeader.bits}</span>
            <span class="detail-label">Bits</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{blockHeader.nonce}</span>
            <span class="detail-label">Nonce</span>
        </div>
        <div class="detail-item">
            <div class="detail-value-with-copy">
                <span class="detail-value">{blockHeader.hash_merkle_root.slice(0, 8)}...{blockHeader.hash_merkle_root.slice(-8)}</span>
                <CopyButton value={blockHeader.hash_merkle_root} />
            </div>
            <span class="detail-label">Merkle Root</span>
        </div>
    </div>
</div>
<style>
@import '$lib/styles/headers.css';

.primary-info {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
}

.primary-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    align-items: center;
    text-align: center;
}

.primary-value {
    font-size: var(--font-size-3xl);
    color: var(--color-primary);
    font-weight: 700;
    font-family: monospace;
    white-space: nowrap;
}

.primary-label {
    font-size: var(--font-size-lg);
    color: var(--text-muted);
    font-weight: 500;
}

.details {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
}

.detail-value-with-copy {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

@media (max-width: 768px) {
    .primary-info {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
    }

    .primary-value {
        font-size: var(--font-size-2xl);
    }

    .details {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
    }
}

@media (max-width: 640px) {
    .primary-value {
        font-size: var(--font-size-xl);
    }
}
</style>
