<script lang="ts">
    import dayjs from 'dayjs';
    import './BlockHeader.css';

    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    dayjs.extend(LocalizedFormat);

    const numberFormatter = new Intl.NumberFormat();

    export let blockHeader;
</script>

<div class="block-container">
    <div class="block-header">
        <h1 class="block-title">Block</h1> 
        <span class="block-hash">{blockHeader.hash}</span>
    </div>
    <div class="block-details">
        <div class="detail-item">
            {#if blockHeader.height == -2}
                <span class="detail-value">Orphaned block</span>
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
            <span class="detail-value">{blockHeader.hash_merkle_root}</span>
            <span class="detail-label">Merkle Root</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{blockHeader.tx_count}</span>
            <span class="detail-label">Transactions</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">PLACEHOLDER</span>
            <span class="detail-label">Spaces actions</span>
        </div>
    </div>
</div>
