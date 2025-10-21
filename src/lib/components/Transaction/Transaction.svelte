<script lang="ts">
    import dayjs from 'dayjs';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    import TransactionSpaces from '$lib/components/Transaction/TransactionSpaces.svelte';
    import CopyButton from '$lib/components/CopyButton.svelte';
    import { getMempoolUrl, formatBTC } from '$lib/utils/formatters';
    dayjs.extend(LocalizedFormat);
    $: blockLink = data.block.height >= 0 ?
        `/block/${data.block.height}` :
        data.block.height === -1 ?
        '/mempool'
            : `/block/${data.block.hash}`;

    export let data;
</script>

<div class="container">
    <div class="header">
        <h1 class="title">Transaction</h1>
        <span class="hash">{data.txid}</span>
        <CopyButton value={data.txid} />
    </div>
    <!-- Primary Info -->
    <div class="primary-info">
        <div class="primary-item">
            <span class="primary-value">{data.input_count} → {data.output_count}</span>
            <span class="primary-label">Inputs / Outputs</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{formatBTC(data.total_output_value)}</span>
            <span class="primary-label">Total value</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{data.vmetaouts.length}</span>
            <span class="primary-label">Spaces events</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{data.confirmations > 0 ? data.confirmations : 'Unconfirmed'}</span>
            <span class="primary-label">Confirmations</span>
        </div>
        <div class="primary-item">
            <span class="primary-value">{formatBTC(data.fee)}</span>
            <span class="primary-label">Fee</span>
        </div>
    </div>

    <!-- Secondary Info -->
    <div class="details">
        <a href={blockLink} class="detail-link">
            <div class="detail-item">
                {#if data.block.height >= 0 }
                    <span class="detail-value">{data.block.height}</span>
                {:else if data.block.height == -1 }
                    <span class="detail-value">Mempool</span>
                {:else if data.block.height == -2 }
                    <span class="detail-value">Orphan block</span>
                {/if}
                <span class="detail-label">Block</span>
            </div>
        </a>
        {#if data.block.time > 0}
            <div class="detail-item">
                <span class="detail-value">{dayjs.unix(data.block.time).format('MMM DD HH:mm')}</span>
                <span class="detail-label">Time</span>
            </div>
        {/if}
        <div class="detail-item">
            <span class="detail-value">{data.weight}</span>
            <span class="detail-label">Weight</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.vsize}</span>
            <span class="detail-label">vSize</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.size}</span>
            <span class="detail-label">Size</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.index >= 0 ? data.index : 'N/A'}</span>
            <span class="detail-label">Index in the block</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.version}</span>
            <span class="detail-label">Version</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.locktime}</span>
            <span class="detail-label">Lock time</span>
        </div>
    </div>
    {#if data.vmetaouts?.length > 0}
        <TransactionSpaces vmetaouts={data.vmetaouts} />
    {/if}
    <div class="mempool-link-container">
        <a href={getMempoolUrl(`tx/${data.txid}`)} target="_blank" rel="noopener noreferrer" class="mempool-link">
            View full tx details on mempool.space →
        </a>
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

.detail-link {
    text-decoration: none;
    color: inherit;
}

.detail-link:hover .detail-value {
    color: var(--color-primary-dark);
}

.mempool-link-container {
    text-align: center;
}

.mempool-link {
    display: inline-block;
    font-size: 1.5rem;
    color: var(--color-link);
    text-decoration: underline;
    transition: color 0.2s;
}

.mempool-link:hover {
    color: var(--color-link-hover);
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
