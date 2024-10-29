<script lang="ts">
    import dayjs from 'dayjs';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    import TransactionDetails from '$lib/components/TransactionDetails.svelte';
    import CopyButton from '$lib/components/CopyButton.svelte';
    /* import { numberFormatter } from '$lib/utils/formatters'; */
    dayjs.extend(LocalizedFormat);

    export let data;
</script>

<div class="container">
    <div class="header">
        <h1 class="title">Transaction</h1> 
        <span class="hash">{data.txid}</span>
        <CopyButton value={data.txid} />
    </div>
    <div class="details">
        <a href={`/block/${data.block.height}`} class="block-link">
            <div class="detail-item">
                <span class="detail-value">{data.block.height}</span>
                <span class="detail-label">Block</span>
            </div>
        </a>
        <div class="detail-item">
            <span class="detail-value">{dayjs.unix(data.block.time).format('MMM DD, HH:MM')}</span>
            <span class="detail-label">Time</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.version}</span>
            <span class="detail-label">Version</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.index}</span>
            <span class="detail-label">Index in the block</span>
        </div>
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
        <div class="detail-item">
            <span class="detail-value">{data.confirmations}</span>
            <span class="detail-label">Confirmations</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">PLACEHOLDER</span>
            <span class="detail-label">Spaces Actions</span>
        </div>
    </div>
    <TransactionDetails transaction={data} showAllInputsOutputs={true} />
</div>

<style>
@import '$lib/styles/headers.css';
</style>
