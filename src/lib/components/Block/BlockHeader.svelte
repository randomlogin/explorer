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
        <div class="flex items-center gap-2">
            <span class="hash">{blockHeader.hash}</span>
            <CopyButton value={blockHeader.hash} />
        </div>
    </div>
    <div class="details">
        <div class="detail-item">
            {#if blockHeader.height == -2}
                <span class="detail-value">Orphan block</span>
            {:else if blockHeader.height == -1}
                <span class="detail-value">Mempool</span>
            {:else}
                <span class="detail-value">{blockHeader.height}</span>
            {/if}
            <span class="detail-label">Height</span>
        </div>
        {#if blockHeader.height >= 0}
            <div class="detail-item">
                <span class="detail-value">{blockHeader.confirmations}</span>
                <span class="detail-label">Confirmations</span>
            </div>
        {/if}
        <div class="detail-item">
            <span class="detail-value">{dayjs.unix(blockHeader.time).format('MMM D, YYYY HH:mm ')}</span>
            <span class="detail-label">Time</span>
        </div>
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
            <div class="flex items-center gap-2">
                <span class="detail-value">{blockHeader.hash_merkle_root}</span>
                <CopyButton value={blockHeader.hash_merkle_root} />
            </div>
            <span class="detail-label">Merkle Root</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{blockHeader.tx_count}</span>
            <span class="detail-label">Transactions</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{blockHeader.vmetaout_count}</span>
            <span class="detail-label">Spaces Events</span>
        </div>
    </div>
</div>
<style>
@import '$lib/styles/headers.css';
</style>
