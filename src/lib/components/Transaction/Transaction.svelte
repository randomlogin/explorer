<script lang="ts">
    import dayjs from 'dayjs';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    import TransactionDetails from '$lib/components/Transaction/TransactionDetails.svelte';
    import CopyButton from '$lib/components/CopyButton.svelte';
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
    <div class="details">

        <a href={blockLink}>
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
                    <span class="detail-value">{dayjs.unix(data.block.time).format('MMM DD HH:MM')}</span>
                    <span class="detail-label">Time</span>
                </div>
            {/if}
            <div class="detail-item">
                <span class="detail-value">{data.version}</span>
                <span class="detail-label">Version</span>
            </div>
            {#if data.index > 0}
            <div class="detail-item">
                <span class="detail-value">{data.index}</span>
                <span class="detail-label">Index in the block</span>
            </div>
            {/if}
            <div class="detail-item">
                <span class="detail-value">{data.weight}</span>
                <span class="detail-label">Weight</span>
            </div>
            <div class="detail-item">
                <span class="detail-value">{data.fee}</span>
            <span class="detail-label">Fee</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.locktime}</span>
            <span class="detail-label">Lock Time</span>
        </div>
        {#if data.block && data.block.height >= 0}
        <div class="detail-item">
            <span class="detail-value">{data.confirmations}</span>
            <span class="detail-label">Confirmations</span>
        </div>
        {/if}
        <div class="detail-item">
            <span class="detail-value">{data.vmetaouts.length}</span>
            <span class="detail-label">Spaces Actions</span>
        </div>
    </div>
    <TransactionDetails transaction={data} showAllInputsOutputs={true} />
</div>

<style>
@import '$lib/styles/headers.css';
</style>
